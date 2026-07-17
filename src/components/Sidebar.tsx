import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Trash2, Cpu, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface SidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onResetChat: () => void;
}

export default function Sidebar({ messages, onSendMessage, isGenerating, onResetChat }: SidebarProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = inputText.trim();
    if (!txt || isGenerating) return;

    onSendMessage(txt);
    setInputText('');
  };

  const QUICK_PROMPTS = [
    'أضف زر مشاركة للتطبيق',
    'اجعل ألوان الواجهة خضراء ملكية',
    'أضف قسم أسئلة شائعة (FAQ)',
    'تصدير كود نظيف وتفاعلي'
  ];

  return (
    <div id="companion-sidebar-container" className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Title Header */}
      <div className="px-4 py-3 bg-[#0F0F11] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wider">مساعد التطوير الذكي X AI</span>
        </div>
        <button
          id="btn-reset-chat"
          onClick={() => {
            if (confirm('هل ترغب في إعادة ضبط المحادثة والبدء من جديد؟')) {
              onResetChat();
            }
          }}
          className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-rose-400 transition"
          title="إعادة ضبط المحادثة"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-start bg-[#0A0A0B]">
        {messages.length === 0 ? (
          <div className="text-center py-10 my-auto px-4 space-y-3">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
              <Cpu size={22} className="animate-pulse" />
            </div>
            <h4 className="font-bold text-gray-200 text-xs">مستعد لتنفيذ أفكارك!</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
              اكتب أي فكرة تطبيق برمجية (أو تعديل مرغوب) باللغة العربية أو الإنجليزية وسيقوم الذكاء الاصطناعي بكتابة الأكواد المصدرية وبنائها فورياً لك!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex items-center gap-2 px-3 py-2 bg-[#0F0F11]/50 border border-white/10 rounded-lg text-gray-400 text-[10px] justify-center text-center">
                  <AlertCircle size={12} className="text-indigo-400 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                id={`chat-msg-${msg.id}`}
                className={`flex flex-col max-w-[85%] ${isAI ? 'self-start items-start text-right' : 'self-end items-end text-right'}`}
              >
                {/* Sender Name */}
                <span className="text-[9px] text-gray-500 font-semibold mb-1 px-1">
                  {isAI ? 'X AI Assistant' : 'المستخدم'}
                </span>

                {/* Message Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                    isAI
                      ? 'bg-[#0F0F11] border border-white/10 text-gray-200 rounded-tr-none'
                      : 'bg-indigo-600 text-white rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Show files list if updated */}
                  {msg.filesUpdated && msg.filesUpdated.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] text-gray-400 space-y-1">
                      <p className="font-semibold text-indigo-400">الملفات التي تم تحديثها:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.filesUpdated.map((f) => (
                          <span key={f} className="bg-[#0A0A0B] px-1.5 py-0.5 rounded text-gray-300 font-mono" dir="ltr">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex flex-col max-w-[85%] self-start items-start">
            <span className="text-[9px] text-gray-500 font-semibold mb-1 px-1">X AI Assistant</span>
            <div className="px-3.5 py-3 rounded-2xl bg-[#0F0F11] border border-white/10 text-gray-400 text-xs rounded-tr-none flex items-center gap-2">
              <LoaderDots />
              <span className="text-[10px] animate-pulse">جاري صياغة وبناء الملفات والأكواد البرمجية...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion tags */}
      {messages.length > 0 && !isGenerating && (
        <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-[#0A0A0B]/40 border-t border-white/5 scrollbar-none">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              id={`quick-prompt-${prompt.replace(/\s+/g, '-')}`}
              onClick={() => onSendMessage(prompt)}
              className="text-[10px] bg-[#0F0F11] hover:bg-[#161618] text-gray-300 px-2.5 py-1 rounded-full border border-white/10 hover:border-white/20 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input controller form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#0F0F11] flex items-center gap-2">
        <input
          id="input-chat-prompt"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isGenerating ? 'جاري معالجة الطلب...' : 'اكتب طلب تعديل أو ميزة جديدة...'}
          disabled={isGenerating}
          className="flex-1 bg-[#161618] border border-white/10 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition disabled:opacity-50 placeholder-gray-600"
        />
        <button
          id="btn-send-prompt"
          type="submit"
          disabled={isGenerating || !inputText.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#161618] text-white disabled:text-gray-600 rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0"
        >
          <Send size={14} className="scale-x-[-1]" />
        </button>
      </form>
    </div>
  );
}

function LoaderDots() {
  return (
    <div className="flex gap-1">
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
    </div>
  );
}
