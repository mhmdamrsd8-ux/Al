import React, { useState } from 'react';
import { Folder, FileCode, Plus, Trash2, HelpCircle } from 'lucide-react';

interface FileExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (path: string) => void;
  onAddFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onSelectFile,
  onAddFile,
  onDeleteFile
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFileName.trim();
    if (!trimmed) return;

    if (files[trimmed]) {
      setErrorMsg('هذا الملف موجود بالفعل!');
      return;
    }

    if (!trimmed.includes('.')) {
      setErrorMsg('يرجى تضمين اللاحقة (مثال: .html أو .js)');
      return;
    }

    onAddFile(trimmed);
    setNewFileName('');
    setIsAdding(false);
    setErrorMsg('');
  };

  const getLanguageIcon = (path: string) => {
    if (path.endsWith('.html')) return <span className="text-amber-500 font-bold text-xs font-mono">HTML</span>;
    if (path.endsWith('.css')) return <span className="text-blue-400 font-bold text-xs font-mono">CSS</span>;
    if (path.endsWith('.js') || path.endsWith('.ts')) return <span className="text-yellow-400 font-bold text-xs font-mono">JS</span>;
    if (path.endsWith('.md')) return <span className="text-violet-400 font-bold text-xs font-mono">MD</span>;
    return <span className="text-slate-400 font-bold text-xs font-mono">TXT</span>;
  };

  // Filter paths by name or content
  const filteredFilePaths = Object.keys(files).filter(path => {
    const lowerPath = path.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const fileContent = files[path] || '';
    return lowerPath.includes(lowerQuery) || fileContent.toLowerCase().includes(lowerQuery);
  });

  return (
    <div id="file-explorer-container" className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0F0F11] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wider">مستكشف الملفات</span>
        </div>
        <button
          id="btn-add-file-toggle"
          onClick={() => {
            setIsAdding(!isAdding);
            setErrorMsg('');
          }}
          className="p-1 rounded bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
          title="ملف جديد"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Live search input box */}
      <div className="px-3 py-2 bg-[#0A0A0B] border-b border-white/5">
        <input 
          id="input-file-search"
          type="text"
          placeholder="البحث في الملفات ومحتواها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-[10px] bg-[#161618] border border-white/10 focus:border-indigo-500 text-slate-100 rounded px-2 py-1.5 outline-none font-medium text-right"
          dir="rtl"
        />
      </div>

      {/* Add File Inline Form */}
      {isAdding && (
        <form onSubmit={handleCreateFile} className="p-3 border-b border-white/10 bg-[#0A0A0B]/50">
          <input
            id="input-new-file-name"
            type="text"
            placeholder="مثال: main.js"
            value={newFileName}
            onChange={(e) => {
              setNewFileName(e.target.value);
              setErrorMsg('');
            }}
            className="w-full text-xs bg-[#161618] border border-white/10 focus:border-indigo-500 text-slate-100 rounded px-2 py-1.5 outline-none font-mono text-left"
            dir="ltr"
            autoFocus
          />
          {errorMsg && (
            <p className="text-[10px] text-rose-400 mt-1">{errorMsg}</p>
          )}
          <div className="flex gap-1.5 mt-2 justify-end">
            <button
              id="btn-cancel-add-file"
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[10px] text-gray-400 hover:text-gray-200 px-2 py-1"
            >
              إلغاء
            </button>
            <button
              id="btn-submit-add-file"
              type="submit"
              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded font-semibold"
            >
              إنشاء
            </button>
          </div>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#0A0A0B]">
        {filteredFilePaths.length === 0 ? (
          <p className="text-[10px] text-gray-500 text-center py-4">لا توجد ملفات تطابق البحث</p>
        ) : (
          filteredFilePaths.map((path) => {
            const isActive = path === activeFile;
            return (
              <div
                key={path}
                id={`file-row-${path.replace('.', '-')}`}
                className={`flex items-center justify-between group px-2.5 py-2 rounded-lg transition cursor-pointer ${isActive ? 'bg-indigo-600/10 border border-indigo-500/30 text-white' : 'hover:bg-white/5 border border-transparent text-gray-400'}`}
                onClick={() => onSelectFile(path)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 flex items-center justify-center">
                    {getLanguageIcon(path)}
                  </div>
                  <span className="text-xs font-medium truncate font-mono text-gray-200" dir="ltr">
                    {path}
                  </span>
                </div>

                {/* Action Buttons for non-critical files */}
                {path !== 'index.html' && (
                  <button
                    id={`btn-delete-file-${path.replace('.', '-')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`هل أنت متأكد من رغبتك في حذف ملف ${path}؟`)) {
                        onDeleteFile(path);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded text-gray-500 hover:text-rose-400 transition"
                    title="حذف الملف"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Guide Note */}
      <div className="p-3 bg-[#0F0F11]/30 border-t border-white/10 flex items-start gap-2 text-[10px] text-gray-500">
        <HelpCircle size={14} className="text-gray-600 shrink-0 mt-0.5" />
        <span>انقر على الملف لعرض وتعديل كوده مباشرة، أو اسأل الذكاء الاصطناعي ليقوم بتحديثاته لك.</span>
      </div>
    </div>
  );
}
