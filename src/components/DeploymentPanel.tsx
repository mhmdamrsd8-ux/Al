import React, { useState } from 'react';
import { Cloud, Globe, CheckCircle2, AlertTriangle, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import { DeploymentStatus } from '../types';

interface DeploymentPanelProps {
  projectName: string;
  onSimulateDeployment: () => void;
  status: DeploymentStatus;
}

export default function DeploymentPanel({ projectName, onSimulateDeployment, status }: DeploymentPanelProps) {
  const getProgressStyles = () => {
    return { width: `${status.progress}%` };
  };

  return (
    <div id="deployment-panel-container" className="bg-[#0F0F11] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Cloud size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">نشر واستضافة السحاب (Deployment)</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">انشر تطبيقك بضغطة زر واحصل على رابط عام لمشاركته.</p>
          </div>
        </div>

        {/* Dynamic States */}
        {status.state === 'idle' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#161618] rounded-full flex items-center justify-center text-gray-400 border border-white/10">
              <Globe size={28} />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-xs">التطبيق جاهز للنشر السحابي</h4>
              <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">
                سيقوم نظام X Studio ببناء وضغط الملفات تلقائياً، وإعداد خوادم الاستضافة، وتثبيت شهادات الأمان SSL مجاناً.
              </p>
            </div>
            <button
              id="btn-trigger-deploy"
              onClick={onSimulateDeployment}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-bold text-xs transition duration-200 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              <Cloud size={14} />
              <span>البدء بنشر المشروع البرمجي</span>
            </button>
          </div>
        )}

        {/* Deploying states */}
        {(status.state === 'building' || status.state === 'deploying') && (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-3">
              <Loader2 size={18} className="text-indigo-400 animate-spin" />
              <div>
                <h4 className="font-bold text-xs text-white">
                  {status.state === 'building' ? 'جاري تجميع وضغط الملفات المصدرية...' : 'جاري رفع الملفات للخادم السحابي وإعداد شهادات SSL...'}
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">نسبة التقدم المباشر: {status.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0A0A0B] rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={getProgressStyles()}
              />
            </div>

            {/* Simulated log checklist */}
            <div className="bg-[#0A0A0B] rounded-lg p-3 border border-white/10 text-[10px] font-mono space-y-2 text-left" dir="ltr">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">1. Analyzing package dependencies...</span>
                <span className="text-emerald-400 font-bold">DONE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">2. Running esbuild bundler...</span>
                <span className={status.progress > 30 ? 'text-emerald-400 font-bold' : 'text-amber-400 animate-pulse'}>
                  {status.progress > 30 ? 'DONE' : 'RUNNING...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">3. Minimizing layout assets...</span>
                <span className={status.progress > 60 ? 'text-emerald-400 font-bold' : status.progress > 30 ? 'text-amber-400 animate-pulse' : 'text-gray-600'}>
                  {status.progress > 60 ? 'DONE' : status.progress > 30 ? 'RUNNING...' : 'PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">4. Creating dynamic edge proxy...</span>
                <span className={status.progress > 90 ? 'text-emerald-400 font-bold' : status.progress > 60 ? 'text-amber-400 animate-pulse' : 'text-gray-600'}>
                  {status.progress > 90 ? 'DONE' : status.progress > 60 ? 'RUNNING...' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Live Active State */}
        {status.state === 'live' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 mx-auto bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">تم نشر تطبيقك بنجاح! 🎉</h4>
              <p className="text-[10px] text-gray-400 mt-1">تطبيقك الآن يعمل بشكل عام على خوادم الاستضافة العالمية Edge Networks.</p>
            </div>

            {/* General URL output */}
            <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-2.5 flex items-center justify-between gap-2" dir="ltr">
              <span className="text-xs text-indigo-400 font-semibold truncate select-all">{status.url}</span>
              <a
                id="btn-open-deployed-link"
                href={status.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold shrink-0 transition"
              >
                زيارة الرابط
              </a>
            </div>

            <button
              id="btn-re-deploy"
              onClick={onSimulateDeployment}
              className="w-full border border-white/10 hover:bg-white/5 bg-[#161618] text-gray-300 py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={11} />
              <span>إعادة النشر (مزامنة التعديلات)</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-[9px] text-gray-500 border-t border-white/10 pt-3 text-center">
        تعتمد استضافة X AI Studio على معمارية سحابية موزعة لضمان أفضل سرعة وأمان.
      </div>
    </div>
  );
}
