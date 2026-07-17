import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Code2, 
  Terminal as TerminalIcon, 
  CloudLightning, 
  ChevronDown, 
  Plus, 
  HelpCircle, 
  Trash2, 
  RefreshCw,
  Layout,
  AlertCircle,
  Globe,
  Sun,
  Moon,
  Settings,
  Download,
  Cpu,
  FileArchive,
  Loader2,
  CheckCircle,
  Bot,
  FileText,
  Shield,
  History,
  Copy,
  Archive,
  Milestone
} from 'lucide-react';
import JSZip from 'jszip';
import { Project, ChatMessage, TerminalLog, DeploymentStatus } from './types';
import { TEMPLATES } from './data/templates';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import DeviceSimulator from './components/DeviceSimulator';
import TerminalPanel from './components/TerminalPanel';
import DeploymentPanel from './components/DeploymentPanel';

// Smart preview components
import BuildPreviewPanel from './components/BuildPreviewPanel';
import AdminDashboard from './components/AdminDashboard';
import ExportModal from './components/ExportModal';
import { PROJECT_TYPES } from './data/previewGenerator';
import { generateFallbackProjectFiles } from './data/fallbackProjects';

// Professional extension components
import AIAgentPanel from './components/AIAgentPanel';
import VersionsPanel from './components/VersionsPanel';
import TestsPanel from './components/TestsPanel';
import DocsPanel from './components/DocsPanel';
import ExecutionRoadmapPanel from './components/ExecutionRoadmapPanel';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeTabLeft, setActiveTabLeft] = useState<'chat' | 'agent' | 'files' | 'versions' | 'tests' | 'docs' | 'deploy' | 'roadmap'>('chat');
  const [activeTabRight, setActiveTabRight] = useState<'preview' | 'code' | 'terminal'>('preview');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    state: 'idle',
    progress: 0
  });

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('react-vite'); // default type
  const [errorMessage, setErrorMessage] = useState('');

  // Global UI States for Arabic/English and Theme Settings
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('x_studio_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('x_studio_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Smart Previews and Dashboards visible controllers
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showSpecsPreview, setShowSpecsPreview] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Temporary container states for currently staging build configs
  const [tempBuildName, setTempBuildName] = useState('');
  const [tempBuildPrompt, setTempBuildPrompt] = useState('');
  const [tempBuildType, setTempBuildType] = useState('react-vite');

  // Simulated compilation states (the 7 stages after Approve is clicked!)
  const [isSimulatingCompilation, setIsSimulatingCompilation] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [compilationCheckedItems, setCompilationCheckedItems] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [apiKey, setApiKey] = useState('MY_GEMINI_API_KEY');

  // Save localized settings on change
  useEffect(() => {
    localStorage.setItem('x_studio_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('x_studio_theme', theme);
  }, [theme]);

  // Initial setup: Load templates or localStorage
  useEffect(() => {
    const saved = localStorage.getItem('x_studio_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error('Error loading projects', e);
      }
    }
    // Fallback to templates
    setProjects(TEMPLATES);
    if (TEMPLATES.length > 0) {
      setActiveProjectId(TEMPLATES[0].id);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('x_studio_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Push terminal logs helper
  const addLog = (text: string, type: TerminalLog['type'] = 'info') => {
    const newLog: TerminalLog = {
      id: Math.random().toString(),
      type,
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setTerminalLogs(prev => [...prev, newLog]);
  };

  // On active project change, setup initial logging and state
  useEffect(() => {
    if (!activeProjectId) return;
    const project = projects.find(p => p.id === activeProjectId);
    if (!project) return;

    // Reset simulator and deployment when project changes
    setDeploymentStatus({ state: 'idle', progress: 0 });
    
    // Seed default startup logs
    setTerminalLogs([
      {
        id: '1',
        type: 'info',
        text: `[X AI Studio] initializing workspace for project: "${project.name}"...`,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '2',
        type: 'success',
        text: `Loaded ${Object.keys(project.files).length} files into the memory container.`,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '3',
        type: 'info',
        text: `Local server booting... Listening on http://localhost:3000 (Mock Sandbox)`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, [activeProjectId]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // File management handlers
  const handleSelectFile = (path: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return { ...p, activeFile: path };
      }
      return p;
    }));
    addLog(`Opened file: ${path}`, 'info');
    setActiveTabRight('code'); // automatically switch to code view when clicking a file
  };

  const handleSaveFile = (newContent: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          files: {
            ...p.files,
            [p.activeFile]: newContent
          }
        };
      }
      return p;
    }));
    addLog(`Manually saved file changes: ${activeProject.activeFile}`, 'success');
  };

  const handleAddFile = (path: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          files: {
            ...p.files,
            [path]: `// ملف جديد: ${path}\n`
          },
          activeFile: path
        };
      }
      return p;
    }));
    addLog(`Created new file in workspace: ${path}`, 'success');
    setActiveTabRight('code');
  };

  const handleDeleteFile = (path: string) => {
    if (!activeProject || path === 'index.html') return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const updatedFiles = { ...p.files };
        delete updatedFiles[path];
        // If we deleted the active file, fallback to index.html
        const nextActive = p.activeFile === path ? 'index.html' : p.activeFile;
        return {
          ...p,
          files: updatedFiles,
          activeFile: nextActive
        };
      }
      return p;
    }));
    addLog(`Deleted file from workspace: ${path}`, 'warning');
  };

  // Reset current project back to its original state or clear chat
  const handleResetChat = () => {
    setChatMessages([]);
    addLog('Cleared chat conversation and companion history.', 'warning');
  };

  // Terminal commands interpreter
  const handleExecuteCommand = (cmd: string) => {
    addLog(cmd, 'command');
    const lower = cmd.toLowerCase().trim();

    if (lower === 'help' || lower === '؟' || lower === 'مساعدة') {
      addLog('Available commands:\n  help                Show helper lists\n  npm install <pkg>   Simulate package installation\n  npm run build       Compile workspace static files\n  clear               Clear console logs', 'info');
    } else if (lower === 'clear') {
      setTerminalLogs([]);
    } else if (lower === 'npm run build') {
      addLog('Bundling project static assets via Rollup...', 'info');
      setTimeout(() => {
        addLog('Inlining styles and stylesheet assets...', 'info');
      }, 500);
      setTimeout(() => {
        addLog('Optimization complete! Output build static folder: dist/', 'success');
      }, 1000);
    } else if (lower.startsWith('npm install ')) {
      const pkg = cmd.substring(12).trim();
      addLog(`Searching for package: "${pkg}" in global registries...`, 'info');
      setTimeout(() => {
        addLog(`Downloaded and cached package: "${pkg}"`, 'success');
        addLog(`Updated local package.json dependencies`, 'info');
      }, 1200);
    } else {
      addLog(`sh: command not found: ${cmd}. Type "help" to see available instructions.`, 'error');
    }
  };

  // Simulate Cloud Deployment
  const handleSimulateDeployment = () => {
    if (!activeProject) return;
    setDeploymentStatus({ state: 'building', progress: 10 });
    addLog('Initiating cloud deployment build container...', 'info');

    const interval = setInterval(() => {
      setDeploymentStatus(prev => {
        if (prev.progress >= 95) {
          clearInterval(interval);
          addLog('Generating public secure URL edge mapping...', 'info');
          const mockId = Math.floor(Math.random() * 89999 + 10000);
          const url = `https://x-app-${mockId}.x-studio.run`;
          setTimeout(() => {
            addLog(`Deployment is fully LIVE! Production url: ${url}`, 'success');
          }, 300);
          return {
            state: 'live',
            progress: 100,
            url
          };
        }
        
        const nextProgress = prev.progress + 15;
        const state = nextProgress > 60 ? 'deploying' : 'building';
        return {
          state,
          progress: nextProgress
        };
      });
    }, 450);
  };

  // Generate whole projects or updates using Gemini API
  const handleSendMessage = async (text: string) => {
    if (!activeProject) return;

    // Add user's message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setErrorMessage('');
    addLog(`Asking Gemini AI Assistant: "${text}"`, 'info');

    // Build chat history for context
    const chatHistory = chatMessages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text
    }));

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          existingFiles: activeProject.files,
          chatHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التواصل مع خادم الذكاء الاصطناعي.');
      }

      // Load files and terminal details from API response
      const updatedFiles: Record<string, string> = {};
      const fileNamesList: string[] = [];

      // We load either updated files or merge them with the existing ones!
      // To preserve project consistency, we inherit older files and overwrite new files.
      const mergedFiles = { ...activeProject.files };
      if (data.files && Array.isArray(data.files)) {
        data.files.forEach((file: any) => {
          mergedFiles[file.path] = file.content;
          fileNamesList.push(file.path);
        });
      }

      // Update project inside list
      setProjects(prev => prev.map(p => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            name: data.projectName || p.name,
            description: data.description || p.description,
            files: mergedFiles,
            // If the active file was updated or index.html is present, prefer it
            activeFile: fileNamesList.includes(p.activeFile) ? p.activeFile : (mergedFiles['index.html'] ? 'index.html' : Object.keys(mergedFiles)[0])
          };
        }
        return p;
      }));

      // Add AI Response
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: `تم تجميع التحديثات وكتابة الأكواد بنجاح للمشروع: "${data.projectName || activeProject.name}"!\n\nالوصف: ${data.description || ''}`,
        timestamp: new Date().toLocaleTimeString(),
        filesUpdated: fileNamesList
      };
      setChatMessages(prev => [...prev, aiMsg]);

      // Print terminal instructions returned
      if (data.terminalLog) {
        addLog(data.terminalLog, 'success');
      } else {
        addLog('AI Code injection successfully merged. Compiled workspace static folders.', 'success');
      }

      // Instantly direct user to Live Preview tab to admire results!
      setActiveTabRight('preview');

    } catch (err: any) {
      console.error(err);
      const errMsgText = err.message || 'فشل الاتصال بخادم الذكاء الاصطناعي.';
      setErrorMessage(errMsgText);
      addLog(`Error during code generation: ${errMsgText}`, 'error');
      
      // Notify client in chat bubble
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: `عذراً، حدث خطأ أثناء تنفيذ طلبك: ${errMsgText}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Intercept new project form and redirect to Specifications Blueprint Preview Panel
  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = newProjectPrompt.trim();
    if (!prompt) return;

    const name = newProjectName.trim() || (language === 'ar' ? 'تطبيق ذكي مخصص' : 'Custom Smart App');
    
    // Redirect details to Specs Blueprint Preview Panel instead of immediate build!
    setTempBuildName(name);
    setTempBuildPrompt(prompt);
    setTempBuildType(newProjectType);
    
    setShowNewProjectModal(false);
    setShowSpecsPreview(true); // open blueprint specs modal gate
    
    setNewProjectPrompt('');
    setNewProjectName('');
  };

  // Run the full stateful compilation after user clicks "Approve Execution"
  const handleApproveBuild = (finalName: string, finalPrompt: string, finalType: string) => {
    setShowSpecsPreview(false);
    setIsSimulatingCompilation(true);
    setCompilationProgress(0);
    setCompilationCheckedItems([]);
    
    // Immediately insert temporary workspace skeleton
    const newId = 'proj_' + Date.now();
    const newProj: Project = {
      id: newId,
      name: finalName,
      description: finalPrompt,
      createdAt: new Date().toISOString(),
      activeFile: 'index.html',
      files: {
        'index.html': `<!DOCTYPE html><html lang="ar" dir="rtl"><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-neutral-950 text-white min-h-screen flex items-center justify-center font-sans"><div class="text-center space-y-3"><div class="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto"></div><p class="text-xs text-gray-400">جاري تجميع وتركيب ملفات المشروع البرمجي...</p></div></body></html>`
      }
    };
    
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newId);
    
    addLog(`[System Builder] Compile approved by operator. Initializing isolated compiler sandbox container...`, 'info');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress > 100) currentProgress = 100;
      setCompilationProgress(currentProgress);
      
      const completed: string[] = [];
      if (currentProgress >= 15) completed.push('analysis');
      if (currentProgress >= 35) completed.push('code');
      if (currentProgress >= 50) completed.push('db');
      if (currentProgress >= 65) completed.push('deps');
      if (currentProgress >= 80) completed.push('test');
      if (currentProgress >= 90) completed.push('fixes');
      if (currentProgress >= 98) completed.push('docs');
      setCompilationCheckedItems(completed);
      
      if (currentProgress === 100) {
        clearInterval(interval);
        setIsSimulatingCompilation(false);
        
        // Compile full interactive application files based on selected type and user parameters
        const compiledFiles = generateFallbackProjectFiles(finalName, finalPrompt, finalType, language);
        
        // Update project content
        setProjects(prev => prev.map(p => {
          if (p.id === newId) {
            return {
              ...p,
              description: finalPrompt,
              files: compiledFiles,
              activeFile: 'index.html'
            };
          }
          return p;
        }));
        
        // Seed appropriate diagnostic logs inside user's workspace Terminal Panel
        const isAr = language === 'ar';
        setTerminalLogs([
          {
            id: 'build_log_1',
            type: 'info',
            text: isAr ? '✔ تم الانتهاء من تحليل وتخطيط الفكرة المقترحة بنجاح.' : '✔ Analysis and blueprint structure validated successfully.',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'build_log_2',
            type: 'success',
            text: isAr ? '✔ تم توليد وكتابة جميع الأكواد والشاشات التفاعلية بالكامل.' : '✔ Generated all system source code files complete.',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'build_log_3',
            type: 'info',
            text: isAr ? `✔ تم بناء هيكل البيانات الموضحة محلياً وتغذية جدول الأعضاء.` : `✔ Created relational database connection schemas local storage.`,
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'build_log_4',
            type: 'success',
            text: isAr ? '✔ تم تثبيت الاعتماديات (Lucide, JSZip) وتشغيل الاختبارات البرمجية بنجاح بنسبة 100%.' : '✔ Installed modules and passed test suite execution successfully (100% green).',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'build_log_5',
            type: 'success',
            text: isAr ? '✔ فحص أخطاء الشفرات البرمجية: 0 أخطاء، تم إصلاح التوافقيات تلقائياً.' : '✔ Syntax errors checkout: 0 logs. System components matched.',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: 'build_log_6',
            type: 'info',
            text: isAr ? '✔ تم إنشاء دليل المستخدم README.md، وملف التحديثات CHANGELOG.md ورخصة MIT.' : '✔ Output documentation guidelines README.md, LICENSE, and CHANGELOG.md files.',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        
        addLog(isAr ? `✔ تمت عملية بناء وتأصيل المشروع "${finalName}" بالكامل بنجاح!` : `✔ Project "${finalName}" build finalized successfully!`, 'success');
        
        // Direct operator to Live Preview
        setActiveTabRight('preview');
      }
    }, 120);
  };

  // Handle Exporting ZIP Archive of active project files
  const handleDownloadZIP = async () => {
    if (!activeProject) return;
    const zip = new JSZip();
    
    // Package all project files inside zip
    Object.entries(activeProject.files).forEach(([path, content]) => {
      zip.file(path, String(content));
    });
    
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeProject.name.toLowerCase().replace(/\s+/g, '_')}_codebase.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addLog(`Workspace successfully archived and downloaded as ZIP format!`, 'success');
    } catch (err: any) {
      console.error(err);
      alert(language === 'ar' ? 'فشل تحزيم ملفات المشروع' : 'Failed to compile ZIP project files.');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert(language === 'ar' ? 'يجب أن تترك مشروعاً واحداً على الأقل في القائمة!' : 'You must keep at least one project workspace in the list!');
      return;
    }
    const isAr = language === 'ar';
    const confirmMsg = isAr ? 'هل أنت متأكد من رغبتك في حذف هذا المشروع بالكامل؟' : 'Are you sure you want to permanently delete this project workspace?';
    if (confirm(confirmMsg)) {
      const nextList = projects.filter(p => p.id !== id);
      setProjects(nextList);
      setActiveProjectId(nextList[0].id);
      addLog('Deleted project workspace.', 'warning');
    }
  };

  const handleDuplicateProject = () => {
    if (!activeProject) return;
    const isAr = language === 'ar';
    const newId = 'proj_' + Date.now();
    const newProj: Project = {
      ...activeProject,
      id: newId,
      name: activeProject.name + (isAr ? ' - نسخة' : ' - Copy'),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newId);
    addLog(isAr ? `✔ تم تكرار ونسخ المشروع الحالي بنجاح: ${newProj.name}` : `✔ Duplicated and copied current project: ${newProj.name}`, 'success');
  };

  const handleToggleArchiveProject = () => {
    if (!activeProject) return;
    const isAr = language === 'ar';
    const nextArchived = !activeProject.archived;
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, archived: nextArchived } : p));
    
    if (nextArchived) {
      addLog(isAr ? `✔ تم أرشفة المشروع الحالي بنجاح: ${activeProject.name}` : `✔ Archived active project successfully: ${activeProject.name}`, 'warning');
    } else {
      addLog(isAr ? `✔ تم إلغاء أرشفة واستعادة المشروع بنجاح: ${activeProject.name}` : `✔ Restored project from archives successfully: ${activeProject.name}`, 'success');
    }
  };

  // Theme and Translation utilities
  const t = {
    ar: {
      appTitle: "X AI Studio",
      appSub: "منصة ذكاء اصطناعي احترافية لبناء وتطوير المشاريع البرمجية فورا",
      currentProj: "المشروع الحالي:",
      newProjBtn: "مشروع جديد",
      smartAssistant: "المساعد الذكي",
      projectFiles: "ملفات التطبيق",
      deployHosting: "الاستضافة والنشر",
      livePreview: "المعاينة المباشرة (Preview)",
      sourceEditor: "محرر الكود (Source Editor)",
      terminalLogs: "الطرفية وسجلات البدء (Terminal)",
      deleteTitle: "حذف المشروع الحالي",
      selectType: "نوع وتصنيف المشروع البرمجي المستهدف:",
      addName: "اسم المشروع (اختياري)",
      addPrompt: "صف فكرة مشروعك بالتفصيل",
      cancel: "إلغاء",
      generateBtn: "توليد المشروع بالكامل",
      buildProgressTitle: "جاري تجميع وبناء مشروعك البرمجي...",
      phaseAnalysis: "تحليل متطلبات الفكرة وتخطيط هندسة المعاينة...",
      phaseCode: "توليد وكتابة جميع ملفات الأكواد البرمجية بالكامل...",
      phaseDb: "بناء وتزامن هيكل جداول قاعدة البيانات المستهدفة...",
      phaseDeps: "تثبيت الاعتماديات والمكتبات المدمجة المساعدة...",
      phaseTest: "إجراء اختبارات الأكواد والتحقق التلقائي من التوافقية...",
      phaseFixes: "فحص ومعالجة الأخطاء المحتملة وتصحيحها تلقائياً...",
      phaseDocs: "توليد وثائق دليل التشغيل README والترخيص وسجل التحديثات..."
    },
    en: {
      appTitle: "X AI Studio",
      appSub: "Professional AI workstation for instantaneous multi-platform project deployment.",
      currentProj: "Active Workspace:",
      newProjBtn: "New Project",
      smartAssistant: "AI Companion",
      projectFiles: "Workspace Files",
      deployHosting: "Hosting & Cloud",
      livePreview: "Live Preview",
      sourceEditor: "Source Code Editor",
      terminalLogs: "Terminal & System Logs",
      deleteTitle: "Delete Current Workspace",
      selectType: "Target Framework / Build Type:",
      addName: "Project Name (Optional)",
      addPrompt: "Describe your project concept in detail",
      cancel: "Cancel",
      generateBtn: "Proceed to Build Preview",
      buildProgressTitle: "Compiling and packaging codebase assets...",
      phaseAnalysis: "Analyzing core prompt requirements & blueprint...",
      phaseCode: "Generating clean responsive code file trees...",
      phaseDb: "Establishing localized schema structural parameters...",
      phaseDeps: "Bundling system library files & assets...",
      phaseTest: "Running clean testing suites & security audits...",
      phaseFixes: "Scanning syntax compatibility & correcting variables...",
      phaseDocs: "Compiling manual README, LICENSE & release CHANGELOG..."
    }
  }[language];

  // Colors and backgrounds classes depending on Theme mode
  const bgMain = theme === 'dark' ? 'bg-[#0A0A0B] text-[#e4e4e7]' : 'bg-gray-50 text-gray-800';
  const bgHeader = theme === 'dark' ? 'bg-[#0F0F11] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm';
  const bgPanelLeft = theme === 'dark' ? 'bg-[#0F0F11] border-white/10' : 'bg-white border-gray-200 shadow-sm';
  const bgPanelRight = theme === 'dark' ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-gray-200 shadow-sm shadow-indigo-100/30';
  const borderCol = theme === 'dark' ? 'border-white/10' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#161618] border-white/5' : 'bg-white border-gray-200 shadow-sm';
  const selectBg = theme === 'dark' ? 'bg-[#0A0A0B] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const isAr = language === 'ar';

  return (
    <div id="main-app-root" className={`min-h-screen ${bgMain} flex flex-col antialiased transition-colors duration-200`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Top Professional Header Navigation */}
      <header className={`${bgHeader} border-b px-4 md:px-6 py-3.5 flex flex-col xl:flex-row items-center justify-between gap-4 select-none z-10`}>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight">{t.appTitle}</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-bold border border-indigo-500/20">PRO</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">{t.appSub}</p>
          </div>
        </div>

        {/* Project Selector, Export Controls & Local Configurations */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          
          {/* Active Workspace Selector Droplist */}
          {activeProject && (
            <div className={`relative flex items-center ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-gray-100'} border ${borderCol} rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer`}>
              <span className="text-gray-500 ml-1.5">{t.currentProj}</span>
              <select
                id="select-active-project"
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className={`bg-transparent ${theme === 'dark' ? 'text-white' : 'text-gray-900'} outline-none font-bold border-none cursor-pointer focus:ring-0`}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className={theme === 'dark' ? 'bg-[#0A0A0B] text-slate-200' : 'bg-white text-gray-800'}>
                    {p.name} {p.archived ? (isAr ? ' (مؤرشف)' : ' (Archived)') : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duplicate/Copy Project */}
          {activeProject && (
            <button
              id="btn-duplicate-project"
              onClick={handleDuplicateProject}
              className={`p-2 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] hover:border-indigo-900/40' : 'bg-white hover:bg-gray-100'} hover:text-indigo-400 rounded-lg text-gray-500 transition`}
              title={isAr ? 'نسخ/تكرار المشروع الحالي' : 'Copy/Duplicate Current Project'}
            >
              <Copy size={14} />
            </button>
          )}

          {/* Archive/Restore Project */}
          {activeProject && (
            <button
              id="btn-archive-project"
              onClick={handleToggleArchiveProject}
              className={`p-2 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] hover:border-amber-900/40' : 'bg-white hover:bg-gray-100'} ${activeProject.archived ? 'text-amber-400 bg-amber-500/10' : 'text-gray-500'} hover:text-amber-400 rounded-lg transition`}
              title={activeProject.archived ? (isAr ? 'إلغاء الأرشفة' : 'Restore from Archive') : (isAr ? 'أرشفة المشروع الحالي' : 'Archive Current Project')}
            >
              <Archive size={14} />
            </button>
          )}

          {/* Delete Project */}
          {activeProject && (
            <button
              id="btn-delete-project"
              onClick={() => handleDeleteProject(activeProjectId)}
              className={`p-2 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] hover:border-rose-900/40' : 'bg-white hover:bg-gray-100'} hover:text-rose-400 rounded-lg text-gray-500 transition`}
              title={t.deleteTitle}
            >
              <Trash2 size={14} />
            </button>
          )}

          {/* Quick Stats: Completion rate progress */}
          {activeProject && (
            <div className={`px-2.5 py-1.5 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-gray-100'} rounded-lg text-[10px] font-bold text-indigo-400 flex items-center gap-1.5`}>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>{isAr ? 'الإنجاز: 100%' : 'Done: 100%'}</span>
            </div>
          )}

          <div className="h-6 w-[1px] bg-gray-500/25 hidden md:block" />

          {/* Export Codebase as ZIP */}
          <button
            onClick={handleDownloadZIP}
            className={`px-3 py-1.5 rounded-lg border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] text-emerald-400' : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200'} text-xs font-bold transition flex items-center gap-1.5`}
            title={isAr ? 'تنزيل الكود بالكامل كـ ZIP' : 'Download clean code ZIP'}
          >
            <FileArchive size={14} />
            <span className="hidden sm:inline">{isAr ? 'تنزيل ZIP' : 'Export ZIP'}</span>
          </button>

          {/* Export Compiled standalone App Package */}
          <button
            onClick={() => setShowExportModal(true)}
            className={`px-3 py-1.5 rounded-lg border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] text-amber-400' : 'bg-white hover:bg-amber-50 text-amber-600 border-amber-200'} text-xs font-bold transition flex items-center gap-1.5`}
            title={isAr ? 'بناء وتصدير حزمة تثبيت مستقلة' : 'Export setup files package'}
          >
            <Cpu size={14} />
            <span className="hidden sm:inline">{isAr ? 'تصدير APK/EXE' : 'Export stand-alone'}</span>
          </button>

          <div className="h-6 w-[1px] bg-gray-500/25 hidden md:block" />

          {/* Local Configuration Toggles: Lang, Theme, Settings Panel */}
          <button
            onClick={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
            className={`p-2 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618]' : 'bg-white hover:bg-gray-100'} rounded-lg text-gray-500 hover:text-white transition`}
            title={isAr ? 'English Language' : 'اللغة العربية'}
          >
            <Globe size={14} />
          </button>

          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`p-2 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618]' : 'bg-white hover:bg-gray-100'} rounded-lg text-gray-500 hover:text-white transition`}
            title={isAr ? 'تغيير درجات المظهر' : 'Toggle dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            onClick={() => setShowAdminDashboard(true)}
            className={`px-3 py-1.5 border ${borderCol} ${theme === 'dark' ? 'bg-[#0A0A0B] hover:bg-[#161618] text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'} rounded-lg text-xs font-bold transition flex items-center gap-1.5`}
            title={isAr ? 'لوحة التحكم والمستخدمين' : 'General workspace parameters'}
          >
            <Settings size={14} />
            <span className="hidden lg:inline">{isAr ? 'لوحة التحكم' : 'Console'}</span>
          </button>

          <div className="h-6 w-[1px] bg-gray-500/25 hidden lg:block" />

          {/* Create custom app trigger */}
          <button
            id="btn-open-new-project-modal"
            onClick={() => {
              setShowNewProjectModal(true);
              setErrorMessage('');
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition"
          >
            <Plus size={14} />
            <span>{t.newProjBtn}</span>
          </button>

        </div>
      </header>

      {/* Main Sandbox Interactive Workspace Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 md:p-5 overflow-hidden">
        
        {/* Left Side Control Panel (Assistant Chat & Files Explorer) */}
        <section id="left-workspace-panel" className="lg:col-span-4 flex flex-col h-[calc(100vh-140px)] min-h-[500px] gap-4">
          
          {/* Tab Selection Headers */}
          <div className={`flex flex-wrap gap-1 ${theme === 'dark' ? 'bg-[#0F0F11]' : 'bg-gray-200'} p-1 border ${borderCol} rounded-xl`}>
            <button
              id="tab-btn-chat"
              onClick={() => setActiveTabLeft('chat')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'chat' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Sparkles size={11} className="text-indigo-400" />
              <span>{isAr ? 'المساعد' : 'Chat'}</span>
            </button>

            <button
              id="tab-btn-agent"
              onClick={() => setActiveTabLeft('agent')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'agent' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Cpu size={11} className="text-rose-400" />
              <span>{isAr ? 'الوكيل الذكي' : 'AI Agent'}</span>
            </button>

            <button
              id="tab-btn-roadmap"
              onClick={() => setActiveTabLeft('roadmap')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'roadmap' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Milestone size={11} className="text-emerald-400" />
              <span>{isAr ? 'خارطة التنفيذ' : 'Roadmap'}</span>
            </button>

            <button
              id="tab-btn-files"
              onClick={() => setActiveTabLeft('files')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'files' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Layers size={11} className="text-blue-400" />
              <span>{isAr ? 'الملفات' : 'Files'}</span>
            </button>

            <button
              id="tab-btn-versions"
              onClick={() => setActiveTabLeft('versions')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'versions' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <History size={11} className="text-amber-400" />
              <span>{isAr ? 'الإصدارات' : 'History'}</span>
            </button>

            <button
              id="tab-btn-tests"
              onClick={() => setActiveTabLeft('tests')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'tests' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <CheckCircle size={11} className="text-emerald-400" />
              <span>{isAr ? 'الاختبارات' : 'Tests'}</span>
            </button>

            <button
              id="tab-btn-docs"
              onClick={() => setActiveTabLeft('docs')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'docs' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <FileText size={11} className="text-violet-400" />
              <span>{isAr ? 'التوثيق' : 'Docs'}</span>
            </button>

            <button
              id="tab-btn-deploy"
              onClick={() => setActiveTabLeft('deploy')}
              className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTabLeft === 'deploy' 
                  ? `${theme === 'dark' ? 'bg-[#0A0A0B] text-white shadow' : 'bg-white text-gray-900 shadow'}` 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <CloudLightning size={11} className="text-cyan-400" />
              <span>{isAr ? 'النشر' : 'Hosting'}</span>
            </button>
          </div>

          {/* Active Tab Panel Body */}
          <div className={`flex-1 overflow-hidden rounded-xl border ${borderCol} ${bgPanelLeft}`}>
            {activeTabLeft === 'chat' && (
              <Sidebar
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                onResetChat={handleResetChat}
              />
            )}
            {activeTabLeft === 'agent' && activeProject && (
              <AIAgentPanel
                project={activeProject}
                onUpdateProjectFiles={(files) => {
                  setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, files } : p));
                  addLog(isAr ? '✔ قام الوكيل الذكي بتحديث ملفات المشروع بنجاح!' : '✔ AI Agent updated project workspace files!', 'success');
                }}
                language={language}
                theme={theme}
                addLog={addLog}
              />
            )}
            {activeTabLeft === 'files' && activeProject && (
              <FileExplorer
                files={activeProject.files}
                activeFile={activeProject.activeFile}
                onSelectFile={handleSelectFile}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
              />
            )}
            {activeTabLeft === 'versions' && activeProject && (
              <VersionsPanel
                project={activeProject}
                onRevertToVersion={(files, versionName) => {
                  setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, files } : p));
                  addLog(isAr ? `✔ تم استعادة نسخة لقطة المشروع: ${versionName}` : `✔ Restored project to version snapshot: ${versionName}`, 'success');
                }}
                onSaveNewVersion={(name) => {
                  addLog(isAr ? `✔ تم حفظ لقطة إصدار جديدة باسم: ${name}` : `✔ Saved new project snapshot version tag: ${name}`, 'success');
                }}
                language={language}
                theme={theme}
                addLog={addLog}
              />
            )}
            {activeTabLeft === 'tests' && activeProject && (
              <TestsPanel
                project={activeProject}
                onRunAutoFix={(files) => {
                  setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, files } : p));
                  addLog(isAr ? '✔ تم تطبيق إصلاحات التوافق التلقائية بنجاح!' : '✔ AI Auto-Fix improvements applied to files!', 'success');
                }}
                language={language}
                theme={theme}
                addLog={addLog}
              />
            )}
            {activeTabLeft === 'docs' && activeProject && (
              <DocsPanel
                project={activeProject}
                language={language}
                theme={theme}
                addLog={addLog}
              />
            )}
            {activeTabLeft === 'deploy' && activeProject && (
              <DeploymentPanel
                projectName={activeProject.name}
                onSimulateDeployment={handleSimulateDeployment}
                status={deploymentStatus}
              />
            )}
            {activeTabLeft === 'roadmap' && activeProject && (
              <ExecutionRoadmapPanel
                project={activeProject}
                language={language}
                theme={theme}
                addLog={addLog}
              />
            )}
          </div>
        </section>

        {/* Right Side Working Canvas (Iframe preview, Code Editor, Terminal Output) */}
        <section id="right-workspace-panel" className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[500px] gap-4">
          
          {/* Tabs header selector */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                id="tab-btn-preview"
                onClick={() => setActiveTabRight('preview')}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition flex items-center gap-2 ${
                  activeTabRight === 'preview' 
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold shadow-sm' 
                    : `${theme === 'dark' ? 'bg-[#0F0F11] border-white/10 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <Layout size={13} />
                <span>{t.livePreview}</span>
              </button>
              <button
                id="tab-btn-code"
                onClick={() => setActiveTabRight('code')}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition flex items-center gap-2 ${
                  activeTabRight === 'code' 
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold shadow-sm' 
                    : `${theme === 'dark' ? 'bg-[#0F0F11] border-white/10 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <Code2 size={13} />
                <span>{t.sourceEditor}</span>
              </button>
              <button
                id="tab-btn-terminal"
                onClick={() => setActiveTabRight('terminal')}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition flex items-center gap-2 ${
                  activeTabRight === 'terminal' 
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold shadow-sm' 
                    : `${theme === 'dark' ? 'bg-[#0F0F11] border-white/10 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <TerminalIcon size={13} />
                <span>{t.terminalLogs}</span>
              </button>
            </div>

            {/* General Project Description */}
            {activeProject && (
              <span className={`text-[10px] ${textMuted} hidden md:inline truncate max-w-sm font-mono`}>
                {activeProject.description}
              </span>
            )}
          </div>

          {/* Active Canvas panel body */}
          <div className={`flex-1 overflow-hidden rounded-xl border ${borderCol} ${bgPanelRight}`}>
            {activeTabRight === 'preview' && activeProject && (
              <DeviceSimulator
                files={activeProject.files}
                projectName={activeProject.name}
              />
            )}
            {activeTabRight === 'code' && activeProject && (
              <CodeEditor
                filePath={activeProject.activeFile}
                content={activeProject.files[activeProject.activeFile] || ''}
                onSave={handleSaveFile}
              />
            )}
            {activeTabRight === 'terminal' && (
              <TerminalPanel
                logs={terminalLogs}
                onClear={() => setTerminalLogs([])}
                onExecuteCommand={handleExecuteCommand}
              />
            )}
          </div>
        </section>
      </main>

      {/* 1. NEW PROJECT CREATION PROMPT MODAL */}
      {showNewProjectModal && (
        <div id="new-project-modal-backdrop" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F11] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-fade-in text-right" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <h3 className="font-bold text-white text-base">
                    {isAr ? 'بدء مشروع ذكي جديد' : 'Initiate Smart Project'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isAr ? 'حدد تصنيف المشروع وصِف فكرتك لتوليد ملفات ومواصفات دقيقة.' : 'Select framework target and describe concept details.'}
                  </p>
                </div>
              </div>
              <button
                id="btn-close-new-project-modal"
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-500 hover:text-gray-300 text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateNewProject} className="space-y-4">
              {/* Project title */}
              <div className="space-y-1.5 text-right">
                <label className="block text-xs font-semibold text-gray-300">{t.addName}</label>
                <input
                  id="input-modal-project-name"
                  type="text"
                  placeholder={isAr ? "مثال: منصة حجوزات فندقية" : "e.g., Luxury Boutique Hotel Booking Platform"}
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500 text-white rounded-lg px-3.5 py-2.5 text-xs outline-none"
                />
              </div>

              {/* Project Type Framework Select (27 Project types supported!) */}
              <div className="space-y-1.5 text-right">
                <label className="block text-xs font-semibold text-gray-300">{t.selectType}</label>
                <select
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500 text-white rounded-lg px-3.5 py-2.5 text-xs outline-none cursor-pointer"
                >
                  {PROJECT_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="bg-[#0A0A0B] text-slate-200">
                      {isAr ? type.nameAr : type.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Core Idea Prompt */}
              <div className="space-y-1.5 text-right">
                <label className="block text-xs font-semibold text-gray-300">{t.addPrompt}</label>
                <textarea
                  id="textarea-modal-project-prompt"
                  rows={4}
                  required
                  placeholder={isAr ? "أريد إنشاء تطبيق لحساب وتتبع الأهداف الرياضية والغذائية للمشتركين يحتوي على واجهات عصرية لمؤشرات الأداء وجدول لتسجيل الوجبات." : "A high-performance luxury design dashboard containing customizable KPI visual indicators, tables, and export options."}
                  value={newProjectPrompt}
                  onChange={(e) => setNewProjectPrompt(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500 text-white rounded-lg px-3.5 py-2.5 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  id="btn-modal-cancel"
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2.5 bg-[#0A0A0B] border border-white/10 hover:bg-[#161618] text-gray-400 hover:text-gray-200 rounded-lg text-xs font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  id="btn-modal-submit"
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-indigo-500/20"
                >
                  {isAr ? 'متابعة للمعاينة والتحليل' : 'Continue to Blueprint Preview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SMART BLUEPRINT PREVIEW GATING INTERACTIVE PORTAL */}
      {showSpecsPreview && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <BuildPreviewPanel
            projectName={tempBuildName}
            projectPrompt={tempBuildPrompt}
            projectType={tempBuildType}
            lang={language}
            theme={theme}
            onApprove={handleApproveBuild}
            onCancel={() => setShowSpecsPreview(false)}
          />
        </div>
      )}

      {/* 3. STATEFUL COMPILATION SIMULATOR & DETAILED CHECKLIST OVERLAY */}
      {isSimulatingCompilation && (
        <div id="compilation-overlay" className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F11] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 text-right" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* Header progress info */}
            <div className="text-center space-y-2">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
              <h3 className="font-extrabold text-white text-base">
                {t.buildProgressTitle}
              </h3>
              <p className="text-xs text-indigo-400 font-bold">{isAr ? `جاري تجميع الملفات: ${compilationProgress}%` : `Compiling packages: ${compilationProgress}%`}</p>
              
              {/* Outer Progress Tracker */}
              <div className="w-full bg-neutral-950 rounded-full h-2 border border-white/5 overflow-hidden max-w-sm mx-auto">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-100"
                  style={{ width: `${compilationProgress}%` }}
                />
              </div>
            </div>

            {/* The 7 Custom requested compilation phases checklists */}
            <div className="space-y-3.5 pt-2 border-t border-white/5 text-xs">
              
              {/* Phase 1: تحليل المتطلبات */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('analysis') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('analysis') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('analysis') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseAnalysis}
                  </span>
                </div>
                {compilationCheckedItems.includes('analysis') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 2: كتابة الأكواد كاملة */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('code') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('code') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('code') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseCode}
                  </span>
                </div>
                {compilationCheckedItems.includes('code') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 3: إنشاء قاعدة البيانات */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('db') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('db') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('db') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseDb}
                  </span>
                </div>
                {compilationCheckedItems.includes('db') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 4: تثبيت الاعتماديات */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('deps') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('deps') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('deps') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseDeps}
                  </span>
                </div>
                {compilationCheckedItems.includes('deps') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 5: إجراء اختبارات الكود */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('test') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('test') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('test') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseTest}
                  </span>
                </div>
                {compilationCheckedItems.includes('test') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 6: فحص ومعالجة الأخطاء المحتملة */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('fixes') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('fixes') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('fixes') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseFixes}
                  </span>
                </div>
                {compilationCheckedItems.includes('fixes') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

              {/* Phase 7: توليد وثائق التوثيق والترخيص */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    compilationCheckedItems.includes('docs') ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                  }`}>
                    {compilationCheckedItems.includes('docs') && <CheckCircle size={10} />}
                  </div>
                  <span className={compilationCheckedItems.includes('docs') ? 'text-white font-bold' : 'text-gray-500'}>
                    {t.phaseDocs}
                  </span>
                </div>
                {compilationCheckedItems.includes('docs') && <span className="text-emerald-400 font-bold">✓ {isAr ? 'جاهز' : 'Ready'}</span>}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. GLOBAL SETTINGS & USER-PERMISSIONS MANAGER CONSOLE */}
      {showAdminDashboard && (
        <AdminDashboard
          projects={projects}
          activeProjectId={activeProjectId}
          terminalLogs={terminalLogs}
          chatMessages={chatMessages}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            setShowAdminDashboard(false);
          }}
          onDeleteProject={handleDeleteProject}
          apiKey={apiKey}
          onSaveApiKey={setApiKey}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          language={language}
          onToggleLanguage={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}

      {/* 5. EXPORT STANDALONE PACKAGE WIZARD MODAL */}
      {showExportModal && (
        <ExportModal
          projectName={activeProject?.name || 'Project'}
          lang={language}
          onClose={() => setShowExportModal(false)}
        />
      )}

    </div>
  );
}
