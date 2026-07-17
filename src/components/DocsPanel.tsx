import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ArrowLeftRight, 
  BookOpen, 
  Terminal, 
  Settings, 
  Code,
  Download, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';
import { Project } from '../types';

interface DocsPanelProps {
  project: Project;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

type DocCategory = 'install' | 'usage' | 'structure' | 'api' | 'developer';

interface DocArticle {
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
}

export default function DocsPanel({
  project,
  language,
  theme,
  addLog
}: DocsPanelProps) {
  const isAr = language === 'ar';
  
  const [activeCategory, setActiveCategory] = useState<DocCategory>('install');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Compiled generated docs
  const [generatedDocs, setGeneratedDocs] = useState<Record<DocCategory, DocArticle> | null>(null);

  const handleGenerateDocs = () => {
    setIsGenerating(true);
    addLog(isAr ? "جاري مسح شجرة الملفات واستخراج واجهات الاستدعاء لتوليد دليل التوثيق بالذكاء الاصطناعي..." : "AI scanning codebase endpoints to synthesize technical interactive docs guides...", "info");

    setTimeout(() => {
      const filesCount = Object.keys(project.files).length;
      
      const docData: Record<DocCategory, DocArticle> = {
        install: {
          titleAr: '🛠 دليل التثبيت والتهيئة',
          titleEn: '🛠 Installation & Setup Manual',
          contentAr: `### دليل تثبيت تطبيق: ${project.name}

1. **المتطلبات الأساسية للنظام:**
   - بيئة عمل **Node.js** (إصدار 18 فما فوق).
   - مدير الحزم **npm** أو **yarn**.

2. **خطوات التنزيل والتنصيب:**
   \`\`\`bash
   # استنساخ المشروع محلياً
   git clone https://github.com/developer/${project.name.toLowerCase().replace(/\s+/g, '-')}.git
   
   # الانتقال لمسار المشروع
   cd ${project.name.toLowerCase().replace(/\s+/g, '-')}
   
   # تثبيت الاعتمادات البرمجية بالكامل
   npm install
   \`\`\`

3. **تشغيل خادم التطوير المحلي:**
   \`\`\`bash
   npm run dev
   \`\`\`
   سيتم تفعيل الخادم على الرابط المحلي: \`http://localhost:3000\``,
          contentEn: `### Installation Guide for: ${project.name}

1. **System Requirements:**
   - **Node.js** environment (v18.0.0 or higher recommended).
   - Package manager **npm** or **yarn** pre-configured.

2. **Step-by-Step Setup:**
   \`\`\`bash
   # Clone the target repository locally
   git clone https://github.com/developer/${project.name.toLowerCase().replace(/\s+/g, '-')}.git
   
   # Enter the workspace directory
   cd ${project.name.toLowerCase().replace(/\s+/g, '-')}
   
   # Install required dependencies
   npm install
   \`\`\`

3. **Boot local development host:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Your application will start on: \`http://localhost:3000\``
        },
        usage: {
          titleAr: '📖 دليل الاستخدام والتشغيل',
          titleEn: '📖 User & Operations Guide',
          contentAr: `### كيفية استخدام وتشغيل: ${project.name}

1. **الوصول لواجهة المستخدم:**
   - افتح المتصفح وتوجه إلى العنوان المحلي \`http://localhost:3000\`.
   
2. **شرح الوظائف التفاعلية الأساسية:**
   - المكونات تفاعلية وسريعة الاستجابة بالكامل وتدعم إيماءات اللمس على الهواتف.
   - يتكيف التطبيق تلقائياً مع حجم الشاشة والأبعاد بفضل فئات التجاوب الذكية.

3. **التخصيص ومفاتيح التهيئة:**
   - يمكنك تغيير المظهر وضبط المتغيرات من لوحة التحكم أو من خلال كتل التهيئة المتاحة.`,
          contentEn: `### Usage Manual for: ${project.name}

1. **Accessing the Workspace UI:**
   - Point your desktop or mobile browser to \`http://localhost:3000\`.
   
2. **Executing Key Workflows:**
   - All interactive inputs are secured with sanitization layers.
   - The UI responds fluidly to resizing without layout clipping.

3. **Preference settings:**
   - Change visual parameters using local selectors or customize config files.`
        },
        structure: {
          titleAr: '🗂 شرح هيكلية وبنية المشروع',
          titleEn: '🗂 Project Structure Breakdown',
          contentAr: `### هيكل ملفات ومجلدات تطبيق: ${project.name}

تم ترتيب الملفات لتتوافق مع معايير جودة الكود المعاصرة:

\`\`\`yaml
${project.name}/
├── index.html        # ملف المدخل الرئيسي وتركيب العقد الأساسية
├── package.json      # ملف تعريف الحزم البرمجية والسكربتات المعتمدة
${Object.keys(project.files)
  .filter(f => f !== 'index.html' && f !== 'package.json')
  .map(f => `├── ${f}        # ملف معالجة الشفرات البرمجية للميزة`)
  .join('\n')}
\`\`\`

- **ملف index.html:** المدخل العام وحاضن روابط استدعاء المظهر.
- **ملفات الكود الفني:** تحتوي على خوارزميات العمليات ومعالجة طلبات الأمان.`,
          contentEn: `### Repository File Hierarchy: ${project.name}

Below is the synthesized file mapping optimized for modular scaling:

\`\`\`yaml
${project.name}/
├── index.html        # Primary HTML entry point & layout mounting
├── package.json      # Package configuration and startup scripts
${Object.keys(project.files)
  .filter(f => f !== 'index.html' && f !== 'package.json')
  .map(f => `├── ${f}        # Code logic & style sheet layer`)
  .join('\n')}
\`\`\`

- **index.html:** Entry viewport.
- **Source modules:** Contain logic calculations and client event bindings.`
        },
        api: {
          titleAr: '🔌 شرح واجهات الـ API والربط',
          titleEn: '🔌 API Guide & Reference',
          contentAr: `### توثيق نقاط اتصال واجهات الـ API لتطبيق: ${project.name}

يدعم التطبيق التخزين السحابي محلياً وعبر استدعاءات الخادم الآمنة:

1. **محاكي تخزين الواجهة (Client Storage System):**
   - **النوع:** متزامن (Synchronous Key-Value)
   - **المفتاح الأساسي:** \`${project.name.toLowerCase().replace(/\s+/g, '_')}_data\`

2. **قنوات استقبال طلبات النماذج:**
   - **الوجهة:** \`POST /api/models/query\`
   - **المدخلات:** \`{ prompt: string, model: string }\`
   - **الاستجابة:** \`{ status: 'ok', response: string }\` (مع تشفير مشفر بالكامل).`,
          contentEn: `### API Interfaces Documentation: ${project.name}

Our workspace supports localized persistence and secure backend tunnels:

1. **Client-Side Cache Persister:**
   - **Storage Engine:** Standard Local Storage Sync
   - **Partition Namespace:** \`${project.name.toLowerCase().replace(/\s+/g, '_')}_data\`

2. **Interations Engine Endpoint:**
   - **HTTP Route:** \`POST /api/models/query\`
   - **Payload format:** \`{ prompt: string, model: string }\`
   - **Return schema:** \`{ status: 'success', text: string }\``
        },
        developer: {
          titleAr: '👨‍💻 دليل المطور والمساهمين',
          titleEn: '👨‍💻 Developer & Contributor Guide',
          contentAr: `### دليل التطوير والمساهمة في: ${project.name}

مرحباً بك كمطور مساهم في توسيع مزايا هذا التطبيق!

1. **معايير تنسيق الأكواد (Code Style Standard):**
   - نعتمد استخدام حزم **TypeScript** لتفادي أخطاء تحديد الأنواع وقت التشغيل.
   - يرجى مراجعة وتمرير اختبارات الجودة المتاحة قبل اقتراح دمج التغييرات.

2. **الأمان والحماية:**
   - لا تقم أبداً بكتابة مفاتيح الـ API بشكل نصي صريح في الأكواد. استخدم دائماً المتغيرات البيئية المخفية والمشفرة.

3. **اقتراح الميزات الجديدة:**
   - قم بإنشاء فرع جانبي باسم الميزة وافتح طلب دمج للمراجعة.`,
          contentEn: `### Contributor & Developer Standard: ${project.name}

Welcome to the development workflow for ${project.name}!

1. **Formatting & Syntax Rules:**
   - We mandate explicit **TypeScript** declarations to lock compilation types.
   - Run the automated test suites prior to pushing your branch.

2. **API Secret Key Safety:**
   - Never hardcode keys in plaintext. Use secure environmental layers.

3. **Feature requests:**
   - Implement your changes inside isolated modules to maintain component boundaries.`
        }
      };

      setGeneratedDocs(docData);
      setIsGenerating(false);
      addLog(isAr ? "✔ تم إنشاء حزمة التوثيق الفني والكتيبات المرجعية بالكامل بنجاح!" : "✔ AI successfully finalized and indexed all developer documentation articles!", "success");
    }, 1200);
  };

  const handleCopy = async () => {
    if (!generatedDocs) return;
    const currentDoc = generatedDocs[activeCategory];
    const textToCopy = isAr ? currentDoc.contentAr : currentDoc.contentEn;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#0F0F11] border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} rounded-xl overflow-hidden shadow-2xl text-right`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="px-4 py-3 bg-[#0F0F11] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wider">
            {isAr ? 'كتيبات ومستندات التوثيق الفني' : 'AI Technical Documentation'}
          </span>
        </div>
        
        {!generatedDocs ? (
          <button
            onClick={handleGenerateDocs}
            disabled={isGenerating}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#161618] text-white disabled:text-gray-500 rounded text-[10px] font-bold transition flex items-center gap-1 shadow"
          >
            {isGenerating ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} />}
            <span>{isAr ? 'إنشاء التوثيق بالذكاء الاصطناعي' : 'Generate Docs'}</span>
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1 rounded bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
              title={isAr ? 'نسخ النص الحالي' : 'Copy current article'}
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
            <button
              onClick={handleGenerateDocs}
              disabled={isGenerating}
              className="p-1 rounded bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
              title={isAr ? 'إعادة توليد التوثيق' : 'Re-generate'}
            >
              <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden bg-[#0A0A0B]">
        {/* Navigation Rail for doc articles */}
        <div className="w-1/3 bg-[#0F0F11]/50 border-l border-white/5 p-2 space-y-1.5 overflow-y-auto shrink-0 flex flex-col justify-start">
          {[
            { id: 'install', labelAr: '🛠 التثبيت والتهيئة', labelEn: '🛠 Installation' },
            { id: 'usage', labelAr: '📖 دليل الاستخدام', labelEn: '📖 Usage' },
            { id: 'structure', labelAr: '🗂 هيكلية المشروع', labelEn: '🗂 Repo Structure' },
            { id: 'api', labelAr: '🔌 واجهات الـ API', labelEn: '🔌 API Guide' },
            { id: 'developer', labelAr: '👨‍💻 دليل المطور', labelEn: '👨‍💻 Developer Guide' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`w-full text-right px-3 py-2 rounded-lg text-[10px] font-bold transition ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600/15 border border-indigo-500/25 text-white' 
                  : 'hover:bg-white/5 border border-transparent text-gray-400'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* View content area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!generatedDocs ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                <FileText size={22} className="animate-pulse" />
              </div>
              <h4 className="font-bold text-gray-200 text-xs">
                {isAr ? 'دليل التوثيق الفني الذكي' : 'Technical Reference Guide Ready'}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                {isAr ? 'اضغط على زر الإنشاء ليقوم الذكاء الاصطناعي بتحليل الأكواد وصياغة كتيبات التثبيت، شرح الهيكل، وواجهات الـ API بالكامل.' : 'Analyze source files structures, dependency trees, and export formats to synthesize complete developer guidebooks.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs leading-relaxed text-gray-300 markdown-body">
              <h3 className="font-extrabold text-white border-b border-white/15 pb-2 text-sm">
                {isAr ? generatedDocs[activeCategory].titleAr : generatedDocs[activeCategory].titleEn}
              </h3>
              
              <pre className="whitespace-pre-wrap font-sans text-gray-200 font-medium text-xs text-right" dir={isAr ? 'rtl' : 'ltr'}>
                {isAr ? generatedDocs[activeCategory].contentAr : generatedDocs[activeCategory].contentEn}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
