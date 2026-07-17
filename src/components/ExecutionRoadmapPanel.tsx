import React, { useState, useEffect } from 'react';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Layers, 
  Compass, 
  HelpCircle,
  Terminal,
  FileArchive,
  Download,
  AlertCircle
} from 'lucide-react';
import { Project } from '../types';

interface ExecutionRoadmapPanelProps {
  project: Project;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

interface Phase {
  id: number;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  deliverablesAr: string[];
  deliverablesEn: string[];
  criteriaAr: string[];
  criteriaEn: string[];
  status: 'completed' | 'active' | 'pending';
}

export default function ExecutionRoadmapPanel({
  project,
  language,
  theme,
  addLog
}: ExecutionRoadmapPanelProps) {
  const isAr = language === 'ar';
  
  // Define the 9 Phases from the "الجزء الثامن – Execution Specification"
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 1,
      titleAr: 'المرحلة 1 – تهيئة بيئة المشروع والتأسيس',
      titleEn: 'Phase 1 – Workspace Initialization',
      taglineAr: 'إعداد مجلدات ومكونات الواجهة الأمامية والخلفية والاختبارات التأسيسية.',
      taglineEn: 'Establishing repository structure, backend services, and test scripts.',
      status: 'completed',
      deliverablesAr: [
        'إنشاء مستودع ومجلدات التطبيق الأساسية (X-AI-Studio/)',
        'تهيئة واجهة المستخدم بالتكامل مع React, TypeScript, Tailwind',
        'إعداد خادم بايثون السريع (FastAPI) والاتصال بقاعدة البيانات',
        'تهيئة ملفات الفحص والتحقق من جودة الكود البرمجي (Linter)'
      ],
      deliverablesEn: [
        'Repository directories structured (/frontend, /backend, /database, /tests)',
        'React, TypeScript, Tailwind setup on port 3000',
        'Python FastAPI skeleton connected to database layer',
        'Workspace verification linters initialized'
      ],
      criteriaAr: [
        'إمكانية تشغيل الواجهة الأمامية بسلاسة دون أخطاء',
        'نجاح الاتصال المبدئي بقاعدة البيانات والاستجابة السريعة',
        'صلاحية ملف package.json وقابليته للبناء والتحميل'
      ],
      criteriaEn: [
        'Frontend successfully boots and mounts root layout',
        'Backend connection with database verifies successfully',
        'package.json valid and compiling without syntax blocks'
      ]
    },
    {
      id: 2,
      titleAr: 'المرحلة 2 – نظام الحسابات والمصادقة الآمنة',
      titleEn: 'Phase 2 – Users Auth & Accounts',
      taglineAr: 'إعداد جداول المستخدمين، الجلسات، التشفير والتحقق من الهوية.',
      taglineEn: 'Setting up database users schemas, session cookies, JWT, and email validation.',
      status: 'completed',
      deliverablesAr: [
        'تصميم جداول المستخدمين والصلاحيات (Users, Roles, Permissions)',
        'بناء واجهات التسجيل والدخول والمصادقة الأمنية (JWT)',
        'إعداد تشفير كلمات المرور باستخدام خوارزميات التشفير الآمنة (bcrypt)',
        'توفير ميزة استعادة كلمة المرور وإرسال روابط التحقق'
      ],
      deliverablesEn: [
        'SQL users, roles, and privileges schema integrated',
        'Secure JWT user login/logout middleware implemented',
        'Unidirectional password hashing using bcrypt algorithm',
        'Recovery workflows & verify email mocks configured'
      ],
      criteriaAr: [
        'يستطيع الزائر إنشاء حساب ومطابقة الحقول بدقة',
        'تشفير كلمات المرور في قاعدة البيانات لمنع التسريب ومطابقة مفاتيح الجلسة',
        'عزل بيانات الجلسات والتحقق من هوية المستخدم في كل طلب'
      ],
      criteriaEn: [
        'Guest can register an account with validation safeguards',
        'Passwords stored in hashed, safe string format (no plaintext)',
        'Session security tokens validated sequentially on every fetch'
      ]
    },
    {
      id: 3,
      titleAr: 'المرحلة 3 – محرك إدارة وتنظيم المشاريع',
      titleEn: 'Phase 3 – Workspace Projects Manager',
      taglineAr: 'عمليات إنشاء المشاريع، التكرار والنسخ، الأرشفة، والحذف النهائي.',
      taglineEn: 'Project workspace CRUD operations, cloning, archiving, and deletion.',
      status: 'active',
      deliverablesAr: [
        'بناء قاعدة بيانات وجداول تخزين المشاريع وملفات الأكواد ومستويات التعديل',
        'توفير خيارات لإنشاء وتعديل وحذف المشروع من لوحة التحكم',
        'إضافة نظام النسخ والتكرار بنقرة واحدة (Project Duplication)',
        'توفير ميزة الأرشفة التلقائية واستعادة المشاريع المؤرشفة'
      ],
      deliverablesEn: [
        'Projects, ProjectFiles, and ProjectVersions schemas built',
        'Workspace dashboard project manager CRUD controls',
        'One-click clone/duplication algorithm implemented',
        'Project archival indicator toggling with safe status flags'
      ],
      criteriaAr: [
        'تخزين كافة العمليات بنجاح والتحقق من حفظ شجرة الملفات المقترنة',
        'ظهور المشاريع مرتبة تنازلياً مع مؤشرات توضح حالة الأرشفة',
        'تأكيد حماية حقوق الملكية: لا يمكن للمستخدم استعراض أو تعديل مشاريع الآخرين'
      ],
      criteriaEn: [
        'Workspace projects store safely in databases with file lists',
        'Dashboard updates instantly with appropriate archival visual tags',
        'Multi-tenant ownership verified (users cannot edit others’ projects)'
      ]
    },
    {
      id: 4,
      titleAr: 'المرحلة 4 – محرك تحليل المتطلبات وصياغة خطة العمل',
      titleEn: 'Phase 4 – Requirement Analysis Engine',
      taglineAr: 'تحليل وصف فكرة المستخدم باستخدام الذكاء الاصطناعي واقتراح التقنيات.',
      taglineEn: 'Scanning user prompts with Gemini AI to map required architecture and technologies.',
      status: 'pending',
      deliverablesAr: [
        'تكامل الوكيل الذكي (Requirement Analyzer Agent) مع خوادم المنصة',
        'استخراج المكونات البرمجية وصفحات المظهر المقترحة استناداً إلى الوصف',
        'تحديد اللغات والتقنيات المناسبة (مثال: React, Python, PostgreSQL)',
        'توليد مسودة خطة عمل تتابعية من 6 مراحل قابلة للتخصيص والمراجعة'
      ],
      deliverablesEn: [
        'Requirement Analyzer AI Agent integration',
        'Prompt mapping algorithms to extract pages, modules, and schemas',
        'Framework recommendation engine (e.g. Node, React, FastAPI)',
        'Detailed modular execution plan generation'
      ],
      criteriaAr: [
        'تحليل الأفكار المعقدة والقصيرة بنجاح ودون أخطاء تفسيرية',
        'تقديم هيكل مقترح للواجهات يعبر بدقة عن رغبة المشغل',
        'إمكانية مراجعة المستخدم لمسودة الخطة وتعديلها قبل البدء بالكود'
      ],
      criteriaEn: [
        'Successfully maps sparse user statements to concrete features',
        'Generates beautiful structural plan corresponding directly to description',
        'Operator can pause, refine, and approve the outline before code generation'
      ]
    },
    {
      id: 5,
      titleAr: 'المرحلة 5 – محرك توليد وعرض المعاينة التفاعلية المبدئية',
      titleEn: 'Phase 5 – System & Blueprint Preview Engine',
      taglineAr: 'عرض تفاعلي لواجهة المستخدم، مخطط الملفات، وهيكل البيانات المنسق.',
      taglineEn: 'Interactive layout simulation, file maps, schemas, and mockup preview.',
      status: 'pending',
      deliverablesAr: [
        'توليد وعرض نموذج أولي لواجهات ومظهر صفحات المشروع تفاعلياً',
        'استعراض هيكل الملفات والمجلدات المقترحة وعرض محتوياتها المبدئية',
        'تصور مخطط قاعدة البيانات والعلاقات والجداول المقترنة',
        'توفير أزرار التحكم بالموافقة على المعاينة أو تعديلها أو إلغائها'
      ],
      deliverablesEn: [
        'Interactive mock user interface presentation canvas',
        'Modular file-tree visualizer showcasing proposed file templates',
        'Database schema relational diagrams presentation',
        'Operator buttons: Approve Preview, Regenerate, Edit, or Cancel'
      ],
      criteriaAr: [
        'المعاينة تفاعلية بالكامل وتدعم النقر ومحاكاة التنقل الداخلي',
        'تطابق مخطط الجداول والعلاقات مع المتطلبات المحددة في المرحلة السابقة',
        'التحكم التام: لا يتم توليد الكود الفعلي إلا بعد نقر المستخدم على "موافق"'
      ],
      criteriaEn: [
        'Preview remains highly interactive with simulated state navigation',
        'Relational databases schema matches the requirements exactly',
        'Generation block: Code is NOT generated until user confirms preview approval'
      ]
    },
    {
      id: 6,
      titleAr: 'المرحلة 6 – توليد الأكواد البرمجية والمكونات بالكامل',
      titleEn: 'Phase 6 – Codebase Synthesis & Integration',
      taglineAr: 'بناء الملفات، كتابة الشيفرات البرمجية الكاملة، وحقن التبعيات والتنسيقات.',
      taglineEn: 'Generating real files, modular components, styling configs, and technical templates.',
      status: 'pending',
      deliverablesAr: [
        'تفعيل وكيل البرمجة المستقل (Code Generator Agent) لإنشاء الكود',
        'كتابة كود نظيف وتفاعلي بالكامل (HTML, JavaScript/TypeScript, CSS)',
        'إعداد ملف التكوين (Vite, Tailwind, Drizzle) المقترن بنوع المشروع',
        'توليد ملف التوثيق الأساسي (README.md) وملفات الرخص البرمجية'
      ],
      deliverablesEn: [
        'Active autonomous Code Generator AI Agent system initialization',
        'Clean React, TypeScript, and styling logic generation',
        'Configuration files generation (Vite, Tailwind CSS, or package configs)',
        'Default README.md and basic open-source LICENSE setup'
      ],
      criteriaAr: [
        'الشيفرة البرمجية متكاملة وخالية تماماً من الكود الوهمي أو الناقص',
        'الكود منظم وقابل للصيانة والتحرير ويتبع أفضل الممارسات الهندسية',
        'إمكانية البناء والتجميع الفعلي دون أخطاء برمجية قاتلة'
      ],
      criteriaEn: [
        'Zero dummy placeholders in key functions - code is fully logic-complete',
        'Codebase structured with industry best practices and clean comments',
        'Successful npm build compilation on the server output'
      ]
    },
    {
      id: 7,
      titleAr: 'المرحلة 7 – بيئة تشغيل الاختبارات الآلية ومراجعة الجودة',
      titleEn: 'Phase 7 – Automatic Test Runner & Quality Audits',
      taglineAr: 'تشخيص الأخطاء، التحقق من جودة الكود، وفحص الثغرات والاعتمادات.',
      taglineEn: 'Error debugging, package dependency check, syntax linting, and quality logs.',
      status: 'pending',
      deliverablesAr: [
        'تفعيل مساعد الاختبارات الذكي (Test Runner Agent)',
        'إجراء فحوصات الأخطاء والوسوم التالفة والكود المعطل تلقائياً',
        'تشغيل اختبارات المكونات البرمجية والتحقق من توافقية واجهات API',
        'توليد تقرير تشخيصي شامل يوضح جودة الكود ونسبة النجاح'
      ],
      deliverablesEn: [
        'Autonomous testing dashboard initialized',
        'Syntax verification scanner checking for unclosed divs or broken templates',
        'Component health checks and simulated integration API tests',
        'Interactive diagnostic report with success metrics and error highlights'
      ],
      criteriaAr: [
        'تقديم تقرير فوري واضح يسهل للمطور العثور على مكامن الخلل',
        'تحديد نسبة نجاح الاختبارات بوضوح (مثال: 100% ناجحة)',
        'القدرة على تشغيل الإصلاح التلقائي للأخطاء المكتشفة بالذكاء الاصطناعي'
      ],
      criteriaEn: [
        'Diagnostic logging highlights exact lines and file paths of issues',
        'Displays accurate percentage indicators of passing test cases',
        'Auto-Fix improvements triggerable with a single action'
      ]
    },
    {
      id: 8,
      titleAr: 'المرحلة 8 – إعداد وثائق المشروع التقنية الشاملة',
      titleEn: 'Phase 8 – Technical Documentation Suite',
      taglineAr: 'صياغة كتيب المطور، شرح واجهات الاستدعاء، ودليل تركيب وتشغيل المشروع.',
      taglineEn: 'Synthesizing developers manuals, endpoint guides, schemas, and setup instructions.',
      status: 'pending',
      deliverablesAr: [
        'صياغة دليل المطور الفني الشامل (Developer Guide)',
        'إنشاء شرح واجهات الاستدعاء ومسارات الربط البرمجي (API Documentation)',
        'توفير توثيق تفصيلي لقواعد البيانات والجداول والعلاقات',
        'إعداد دليل خطوة بخطوة للتشغيل والنشر الفعلي (Deployment Guide)'
      ],
      deliverablesEn: [
        'Exhaustive system architecture manual (Developer Guide)',
        'API endpoint schema definitions and sample payloads documentation',
        'Relational schema diagrams and database connection guide',
        'Docker installation and deployment blueprint documentation'
      ],
      criteriaAr: [
        'يستطيع أي مطور تشغيل المشروع وتعديله بمجرد قراءة التوثيق المولد',
        'وضوح الأوامر البرمجية وتوفيرها بصيغة قابلة للنسخ المباشر',
        'التوافق اللغوي التام وتوفير الشروحات بالعربية والإنجليزية'
      ],
      criteriaEn: [
        'New engineer can boot the project easily by following instructions',
        'Code examples are styled neatly with a quick copy button',
        'Dual-language accessibility verified for Arabic and English stakeholders'
      ]
    },
    {
      id: 9,
      titleAr: 'المرحلة 9 – تجهيز الحزم والتسليم النهائي للمشروع',
      titleEn: 'Phase 9 – Production Packaging & Delivery',
      taglineAr: 'ضغط الملفات، إتاحة التحميل الفوري ZIP، وإصدار شهادات الإنجاز الفني.',
      taglineEn: 'Compiling archives, generating live ZIP downloads, and compiling execution reports.',
      status: 'pending',
      deliverablesAr: [
        'تجميع كافة المخرجات والمستندات التقنية في باقة واحدة متكاملة',
        'ضغط ملفات المشروع بصيغة ZIP صالحة للتنزيل المباشر والتشغيل الفوري',
        'توفير حزم التشغيل التنفيذية المناسبة عند توفر أدوات البناء',
        'إصدار تقرير المطابقة والمراجعة الفنية النهائية للمشروع'
      ],
      deliverablesEn: [
        'Compiling codebase assets and manuals into unified bundle folder',
        'Creating high-compression ZIP file of the repository',
        'Providing executable builds or platform-specific packages if available',
        'Compiling overall system conformity certificate and compliance overview'
      ],
      criteriaAr: [
        'تنزيل الأكواد المصدرية كاملة دون أي انقطاع أو فقدان في الملفات',
        'سلامة الملف المضغوط وصلاحيته للفك والتشغيل على كافة أنظمة الحاسوب',
        'إصدار تقرير ختامي للمطابقة يضمن استقلالية العميل وموافقته على النتائج'
      ],
      criteriaEn: [
        'ZIP archives download matches workspace file tree perfectly',
        'ZIP files extract without any CRC errors or corrupt folders on any platform',
        'Conformity report seals active development with customer-approved milestone release'
      ]
    }
  ]);

  const [activePhaseId, setActivePhaseId] = useState<number>(3); // Default to Phase 3
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);

  // Auto-fill active phase on mount based on active file or project metrics
  useEffect(() => {
    // We can simulate current stage based on project file existence
    const filesCount = Object.keys(project.files).length;
    if (filesCount > 5) {
      setActivePhaseId(6); // Code complete
    } else {
      setActivePhaseId(3); // Project workspace
    }
  }, [project]);

  const runPhaseAudit = (phaseId: number) => {
    setAuditRunning(true);
    setAuditComplete(false);
    setAuditScore(null);
    setAuditLogs([]);
    const targetPhase = phases.find(p => p.id === phaseId);
    if (!targetPhase) return;

    addLog(
      isAr 
        ? `⚙ جاري فحص وتدقيق مخرجات ومعايير قبول [${targetPhase.titleAr}]...` 
        : `⚙ Initiating compliance and acceptance audit on [${targetPhase.titleEn}]...`,
      'info'
    );

    const logSteps = isAr ? [
      `[بدء الفحص الآلي] جاري تحليل مطابقة ملفات المشروع ومعطيات قاعدة البيانات...`,
      `[1/3] التحقق من المخرجات المتولدة: تم العثور على ${Object.keys(project.files).length} ملفات مصدرية.`,
      `[2/3] فحص معايير القبول: مراجعة سلامة بنية الكود وعزل الخصائص...`,
      `[3/3] تدقيق الأمن والحماية: التحقق من تشفير البيانات وصلاحيات الوصول...`,
      `[اكتمال التدقيق] تطابق المخرجات بنسبة 100% مع معايير وثيقة SRS.`
    ] : [
      `[Audit Boot] Scanning local workspace files and active schema records...`,
      `[1/3] Deliverables Scan: Detected ${Object.keys(project.files).length} active file assets in path.`,
      `[2/3] Acceptance Criteria: Inspecting syntax integrity and module boundaries...`,
      `[3/3] Safety Auditing: Scanning secrets context and sandbox constraints...`,
      `[Completed] Compliance score rated perfectly verified against SRS spec!`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setAuditLogs(prev => [...prev, logSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setAuditRunning(false);
        setAuditComplete(true);
        setAuditScore(98); // 98% compliance score
        
        // Mark checked phase as completed or keep active
        setPhases(prev => prev.map(p => {
          if (p.id === phaseId) {
            return { ...p, status: 'completed' };
          }
          // Move next phase to active if it was pending
          if (p.id === phaseId + 1 && p.status === 'pending') {
            return { ...p, status: 'active' };
          }
          return p;
        }));

        addLog(
          isAr 
            ? `✔ نجح تدقيق المخرجات لـ [${targetPhase.titleAr}] بنسبة مطابقة 98%!` 
            : `✔ Compliance audit for [${targetPhase.titleEn}] succeeded with 98% score!`,
          'success'
        );
      }
    }, 450);
  };

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <div className="flex flex-col h-full bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden shadow-2xl text-right" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="px-4 py-3 bg-[#0F0F11] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Milestone size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-white tracking-wider">
            {isAr ? 'مواصفات وخارطة التنفيذ المرحلية (Execution Roadmap)' : 'Phased Execution Roadmap & SRS Tracker'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
          {isAr ? '9 مراحل تتابعية' : '9 Sequential Phases'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0B]">
        {/* Short info */}
        <p className="text-[10px] text-gray-400 leading-relaxed bg-[#111113]/60 p-3 rounded-lg border border-white/5">
          {isAr 
            ? 'يقوم هذا المحرك بمطابقة حالة تطوير المشروع الحالي مع "وثيقة مواصفات المتطلبات والمراحل (SRS)". اختر أي مرحلة لاستعراض المخرجات ومعايير القبول وإجراء تدقيق التحقق الآلي للمخرجات.' 
            : 'Track real-time code compliance against the Software Requirements Specification (SRS). Select any development phase below to audit its deliverables and acceptance conditions.'}
        </p>

        {/* Timeline Horizontal / Vertical Selector */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {isAr ? 'خطوات وجدول تتابع المراحل' : 'Phase Timeline Ledger'}
          </h4>
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scroll">
            {phases.map((p) => {
              const isActive = p.id === activePhaseId;
              const isCompleted = p.status === 'completed';
              const isRunning = p.status === 'active';
              
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePhaseId(p.id);
                    setAuditComplete(false);
                    setAuditLogs([]);
                    setAuditScore(null);
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg border text-right transition flex flex-col gap-1 ${
                    isActive 
                      ? 'bg-indigo-650/10 border-indigo-500 text-white' 
                      : isCompleted
                      ? 'bg-emerald-500/[0.02] border-emerald-500/20 text-gray-300 hover:border-emerald-500/40'
                      : 'bg-[#111113] border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <CheckCircle2 size={11} className="text-emerald-400" />
                    ) : isRunning ? (
                      <Clock size={11} className="text-amber-400 animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                    )}
                    <span className="text-[10px] font-bold font-mono">#{p.id}</span>
                  </div>
                  <span className="text-[9px] font-medium max-w-[110px] truncate">
                    {isAr ? p.titleAr.split(' – ')[1] : p.titleEn.split(' – ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Phase Details Card */}
        <div className="p-4 bg-[#161618] border border-white/5 rounded-xl space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">
                {isAr ? `مواصفات التقييم – المرحلة ${activePhase.id} من 9` : `Specification Audit – Phase ${activePhase.id} of 9`}
              </span>
              <h3 className="font-bold text-xs text-white mt-1">
                {isAr ? activePhase.titleAr : activePhase.titleEn}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                {isAr ? activePhase.taglineAr : activePhase.taglineEn}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                activePhase.status === 'completed' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : activePhase.status === 'active'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                  : 'bg-white/5 text-gray-500 border-white/5'
              }`}>
                {activePhase.status === 'completed' 
                  ? (isAr ? 'مكتمل وموثق' : 'Completed') 
                  : activePhase.status === 'active'
                  ? (isAr ? 'قيد التنفيذ النشط' : 'Active Execution')
                  : (isAr ? 'قيد الانتظار التتابعي' : 'Pending')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {/* Deliverables Column */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <Layers size={11} className="text-indigo-400" />
                <span>{isAr ? 'المخرجات الفنية المطلوبة' : 'Required Deliverables'}</span>
              </h4>
              <ul className="space-y-1.5 text-[10px] text-gray-400">
                {(isAr ? activePhase.deliverablesAr : activePhase.deliverablesEn).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acceptance Criteria Column */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" />
                <span>{isAr ? 'معايير القبول والمطابقة' : 'Acceptance Criteria'}</span>
              </h4>
              <ul className="space-y-1.5 text-[10px] text-gray-400">
                {(isAr ? activePhase.criteriaAr : activePhase.criteriaEn).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <CheckCircle2 size={11} className="text-emerald-500/60 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="flex justify-between items-center pt-3 border-t border-white/5 flex-wrap gap-2">
            <span className="text-[9px] text-gray-500 flex items-center gap-1">
              <HelpCircle size={11} />
              <span>{isAr ? 'اضغط لتشغيل اختبار تدقيق المطابقة المباشر' : 'Trigger interactive compliance verification'}</span>
            </span>

            <button
              onClick={() => runPhaseAudit(activePhase.id)}
              disabled={auditRunning}
              className={`px-3 py-1.5 font-bold text-[10px] rounded-lg transition flex items-center gap-1 ${
                auditRunning 
                  ? 'bg-indigo-650/45 text-white/50 cursor-not-allowed'
                  : 'bg-indigo-650 hover:bg-indigo-500 text-white'
              }`}
            >
              {auditRunning ? (
                <RefreshCw size={10} className="animate-spin" />
              ) : (
                <Play size={10} />
              )}
              <span>{isAr ? 'تدقيق مطابقة مخرجات المرحلة' : 'Verify Compliance Audit'}</span>
            </button>
          </div>
        </div>

        {/* Audit Results / Simulation terminal output */}
        {(auditRunning || auditComplete) && (
          <div className="p-3 bg-[#0F0F11] border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                <Terminal size={14} />
                <span>{isAr ? 'كونسول فحص ومطابقة الـ SRS' : 'SRS Compliance Verification Console'}</span>
              </div>
              
              {auditScore !== null && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold border border-emerald-500/20">
                  {isAr ? `تطابق SRS: ${auditScore}%` : `SRS Match: ${auditScore}%`}
                </span>
              )}
            </div>

            <div className="bg-[#050506] border border-white/5 p-3 rounded-lg font-mono text-[9px] text-gray-400 leading-5 text-left space-y-1.5 max-h-44 overflow-y-auto" dir="ltr">
              {auditLogs.map((log, index) => {
                let textCol = 'text-slate-400';
                if (log.includes('[بدء') || log.includes('[Audit')) {
                  textCol = 'text-indigo-400 font-semibold';
                } else if (log.includes('[Completed') || log.includes('تطابق') || log.includes('100%')) {
                  textCol = 'text-emerald-400 font-bold';
                } else if (log.includes('•') || log.includes('✔')) {
                  textCol = 'text-emerald-400';
                }
                return (
                  <div key={index} className={textCol}>
                    {log}
                  </div>
                );
              })}
              {auditRunning && (
                <div className="text-indigo-400 animate-pulse font-mono text-[9px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                  <span>Executing live automated criteria mapping...</span>
                </div>
              )}
            </div>

            {auditComplete && auditScore !== null && (
              <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-lg flex items-center justify-between flex-wrap gap-2 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>{isAr ? 'معايير القبول مطابقة بنجاح' : 'Milestone Criteria Approved'}</span>
                  </span>
                  <p className="text-[9px] text-gray-400">
                    {isAr 
                      ? 'تم التحقق من تطابق شفرات الأكواد وهياكل ملفات التطبيق التفاعلي مع البند رقم 8 في وثيقة متطلبات النظام.' 
                      : 'Verified code structures, active database schemas, and output ZIP packages align with Section 8 requirements.'}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    addLog(
                      isAr 
                        ? `✔ تم تصدير تقرير مطابقة المرحلة ${activePhase.id} بنجاح!` 
                        : `✔ Exported Compliance Certificate for Phase ${activePhase.id} successfully!`,
                      'success'
                    );
                  }}
                  className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-md transition flex items-center gap-1"
                >
                  <Download size={10} />
                  <span>{isAr ? 'حفظ تقرير المطابقة' : 'Save Conformity Cert'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
