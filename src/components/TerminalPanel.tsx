import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2 } from 'lucide-react';
import { TerminalLog } from '../types';

interface TerminalPanelProps {
  logs: TerminalLog[];
  onClear: () => void;
  onExecuteCommand: (command: string) => void;
}

export default function TerminalPanel({ logs, onClear, onExecuteCommand }: TerminalPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new log entry
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    onExecuteCommand(cmd);
    setInputVal('');
  };

  const getLogColor = (type: TerminalLog['type']) => {
    if (type === 'success') return 'text-emerald-400';
    if (type === 'warning') return 'text-amber-400';
    if (type === 'error') return 'text-rose-400 font-semibold';
    if (type === 'command') return 'text-indigo-400 font-bold';
    if (type === 'input') return 'text-gray-300';
    return 'text-gray-400';
  };

  return (
    <div id="terminal-panel-container" className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="px-4 py-2.5 bg-[#0F0F11] border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wider">الطرفية والعمليات (Terminal)</span>
        </div>
        <button
          id="btn-clear-terminal"
          onClick={onClear}
          className="p-1 rounded bg-[#161618] border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          title="مسح السجلات"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Terminal screen content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 text-left bg-[#0A0A0B]" dir="ltr">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed whitespace-pre-wrap">
            <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
            {log.type === 'command' && <span className="text-indigo-400 font-bold">x-studio$ </span>}
            <span className={getLogColor(log.type)}>{log.text}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Terminal input console */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#0F0F11] px-3 py-2 flex items-center gap-2" dir="ltr">
        <span className="text-indigo-400 font-bold text-xs select-none">x-studio$</span>
        <input
          id="input-terminal-command"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="اكتب أمراً هنا (مثال: npm run build، help)"
          className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs border-0 focus:ring-0 p-1"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          id="btn-send-command"
          type="submit"
          className="p-1 hover:bg-[#161618] rounded text-gray-400 hover:text-white transition"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
