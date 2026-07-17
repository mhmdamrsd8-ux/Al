import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy init for Google Gen AI to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || 'MOCK_KEY_IF_ABSENT',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API endpoint to generate code based on user prompt using Google GenAI SDK
  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { prompt, existingFiles, chatHistory } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'الرجاء إدخال فكرة المشروع البرمجي.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(403).json({
          error: 'مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في لوحة الإعدادات Secrets.',
          isMissingApiKey: true
        });
      }

      const client = getAiClient();
      
      // Let's write a robust prompt directing the AI to generate static files (HTML, CSS, JS/Tailwind)
      // that can run instantly inside an iframe sandboxed workspace.
      const systemInstruction = `You are X AI Studio, a cutting-edge world-class senior AI software engineer and architect similar to Lovable or Bolt.new.
Your job is to generate a fully functioning web application based on the user's requirements.
The application MUST be complete, self-contained, and interactive. It should be written in clean HTML, CSS (Tailwind via CDN is preferred), and modern JavaScript so that it can render instantly inside a preview iframe.

IMPORTANT RULES FOR THE GENERATED APP:
1. Always include a beautifully styled, comprehensive 'index.html' which serves as the entry point.
2. Use Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>) in index.html for exquisite layout and visual styling.
3. Use Lucide Icons CDN (<script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>) for crisp developer icons. Call 'lucide.createIcons()' at the end of scripts.
4. Integrate rich features: make sure forms actually add data to the screen, cards are clickable, buttons have beautiful hover transitions, and inputs have validations.
5. Create helper files like 'README.md' explaining how to use the app, and optionally 'style.css' or other scripts if they make the app more modular.
6. The user is from Saudi Arabia/Arab world, so if they prompt in Arabic, prioritize Arabic texts, right-to-left layout (dir="rtl"), and exquisite Arabic fonts (like Cairo or Almarai via Google Fonts).
7. Do not return incomplete code or placeholders (e.g. "// TODO"). Write out all code completely.
8. Output MUST strictly match the requested JSON schema.`;

      // Define a structure for existing files context to pass to Gemini
      let existingContext = '';
      if (existingFiles && Object.keys(existingFiles).length > 0) {
        existingContext = `Here are the files currently present in the workspace:\n`;
        for (const [filePath, content] of Object.entries(existingFiles)) {
          existingContext += `--- FILE: ${filePath} ---\n${content}\n\n`;
        }
      }

      let historyContext = '';
      if (chatHistory && chatHistory.length > 0) {
        historyContext = `Here is the conversation history:\n` + chatHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n') + '\n';
      }

      const contents = `${historyContext}${existingContext}\nUser Request: ${prompt}\n\nPlease build or update the application files now. Provide beautiful UI, full interactivity, responsive layout, and detailed functionality.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectName: { 
                type: Type.STRING,
                description: 'The name of the generated project (brief and descriptive in Arabic if prompt is Arabic, otherwise English).' 
              },
              description: { 
                type: Type.STRING,
                description: 'A 1-sentence description of the generated system.' 
              },
              files: {
                type: Type.ARRAY,
                description: 'A list of files to write or update in the workspace.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    path: { 
                      type: Type.STRING,
                      description: 'The relative file path, e.g. "index.html" or "style.css" or "app.js".' 
                    },
                    content: { 
                      type: Type.STRING,
                      description: 'The full complete content of the file. No truncations, no placeholders.' 
                    }
                  },
                  required: ['path', 'content']
                }
              },
              terminalLog: { 
                type: Type.STRING,
                description: 'A list of mock terminal outputs summarizing the installation and build process, separated by newlines.' 
              }
            },
            required: ['projectName', 'description', 'files', 'terminalLog']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('لم يقم نموذج الذكاء الاصطناعي بإرجاع أي مخرجات.');
      }

      const parsedResult = JSON.parse(responseText.trim());
      return res.json(parsedResult);

    } catch (error: any) {
      console.error('Gemini Generate Error:', error);
      return res.status(500).json({ 
        error: error.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب.' 
      });
    }
  });

  // Setup Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[X AI Studio Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
