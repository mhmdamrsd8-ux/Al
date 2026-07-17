import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RotateCw, RefreshCw, ExternalLink } from 'lucide-react';
import { DeviceType } from '../types';

interface DeviceSimulatorProps {
  files: Record<string, string>;
  projectName?: string;
}

export default function DeviceSimulator({ files, projectName = 'معاينة التطبيق' }: DeviceSimulatorProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Compile project files into a single unified HTML source for the iframe srcDoc
  const compileProjectSource = (): string => {
    let html = files['index.html'] || `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #f8fafc; padding: 20px; text-align: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6; margin-bottom: 16px;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="15" y1="9" y2="9"/><line x1="9" x2="15" y1="13" y2="13"/><line x1="9" x2="13" y1="17" y2="17"/></svg>
        <h2>لم يتم العثور على ملف index.html رئيسي</h2>
        <p style="color: #94a3b8; font-size: 14px;">يرجى إنشاء ملف index.html في مستكشف الملفات للبدء.</p>
      </div>
    `;

    // 1. Replace style.css or styles.css references
    if (files['style.css']) {
      html = html.replace(
        /<link[^>]*href=["']style\.css["'][^>]*>/gi,
        `<style>${files['style.css']}</style>`
      );
    } else if (files['styles.css']) {
      html = html.replace(
        /<link[^>]*href=["']styles\.css["'][^>]*>/gi,
        `<style>${files['styles.css']}</style>`
      );
    }

    // Replace any other custom css files defined in the project
    for (const [key, val] of Object.entries(files)) {
      if (key.endsWith('.css') && key !== 'style.css' && key !== 'styles.css') {
        html = html.replace(
          new RegExp(`<link[^>]*href=["']${key}["'][^>]*>`, 'gi'),
          `<style>${val}</style>`
        );
      }
    }

    // 2. Replace script references (e.g. app.js or script.js) with inlined content
    let scriptsToAppend: string[] = [];
    for (const [key, val] of Object.entries(files)) {
      if (key.endsWith('.js') || key.endsWith('.ts')) {
        const scriptRegex = new RegExp(`<script[^>]*src=["']${key}["'][^>]*><\\/script>`, 'gi');
        if (scriptRegex.test(html)) {
          html = html.replace(scriptRegex, `<script>${val}</script>`);
        } else {
          // If app.js or script.js is present but not explicitly referenced, we queue it to append at the end
          if (key === 'app.js' || key === 'script.js' || key === 'main.js') {
            scriptsToAppend.push(val);
          }
        }
      }
    }

    // Append standard queued scripts before ending tag
    if (scriptsToAppend.length > 0) {
      const scriptBlock = scriptsToAppend.map(s => `<script>${s}</script>`).join('\n');
      html = html.replace('</body>', `${scriptBlock}</body>`);
    }

    return html;
  };

  const getDeviceDimensions = () => {
    if (device === 'desktop') return 'w-full h-full rounded-none';
    if (device === 'tablet') {
      return isLandscape 
        ? 'w-[768px] h-[512px] rounded-2xl border-8 border-[#161618]' 
        : 'w-[512px] h-[768px] rounded-2xl border-8 border-[#161618]';
    }
    // mobile
    return isLandscape 
      ? 'w-[568px] h-[320px] rounded-2xl border-[10px] border-[#161618]' 
      : 'w-[320px] h-[568px] rounded-2xl border-[10px] border-[#161618]';
  };

  const openInNewTab = () => {
    const compiledSource = compileProjectSource();
    const newTab = window.open();
    if (newTab) {
      newTab.document.open();
      newTab.document.write(compiledSource);
      newTab.document.close();
    }
  };

  return (
    <div id="device-simulator-container" className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Control Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F0F11] border-b border-white/10 text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold font-mono tracking-wider text-gray-400 hidden sm:inline">LIVE PREVIEW:</span>
          <span className="text-xs font-semibold text-white max-w-[120px] sm:max-w-none truncate">{projectName}</span>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center bg-[#0A0A0B] border border-white/10 rounded-lg p-0.5">
          <button 
            id="btn-viewport-desktop"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition ${device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="شاشة كمبيوتر"
          >
            <Monitor size={15} />
          </button>
          <button 
            id="btn-viewport-tablet"
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition ${device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="جهاز لوحي"
          >
            <Tablet size={15} />
          </button>
          <button 
            id="btn-viewport-mobile"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition ${device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="هاتف محمول"
          >
            <Smartphone size={15} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {device !== 'desktop' && (
            <button 
              id="btn-rotate-device"
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1.5 rounded-lg border border-white/5 bg-[#161618] hover:bg-white/10 text-gray-400 hover:text-white transition"
              title="تدوير الشاشة"
            >
              <RotateCw size={14} />
            </button>
          )}
          <button 
            id="btn-refresh-preview"
            onClick={reloadIframe}
            className="p-1.5 rounded-lg border border-white/5 bg-[#161618] hover:bg-white/10 text-gray-400 hover:text-white transition"
            title="تحديث المعاينة"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            id="btn-external-preview"
            onClick={openInNewTab}
            className="p-1.5 rounded-lg border border-white/5 bg-[#161618] hover:bg-white/10 text-gray-400 hover:text-white transition"
            title="فتح في نافذة كاملة"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Simulator Sandbox Viewport */}
      <div className="flex-1 flex items-center justify-center bg-[#0A0A0B] p-4 overflow-auto">
        <div className={`transition-all duration-300 shadow-xl overflow-hidden bg-white ${getDeviceDimensions()}`}>
          <iframe
            key={iframeKey}
            id="preview-sandbox-iframe"
            title="X AI Sandbox Environment"
            srcDoc={compileProjectSource()}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
          />
        </div>
      </div>

      {/* Device specs footer */}
      <div className="px-4 py-1.5 bg-[#0F0F11] border-t border-white/10 text-[10px] text-gray-500 font-mono flex justify-between items-center">
        <span>STATUS: ACTIVE & SECURED</span>
        <span>
          {device === 'desktop' ? 'Responsive (100% x 100%)' : `${isLandscape ? 'Landscape' : 'Portrait'} (${device === 'tablet' ? '768x1024' : '360x740'})`}
        </span>
      </div>
    </div>
  );
}
