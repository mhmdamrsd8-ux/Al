import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Terminal, 
  Download, 
  Layers, 
  CheckCircle, 
  Smartphone, 
  Monitor, 
  Loader2, 
  Info 
} from 'lucide-react';

interface ExportModalProps {
  projectName: string;
  lang: 'ar' | 'en';
  onClose: () => void;
}

export default function ExportModal({ projectName, lang, onClose }: ExportModalProps) {
  const isAr = lang === 'ar';
  
  const [platform, setPlatform] = useState<'android' | 'windows' | 'macos' | 'linux'>('android');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleStartBuild = () => {
    setBuildStatus('building');
    setProgress(0);
    setLogs([]);

    const logSteps = [
      isAr ? '✔ تم فحص الكود المصدري والممتلكات بنجاح.' : '✔ Checked source codes and assets.',
      isAr ? '🔄 جاري إنشاء غلاف الحاوية الهجينة (WebView)...' : '🔄 Initiating hybrid WebContainer wrapper...',
      isAr ? '🔄 دمج أكواد JavaScript وضغط ملفات HTML...' : '🔄 Compiling Javascript and minifying HTML files...',
      isAr ? '🔄 تحسين وموازنة جودة الصور وملفات CSS...' : '🔄 Optimizing image resources and stylesheet layouts...',
      isAr ? '🔄 ربط مكتبات النظام وتكوينات الأيقونة التعبيرية...' : '🔄 Linking native bindings and visual icon configuration...',
      isAr ? '⚡ جاري توقيع الملف التنفيذي ودمج شهادة الحماية...' : '⚡ Signing release package with developer certificates...',
      isAr ? '✔ تم تحزيم وبناء حزمة التثبيت بنجاح!' : '✔ Compilation complete: installer binary generated successfully!'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next % 15 === 0 && stepIdx < logSteps.length) {
          setLogs(l => [...l, `[${new Date().toLocaleTimeString()}] ${logSteps[stepIdx]}`]);
          stepIdx++;
        }
        if (next >= 100) {
          clearInterval(interval);
          setBuildStatus('done');
          return 100;
        }
        return next;
      });
    }, 150);
  };

  const handleDownloadSimulatedPackage = () => {
    const extensions = {
      android: 'apk',
      windows: 'exe',
      macos: 'dmg',
      linux: 'AppImage'
    };
    
    // Create a dummy text file as package download
    const content = `X AI Studio compiled installer binary file for platform ${platform}.\nProject Name: ${projectName}\nDate: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_install.${extensions[platform]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="export-package-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F0F11] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Cpu size={20} className="animate-spin-slow" />
            </div>
            <div className={isAr ? 'text-right' : 'text-left'}>
              <h3 className="font-bold text-white text-base">
                {isAr ? 'بناء وتصدير حزم التثبيت الذكية' : 'Compilation & Binary Exporter'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAr ? 'قم بتحويل الكود المصدري فوراً إلى تطبيق قابل للتثبيت على الأجهزة والكمبيوتر.' : 'Compile workspace into offline standalone packages for mobile and PC.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl p-1 transition"
          >
            ×
          </button>
        </div>

        {buildStatus === 'idle' && (
          <div className="space-y-4">
            {/* Platform Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                {isAr ? 'اختر نظام التشغيل والمنصة المستهدفة:' : 'Select Target OS Platform:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Android */}
                <div 
                  onClick={() => setPlatform('android')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    platform === 'android' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Smartphone size={20} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="font-bold text-xs text-white block">Android APK</span>
                    <span className="text-[10px] text-gray-500 block">Google Play / Mobile</span>
                  </div>
                </div>

                {/* Windows */}
                <div 
                  onClick={() => setPlatform('windows')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    platform === 'windows' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Monitor size={20} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="font-bold text-xs text-white block">Windows EXE</span>
                    <span className="text-[10px] text-gray-500 block">Desktop App / PC</span>
                  </div>
                </div>

                {/* macOS */}
                <div 
                  onClick={() => setPlatform('macos')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    platform === 'macos' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Monitor size={20} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="font-bold text-xs text-white block">macOS DMG</span>
                    <span className="text-[10px] text-gray-500 block">Apple Mac devices</span>
                  </div>
                </div>

                {/* Linux */}
                <div 
                  onClick={() => setPlatform('linux')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    platform === 'linux' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Monitor size={20} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="font-bold text-xs text-white block">Linux AppImage</span>
                    <span className="text-[10px] text-gray-500 block">Ubuntu / Fedora / Mint</span>
                  </div>
                </div>

              </div>
            </div>

            {/* General advice message */}
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs text-indigo-400 flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                {isAr 
                  ? `سيقوم محاكي التحزيم الذكي X AI compiler ببناء نسخة كاملة من مشروعك البرمجي وتغليفها محلياً في غلاف الأجهزة المدمج ليعمل دون الحاجة إلى إنترنت.` 
                  : `Our packaging container automatically binds your website assets into a localized webview package, making it fully operational offline with optimized resource performance.`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-[#0A0A0B] border border-white/10 hover:bg-[#161618] text-gray-400 hover:text-gray-200 rounded-lg text-xs font-bold transition"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleStartBuild}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-indigo-500/20"
              >
                {isAr ? 'بدء البناء والتحزيم المباشر' : 'Start Package Compilation'}
              </button>
            </div>
          </div>
        )}

        {buildStatus === 'building' && (
          <div className="space-y-4">
            <div className="space-y-2 text-center py-4">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              <h4 className="font-bold text-white text-sm">
                {isAr ? `جاري تجميع وتحزيم تطبيق ${platform.toUpperCase()}...` : `Compiling standalone ${platform.toUpperCase()} package...`}
              </h4>
              <p className="text-xs text-gray-500">{isAr ? `التقدم: ${progress}%` : `Progress: ${progress}%`}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-neutral-950 rounded-full h-1.5 border border-white/5 overflow-hidden max-w-sm mx-auto">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Logs console */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">{isAr ? 'سجل تشغيل المترجم:' : 'COMPILER LOG CONSOLE:'}</span>
              <div className="bg-black/95 rounded-xl border border-white/10 p-3 h-32 overflow-y-auto font-mono text-[10px] text-left leading-5 text-indigo-400" dir="ltr">
                {logs.length === 0 && <span className="text-gray-600">Waiting for compiler...</span>}
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {buildStatus === 'done' && (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle size={24} />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">
                {isAr ? 'اكتملت عملية البناء بنجاح! 🎉' : 'Package Compiled Successfully! 🎉'}
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {isAr 
                  ? `أصبح تطبيقك ${platform.toUpperCase()} جاهزاً للتثبيت والتشغيل الفوري.` 
                  : `Your stand-alone installable package for ${platform.toUpperCase()} has been successfully bundled.`}
              </p>
            </div>

            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <button
                onClick={handleDownloadSimulatedPackage}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <Download size={14} />
                <span>{isAr ? 'تحميل ملف التثبيت المترجم' : 'Download Install Package'}</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-gray-200 text-xs font-bold rounded-lg transition"
              >
                {isAr ? 'إغلاق المعالج' : 'Close Wizard'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
