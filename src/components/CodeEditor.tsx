import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Check, 
  Copy, 
  Edit3, 
  Save, 
  Search, 
  ArrowLeftRight, 
  X, 
  AlertTriangle, 
  Maximize2,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface CodeEditorProps {
  filePath: string;
  content: string;
  onSave: (newContent: string) => void;
  // Optional expansion props
  files?: Record<string, string>;
  onSelectFile?: (path: string) => void;
  language?: 'ar' | 'en';
}

export default function CodeEditor({ 
  filePath, 
  content, 
  onSave, 
  files = {}, 
  onSelectFile, 
  language = 'ar' 
}: CodeEditorProps) {
  const isAr = language === 'ar';
  
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState(content);
  const [copied, setCopied] = useState(false);

  // Tab state
  const [openTabs, setOpenTabs] = useState<string[]>([filePath]);

  // Search & Replace state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchesCount, setMatchesCount] = useState(0);

  // Sync open tabs
  useEffect(() => {
    if (filePath && !openTabs.includes(filePath)) {
      setOpenTabs(prev => [...prev, filePath]);
    }
    setEditorContent(content);
    setIsEditing(false);
  }, [content, filePath]);

  // Scan occurrences when query changes
  useEffect(() => {
    if (!searchQuery) {
      setMatchesCount(0);
      return;
    }
    try {
      const escaped = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      const matches = editorContent.match(regex);
      setMatchesCount(matches ? matches.length : 0);
    } catch (e) {
      setMatchesCount(0);
    }
  }, [searchQuery, editorContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSave = () => {
    onSave(editorContent);
    setIsEditing(false);
  };

  const handleCloseTab = (tabToClose: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openTabs.length === 1) return; // Keep at least one
    const nextTabs = openTabs.filter(t => t !== tabToClose);
    setOpenTabs(nextTabs);
    if (filePath === tabToClose && onSelectFile) {
      onSelectFile(nextTabs[0]);
    }
  };

  // Find & Replace actions
  const handleReplace = () => {
    if (!searchQuery) return;
    const nextContent = editorContent.replace(searchQuery, replaceQuery);
    setEditorContent(nextContent);
    onSave(nextContent);
  };

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const nextContent = editorContent.replaceAll(searchQuery, replaceQuery);
    setEditorContent(nextContent);
    onSave(nextContent);
  };

  // Syntax highlighting parser
  const getHighlightedCode = (code: string, path: string) => {
    if (!code) return '';
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (path.endsWith('.html')) {
      // Color tags, attributes, strings, comments
      escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;)/g, '<span class="text-[#F43F5E] font-bold">$1</span>$2');
      escaped = escaped.replace(/([a-zA-Z0-9:-]+=)(["'].*?["'])/g, '<span class="text-[#38BDF8]">$1</span><span class="text-[#FB923C] font-semibold">$2</span>');
      escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-gray-550 italic">$1</span>');
    } else if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx')) {
      // Color keywords, comments, strings
      const keywords = /\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|try|catch|async|await|interface|type)\b/g;
      escaped = escaped.replace(keywords, '<span class="text-[#F43F5E] font-bold">$1</span>');
      escaped = escaped.replace(/(["'`].*?["'`])/g, '<span class="text-[#EAB308]">$1</span>');
      escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-gray-550 italic">$1</span>');
    } else if (path.endsWith('.css')) {
      escaped = escaped.replace(/([a-zA-Z-]+\s*:)/g, '<span class="text-[#38BDF8]">$1</span>');
      escaped = escaped.replace(/(\.[a-zA-Z0-9_-]+|\#[a-zA-Z0-9_-]+)/g, '<span class="text-[#F43F5E] font-bold">$1</span>');
    }
    return escaped;
  };

  // Line count numbers gutter
  const lineCount = editorContent.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Diagnostic log checks
  const warnings: string[] = [];
  if (editorContent.includes('console.log')) {
    warnings.push(isAr ? 'تنبيه جودة: يفضل إزالة دالات console.log قبل تسليم التطبيق.' : 'Quality Warning: Residual console.log debuggers should be cleaned before deployment.');
  }
  if (filePath.endsWith('.html') && !editorContent.toLowerCase().includes('<!doctype html>')) {
    warnings.push(isAr ? 'خطأ هيكلي: يفتقد ملف HTML لوسم التوافقية الأساسي <!DOCTYPE html>' : 'Structure Warning: HTML page lacks <!DOCTYPE html> specifier.');
  }

  return (
    <div id="code-editor-container" className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden shadow-xl text-right">
      
      {/* 1. Multiple files tab bar */}
      <div className="flex bg-[#0A0A0B] border-b border-white/10 overflow-x-auto scrollbar-none items-center justify-start pr-2">
        <div className="p-2 shrink-0 border-r border-white/10 text-gray-550 flex items-center gap-1.5 text-[10px] font-bold">
          <FolderOpen size={11} className="text-indigo-400" />
          <span>{isAr ? 'التبويبات:' : 'TABS:'}</span>
        </div>
        {openTabs.map(tab => {
          const isActive = tab === filePath;
          return (
            <div
              key={tab}
              onClick={() => onSelectFile && onSelectFile(tab)}
              className={`px-3 py-2 flex items-center gap-2 border-r border-white/5 text-xs font-mono font-medium transition cursor-pointer shrink-0 ${
                isActive 
                  ? 'bg-[#0F0F11] text-indigo-400 border-b border-b-indigo-500 font-bold' 
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
              dir="ltr"
            >
              <span>{tab}</span>
              {openTabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(tab, e)}
                  className="p-0.5 rounded hover:bg-white/10 text-gray-600 hover:text-rose-400 transition"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Main controller toolbar header */}
      <div className="px-4 py-2.5 bg-[#0F0F11] border-b border-white/10 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-gray-300" dir="ltr">{filePath}</span>
          {isEditing && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">
              {isAr ? 'قيد التعديل' : 'Editing'}
            </span>
          )}
        </div>

        {/* Toolbar triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded transition ${showSearch ? 'bg-indigo-600 text-white' : 'bg-[#161618] hover:bg-white/5 text-gray-300'}`}
            title={isAr ? 'البحث والاستبدال' : 'Find & Replace'}
          >
            <Search size={13} />
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition shadow"
            >
              <Save size={12} />
              <span>{isAr ? 'حفظ التعديل' : 'Save'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-200 rounded font-bold transition"
            >
              <Edit3 size={12} />
              <span>{isAr ? 'تعديل يدوي' : 'Manual Edit'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
            title="نسخ الكود"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* 3. Search & Replace expandable bar */}
      {showSearch && (
        <div className="p-3 bg-[#0A0A0B] border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-550 whitespace-nowrap shrink-0">{isAr ? 'البحث عن:' : 'Find:'}</span>
            <input 
              type="text"
              placeholder="Query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161618] border border-white/10 focus:border-indigo-500 text-white rounded px-2 py-1 outline-none font-mono text-left"
              dir="ltr"
            />
            {matchesCount > 0 && (
              <span className="text-[10px] bg-indigo-550/15 text-indigo-400 px-1.5 rounded-full font-bold">
                {matchesCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-550 whitespace-nowrap shrink-0">{isAr ? 'الاستبدال بـ:' : 'Replace:'}</span>
            <input 
              type="text"
              placeholder="Replace..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="w-full bg-[#161618] border border-white/10 focus:border-indigo-500 text-white rounded px-2 py-1 outline-none font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="flex gap-1.5 justify-end">
            <button
              onClick={handleReplace}
              disabled={!searchQuery}
              className="px-2.5 py-1 bg-[#161618] hover:bg-white/15 text-gray-300 rounded font-semibold text-[10px] disabled:opacity-40 transition"
            >
              {isAr ? 'استبدال' : 'Replace'}
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={!searchQuery}
              className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-550 text-white rounded font-bold text-[10px] disabled:opacity-40 transition shadow-sm"
            >
              {isAr ? 'استبدال الكل' : 'Replace All'}
            </button>
          </div>
        </div>
      )}

      {/* 4. Scrollable code workspace body with lines gutter */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed text-left" dir="ltr">
        {/* Line Gutter */}
        <div className="w-12 bg-[#0A0A0B] border-r border-white/10 p-3 text-right text-gray-650 select-none text-[10px] flex flex-col items-end shrink-0">
          {lineNumbers.map((num) => (
            <span key={num} className="block h-5 leading-5">{num}</span>
          ))}
        </div>

        {/* Text Area / Render highlighted markup */}
        <div className="flex-1 overflow-auto bg-[#0A0A0B] p-3 relative">
          {isEditing ? (
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="w-full h-full bg-transparent text-gray-100 border-0 outline-none resize-none font-mono text-xs leading-5 focus:ring-0 text-left whitespace-pre overflow-auto"
              dir="ltr"
              spellCheck="false"
            />
          ) : (
            <pre className="w-full text-left text-xs font-mono leading-5 overflow-x-auto whitespace-pre select-text m-0" dir="ltr">
              <code dangerouslySetInnerHTML={{ __html: getHighlightedCode(editorContent, filePath) }}></code>
            </pre>
          )}
        </div>
      </div>

      {/* 5. Diagnostics Log Panel Drawer Tray */}
      {warnings.length > 0 && (
        <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/15 flex flex-col gap-1 text-[10px] text-amber-400">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle size={11} />
            <span>{isAr ? 'تحذير تشخيصي نشط بالملف:' : 'Diagnostic warnings detected:'}</span>
          </div>
          <div className="space-y-0.5 pl-4 text-right" dir={isAr ? 'rtl' : 'ltr'}>
            {warnings.map((w, idx) => (
              <p key={idx} className="list-item list-inside">{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Editor status bar */}
      <div className="px-4 py-2 bg-[#0F0F11] border-t border-white/10 text-[10px] text-gray-550 font-mono flex justify-between items-center">
        <span>Lines: {lineCount}</span>
        <span className="uppercase">UTF-8 | {filePath.split('.').pop()} Editor</span>
      </div>
    </div>
  );
}
