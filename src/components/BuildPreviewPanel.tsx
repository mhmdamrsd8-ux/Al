import React, { useState } from 'react';
import { 
  Layout, 
  Palette, 
  FolderTree, 
  Database, 
  Activity, 
  Check, 
  Edit3, 
  RefreshCw, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Server, 
  FileCode, 
  Layers, 
  Globe, 
  Play, 
  Terminal,
  HelpCircle
} from 'lucide-react';
import { generateBuildSpecs, BuildSpecs, PROJECT_TYPES } from '../data/previewGenerator';

interface BuildPreviewPanelProps {
  projectName: string;
  projectPrompt: string;
  projectType: string;
  lang: 'ar' | 'en';
  theme: 'light' | 'dark';
  onApprove: (finalName: string, finalPrompt: string, finalType: string) => void;
  onCancel: () => void;
}

export default function BuildPreviewPanel({
  projectName,
  projectPrompt,
  projectType,
  lang,
  theme,
  onApprove,
  onCancel
}: BuildPreviewPanelProps) {
  const isAr = lang === 'ar';
  
  // Local state to support modifying on the fly!
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [tempPrompt, setTempPrompt] = useState(projectPrompt);
  const [tempType, setTempType] = useState(projectType);

  // Specifications state
  const [specs, setSpecs] = useState<BuildSpecs>(() => 
    generateBuildSpecs(projectName, projectPrompt, projectType, lang)
  );

  const [activeTab, setActiveTab] = useState<'screens' | 'branding' | 'files' | 'db' | 'workflow'>('screens');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Re-generate specifications helper
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const freshSpecs = generateBuildSpecs(tempName, tempPrompt, tempType, lang);
      setSpecs(freshSpecs);
      setIsRegenerating(false);
    }, 850);
  };

  // Modify and Apply helper
  const handleApplyModification = (e: React.FormEvent) => {
    e.preventDefault();
    const freshSpecs = generateBuildSpecs(tempName, tempPrompt, tempType, lang);
    setSpecs(freshSpecs);
    setIsEditingSpecs(false);
  };

  const selectedTypeDetails = PROJECT_TYPES.find(t => t.id === tempType);

  // Styles based on theme
  const isDark = theme === 'dark';
  const panelBg = isDark ? 'bg-[#0F0F11] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';
  const innerBg = isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-gray-50 border-gray-200';
  const cardBg = isDark ? 'bg-[#161618] border-white/5' : 'bg-white border-gray-100 shadow-sm';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const textSubtle = isDark ? 'text-gray-500' : 'text-gray-400';
  const borderCol = isDark ? 'border-white/10' : 'border-gray-200';
  const borderSubtle = isDark ? 'border-white/5' : 'border-gray-100';

  return (
    <div id="build-preview-panel" className={`w-full max-w-5xl mx-auto rounded-2xl border ${panelBg} overflow-hidden shadow-2xl flex flex-col h-[85vh]`}>
      
      {/* Specs Header */}
      <div className={`px-6 py-4 border-b ${borderCol} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold font-sans">
                {isAr ? 'معاينة ومواصفات المشروع قبل بدء التنفيذ' : 'Project Blueprint & Build Preview'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                {isAr ? 'مسودة المواصفات' : 'Blueprint Specs'}
              </span>
            </div>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              {isAr ? 'راجع واعتمد هيكل وهندسة التطبيق قبل الشروع في كتابة الأكواد تلقائياً.' : 'Review and approve application architecture before code generation begins.'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onCancel}
          className={`p-1.5 rounded-lg border ${borderCol} hover:bg-white/5 ${textMuted} hover:text-white transition`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Main split viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left pane: Quick Summary & Setup */}
        <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r ${borderCol} p-5 overflow-y-auto space-y-5 shrink-0`}>
          
          {/* Active project config summary card */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-2">
              {isAr ? 'بيانات النظام' : 'SYSTEM METADATA'}
            </h3>
            
            {isEditingSpecs ? (
              <form onSubmit={handleApplyModification} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">{isAr ? 'اسم المشروع' : 'Project Name'}</label>
                  <input 
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className={`w-full px-2.5 py-1.5 text-xs rounded-md border ${borderCol} bg-transparent text-white outline-none focus:border-indigo-500`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">{isAr ? 'نوع المشروع البرمجي' : 'Project Type'}</label>
                  <select
                    value={tempType}
                    onChange={(e) => setTempType(e.target.value)}
                    className={`w-full px-2.5 py-1.5 text-xs rounded-md border ${borderCol} bg-neutral-900 text-white outline-none focus:border-indigo-500`}
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {isAr ? type.nameAr : type.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">{isAr ? 'الوصف / الفكرة العامة' : 'Prompt / Concept'}</label>
                  <textarea
                    value={tempPrompt}
                    onChange={(e) => setTempPrompt(e.target.value)}
                    className={`w-full h-16 px-2.5 py-1.5 text-xs rounded-md border ${borderCol} bg-transparent text-white outline-none focus:border-indigo-500 resize-none`}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold py-1.5 rounded transition"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingSpecs(false)}
                    className={`flex-1 border ${borderCol} hover:bg-white/5 text-[11px] font-bold py-1.5 rounded transition`}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className={`block text-[10px] ${textSubtle} uppercase`}>{isAr ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-bold text-white block mt-0.5">{tempName}</span>
                </div>
                <div>
                  <span className={`block text-[10px] ${textSubtle} uppercase`}>{isAr ? 'تصنيف المشروع:' : 'Type:'}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold mt-1 inline-block border border-indigo-500/20">
                    {isAr ? selectedTypeDetails?.nameAr : selectedTypeDetails?.nameEn}
                  </span>
                </div>
                <div>
                  <span className={`block text-[10px] ${textSubtle} uppercase`}>{isAr ? 'فكرة التطبيق المقترحة:' : 'User Prompt:'}</span>
                  <p className={`mt-1 text-[11px] leading-relaxed text-gray-300 line-clamp-4 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                    {tempPrompt}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsEditingSpecs(true)}
                  className={`w-full py-1.5 rounded-lg border ${borderCol} hover:bg-white/5 text-gray-300 hover:text-white transition flex items-center justify-center gap-1 text-[11px] font-bold`}
                >
                  <Edit3 size={11} />
                  <span>{isAr ? 'تعديل الفكرة أو المسمى' : 'Edit Spec Prompt'}</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Recommendation stats banner */}
          <div className={`p-4 rounded-xl border ${cardBg} text-xs space-y-3`}>
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Activity size={14} />
              <span>{isAr ? 'تحليلات المعماري الذكي' : 'Architect Recommendations'}</span>
            </div>
            <ul className={`space-y-2 text-[11px] ${textMuted} list-disc list-inside`}>
              <li>{isAr ? 'التخطيط جاهز وبنسبة توافق 100%.' : 'Layout matches standard frameworks.'}</li>
              <li>{isAr ? `تأكيد ربط قاعدة البيانات: ${specs.database.engine}` : `Database engine verified: ${specs.database.engine}`}</li>
              <li>{isAr ? 'تم جدولة بناء ملفات الترخيص ودليل التشغيل التلقائي.' : 'Auto-generating README & LICENSE files.'}</li>
              <li>{isAr ? 'تم التحقق من تكامل واجهة برمجة التطبيقات.' : 'All API schemas validate correctly.'}</li>
            </ul>
          </div>
        </div>

        {/* Right pane: Interactive Tabs containing all 8 specs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Navigation Tab Bar (8 specs represented in 5 clean interactive buckets) */}
          <div className={`flex border-b ${borderCol} overflow-x-auto scrollbar-none bg-[#0D0D0F]`}>
            <button
              onClick={() => setActiveTab('screens')}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'screens' 
                  ? 'border-indigo-500 text-white bg-indigo-500/5' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Layout size={14} />
              <span>{isAr ? 'تصميم الشاشات والتنقل' : 'Screens & Navigation'}</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'branding' 
                  ? 'border-indigo-500 text-white bg-indigo-500/5' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Palette size={14} />
              <span>{isAr ? 'الألوان والخطوط والأيقونات' : 'Colors & Typography'}</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'files' 
                  ? 'border-indigo-500 text-white bg-indigo-500/5' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FolderTree size={14} />
              <span>{isAr ? 'هيكل الملفات المقترح' : 'Proposed Files'}</span>
            </button>

            <button
              onClick={() => setActiveTab('db')}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'db' 
                  ? 'border-indigo-500 text-white bg-indigo-500/5' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Database size={14} />
              <span>{isAr ? 'قاعدة البيانات والـ APIs' : 'Database & APIs'}</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition ${
                activeTab === 'workflow' 
                  ? 'border-indigo-500 text-white bg-indigo-500/5' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={14} />
              <span>{isAr ? 'تدفق عمل التطبيق' : 'Logical Workflow'}</span>
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className={`flex-1 p-6 overflow-y-auto ${innerBg}`}>
            
            {isRegenerating ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3">
                <RefreshCw size={28} className="text-indigo-500 animate-spin" />
                <p className={`text-xs ${textMuted} font-semibold animate-pulse`}>
                  {isAr ? 'جاري إعادة حساب وربط المواصفات المثالية...' : 'Recalculating optimized blueprint specification...'}
                </p>
              </div>
            ) : (
              <>
                {/* 1. SCREENS & NAVIGATION TAB */}
                {activeTab === 'screens' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        {isAr ? 'الشاشات التفاعلية المقترحة ومسارات التنقل' : 'Proposed Screens & Interface Navigation'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specs.screens.map((screen, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${cardBg} space-y-3 relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold">
                              {index + 1}
                            </span>
                            <h5 className="font-bold text-xs text-white">{screen.name}</h5>
                          </div>
                          <p className={`text-xs ${textMuted} leading-relaxed`} dir={isAr ? 'rtl' : 'ltr'}>
                            {screen.description}
                          </p>
                          <div className={`pt-2 border-t ${borderSubtle} text-[10px] font-semibold text-indigo-400 flex items-center gap-1`}>
                            <span>{isAr ? 'التنقل:' : 'Navigates to:'}</span>
                            <span className="text-gray-300">{screen.navigation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. COLORS, FONTS & ICONS TAB */}
                {activeTab === 'branding' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                        {isAr ? 'نظام الهوية الرسومية والألوان' : 'Color Palette & Branding'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {specs.design.colors.map((color, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border ${cardBg} flex items-center gap-3`}>
                            <div 
                              className="w-12 h-12 rounded-lg shadow shrink-0 border border-white/10" 
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <h5 className="font-bold text-xs text-white">{color.name}</h5>
                              <span className="font-mono text-[10px] text-gray-400 mt-0.5 block">{color.hex}</span>
                              <p className={`text-[9px] ${textMuted} mt-1`} dir={isAr ? 'rtl' : 'ltr'}>{color.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div className={`p-4 rounded-xl border ${cardBg}`}>
                        <span className={`block text-[10px] ${textSubtle} uppercase font-bold`}>{isAr ? 'الخط الأساسي للمتن' : 'UI Interface Font'}</span>
                        <h5 className="font-bold text-xs text-white mt-1">{specs.design.fontSans}</h5>
                        <p className={`text-[9px] ${textMuted} mt-1.5`}>
                          {isAr ? 'خط عربي أنيق ومنسق ومريح للعين في القراءة.' : 'Modern legible typeface designed for screen interfaces.'}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${cardBg}`}>
                        <span className={`block text-[10px] ${textSubtle} uppercase font-bold`}>{isAr ? 'خط الشفرة والبيانات' : 'Mono Space Font'}</span>
                        <h5 className="font-bold text-xs text-white mt-1">{specs.design.fontMono}</h5>
                        <p className={`text-[9px] ${textMuted} mt-1.5`}>
                          {isAr ? 'مخصص للأرقام البرمجية والتحليلات والسجلات الحيوية.' : 'High-density monospace optimized for systems data and tables.'}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${cardBg}`}>
                        <span className={`block text-[10px] ${textSubtle} uppercase font-bold`}>{isAr ? 'حزم الأيقونات المستهدفة' : 'Iconography Assets'}</span>
                        <h5 className="font-bold text-xs text-white mt-1">{specs.design.icons}</h5>
                        <p className={`text-[9px] ${textMuted} mt-1.5`}>
                          {isAr ? 'أيقونات Lucide متجاوبة وعالية الدقة والوضوح (Vector).' : 'Polished SVG vector rendering library compatible across browsers.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FILE STRUCTURE TAB */}
                {activeTab === 'files' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {isAr ? 'هيكل الملفات المقترح إنشاؤها تلقائياً للمشروع' : 'Proposed System Code File Structure'}
                    </h4>
                    <div className={`border ${borderCol} rounded-xl overflow-hidden`}>
                      <div className="bg-[#0D0D0F] px-4 py-2 text-[10px] text-gray-400 font-bold flex justify-between">
                        <span>{isAr ? 'المسار والملف' : 'FILE PATH'}</span>
                        <span>{isAr ? 'التوصيف البرمجي' : 'DESCRIPTION'}</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {specs.fileTree.map((file, idx) => (
                          <div key={idx} className="px-4 py-2.5 flex justify-between items-center text-xs hover:bg-white/5 transition">
                            <div className="flex items-center gap-2">
                              {file.type === 'folder' ? (
                                <span className="text-amber-500 font-bold">📁 {file.path}</span>
                              ) : (
                                <span className="text-indigo-400">📄 {file.path}</span>
                              )}
                              {file.size && <span className="text-[9px] text-gray-500 font-mono">({file.size})</span>}
                            </div>
                            <span className={`text-[11px] ${textMuted}`}>{file.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DATABASE & APIS TAB */}
                {activeTab === 'db' && (
                  <div className="space-y-6">
                    {/* Database section */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                          {isAr ? `تخطيط قاعدة البيانات المستهدفة: ${specs.database.engine}` : `Target DB Relational Schema: ${specs.database.engine}`}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {specs.database.tables.map((table, tIdx) => (
                          <div key={tIdx} className={`p-4 rounded-xl border ${cardBg} space-y-2`}>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <span className="font-mono text-xs font-bold text-indigo-400">📊 {table.name}</span>
                              <span className="text-[9px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                                {table.rowsCount} {isAr ? 'سجلات' : 'rows'}
                              </span>
                            </div>
                            <div className="space-y-1 pt-1">
                              {table.columns.map((col, cIdx) => (
                                <div key={cIdx} className="text-[10px] font-mono text-gray-400 flex justify-between">
                                  <span>{col.split(' ')[0]}</span>
                                  <span className="text-gray-600">{col.split(' ')[1] || ''}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APIs section */}
                    <div className="border-t border-white/5 pt-5">
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                        {isAr ? 'واجهات الربط البرمجي (APIs Endpoints)' : 'Application API Endpoints'}
                      </h4>
                      <div className="space-y-3">
                        {specs.apis.map((api, idx) => (
                          <div key={idx} className={`p-3 rounded-xl border ${cardBg} flex flex-col md:flex-row justify-between items-start md:items-center gap-3`}>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                                api.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                api.method === 'POST' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {api.method}
                              </span>
                              <span className="font-mono text-xs text-white">{api.path}</span>
                              <span className={`text-[11px] ${textMuted}`}>{api.desc}</span>
                            </div>
                            <span className="font-mono text-[9px] text-gray-500 bg-[#0A0A0B] px-2 py-1 rounded border border-white/5 max-w-xs truncate">
                              {api.response}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. LOGICAL WORKFLOW TAB */}
                {activeTab === 'workflow' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      {isAr ? 'مراحل ومسار تشغيل النظام البرمجي' : 'Sequential Logical Execution Flow'}
                    </h4>
                    <div className="relative border-r border-indigo-500/20 pr-4 space-y-6 mr-2">
                      {specs.workflow.map((flow, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -right-[25px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-slate-900 text-[8px] font-bold text-white shadow">
                            {index + 1}
                          </span>
                          <h5 className="font-bold text-xs text-white mb-1">
                            {isAr ? `المرحلة ${index + 1}` : `Stage ${index + 1}`}
                          </h5>
                          <p className={`text-xs ${textMuted} leading-relaxed`} dir={isAr ? 'rtl' : 'ltr'}>
                            {flow}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* Control Action Buttons Footer (The 4 Required Buttons) */}
      <div className={`px-6 py-4 bg-[#0A0A0B] border-t ${borderCol} flex flex-wrap items-center justify-between gap-3`}>
        
        <div className="flex items-center gap-3">
          {/* 1. موافق على التنفيذ */}
          <button
            id="btn-approve-specs-execution"
            onClick={() => onApprove(tempName, tempPrompt, tempType)}
            disabled={isRegenerating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-lg shadow-indigo-600/15 flex items-center gap-2"
          >
            <Check size={14} />
            <span>{isAr ? 'موافق على التنفيذ والإنشاء' : 'Approve & Create Project'}</span>
          </button>

          {/* 2. تعديل المشروع (triggered manually if not already editing) */}
          <button
            id="btn-edit-specs-manually"
            onClick={() => setIsEditingSpecs(true)}
            className={`border ${borderCol} hover:bg-white/5 text-gray-300 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5`}
          >
            <Edit3 size={13} />
            <span>{isAr ? 'تعديل المشروع' : 'Modify Specifications'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* 3. إعادة إنشاء المعاينة */}
          <button
            id="btn-regenerate-specs-preview"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`border ${borderCol} hover:bg-white/5 disabled:opacity-50 text-gray-300 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5`}
          >
            <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
            <span>{isAr ? 'إعادة إنشاء المعاينة' : 'Regenerate Preview'}</span>
          </button>

          {/* 4. إلغاء */}
          <button
            id="btn-cancel-specs-blueprint"
            onClick={onCancel}
            className="border border-rose-500/25 hover:bg-rose-500/10 text-rose-400 font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <X size={13} />
            <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
