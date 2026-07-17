export interface BuildSpecs {
  screens: { name: string; description: string; navigation: string }[];
  design: {
    colors: { name: string; hex: string; role: string }[];
    fontSans: string;
    fontMono: string;
    icons: string;
  };
  fileTree: { path: string; type: 'file' | 'folder'; size?: string; desc: string }[];
  database: {
    engine: string;
    tables: { name: string; columns: string[]; rowsCount: number }[];
  };
  apis: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; desc: string; response: string }[];
  workflow: string[];
}

export const PROJECT_TYPES = [
  { id: 'website', nameAr: 'موقع ويب', nameEn: 'Website', icon: 'Globe' },
  { id: 'ecommerce', nameAr: 'متجر إلكتروني', nameEn: 'E-commerce Store', icon: 'ShoppingBag' },
  { id: 'management', nameAr: 'نظام إدارة', nameEn: 'Management System', icon: 'Sliders' },
  { id: 'android', nameAr: 'تطبيق Android', nameEn: 'Android App', icon: 'Smartphone' },
  { id: 'ios', nameAr: 'تطبيق iPhone (iOS)', nameEn: 'iPhone App (iOS)', icon: 'Tablet' },
  { id: 'windows', nameAr: 'تطبيق Windows', nameEn: 'Windows App', icon: 'Monitor' },
  { id: 'macos', nameAr: 'تطبيق macOS', nameEn: 'macOS App', icon: 'Cpu' },
  { id: 'linux', nameAr: 'تطبيق Linux', nameEn: 'Linux App', icon: 'Terminal' },
  { id: 'game', nameAr: 'لعبة ثنائية/ثلاثية الأبعاد', nameEn: '2D/3D Game', icon: 'Gamepad' },
  { id: 'api', nameAr: 'واجهة API', nameEn: 'API Service', icon: 'Database' },
  { id: 'desktop', nameAr: 'برنامج سطح المكتب', nameEn: 'Desktop Software', icon: 'Laptop' },
  { id: 'python', nameAr: 'مشروع Python', nameEn: 'Python Project', icon: 'Code' },
  { id: 'java', nameAr: 'مشروع Java', nameEn: 'Java Project', icon: 'Coffee' },
  { id: 'csharp', nameAr: 'مشروع C#', nameEn: 'C# Project', icon: 'Hash' },
  { id: 'cpp', nameAr: 'مشروع C++', nameEn: 'C++ Project', icon: 'PlusSquare' },
  { id: 'flutter', nameAr: 'مشروع Flutter', nameEn: 'Flutter Project', icon: 'Smartphone' },
  { id: 'react', nameAr: 'مشروع React', nameEn: 'React Project', icon: 'Layers' },
  { id: 'react_native', nameAr: 'مشروع React Native', nameEn: 'React Native Project', icon: 'Smartphone' },
  { id: 'vue', nameAr: 'مشرِوع Vue', nameEn: 'Vue Project', icon: 'Box' },
  { id: 'angular', nameAr: 'مشروع Angular', nameEn: 'Angular Project', icon: 'Shield' },
  { id: 'nodejs', nameAr: 'مشروع Node.js', nameEn: 'Node.js Project', icon: 'Server' },
  { id: 'django', nameAr: 'مشروع Django', nameEn: 'Django Project', icon: 'BookOpen' },
  { id: 'fastapi', nameAr: 'مشروع FastAPI', nameEn: 'FastAPI Project', icon: 'Zap' },
  { id: 'laravel', nameAr: 'مشروع Laravel', nameEn: 'Laravel Project', icon: 'Heart' },
  { id: 'php', nameAr: 'مشروع PHP', nameEn: 'PHP Project', icon: 'Feather' },
  { id: 'go', nameAr: 'مشروع Go', nameEn: 'Go Project', icon: 'Activity' },
  { id: 'rust', nameAr: 'مشروع Rust', nameEn: 'Rust Project', icon: 'ShieldAlert' },
];

export function generateBuildSpecs(projectName: string, prompt: string, type: string, lang: 'ar' | 'en'): BuildSpecs {
  const isAr = lang === 'ar';
  const cleanName = projectName || (isAr ? 'مشروع مخصص' : 'Custom Project');
  const cleanPrompt = prompt || (isAr ? 'تطبيق تفاعلي ذكي' : 'Interactive smart application');

  // Customize database engine based on project type
  let dbEngine = 'SQLite';
  if (['django', 'laravel', 'fastapi', 'management', 'ecommerce', 'api'].includes(type)) {
    dbEngine = 'PostgreSQL';
  } else if (['android', 'ios', 'flutter', 'react_native'].includes(type)) {
    dbEngine = 'Room DB / SQLite';
  } else if (['rust', 'go', 'cpp', 'game'].includes(type)) {
    dbEngine = 'Embedded LevelDB / FlatBuffers';
  } else if (['nodejs', 'react', 'vue', 'angular'].includes(type)) {
    dbEngine = 'MongoDB / Document Store';
  }

  // Customize visual palette
  let primaryColor = '#4f46e5'; // Indigo
  let secondaryColor = '#0f172a'; // Dark slate
  let accentColor = '#10b981'; // Emerald

  if (type === 'android') {
    primaryColor = '#3ddc84'; // Android Green
  } else if (type === 'ios') {
    primaryColor = '#007aff'; // Apple Blue
  } else if (type === 'game') {
    primaryColor = '#f43f5e'; // Rose pink
    accentColor = '#f59e0b'; // Amber
  } else if (type === 'laravel' || type === 'rust') {
    primaryColor = '#ef4444'; // Red
  } else if (type === 'django') {
    primaryColor = '#092e20'; // Django Forest Green
  } else if (type === 'python') {
    primaryColor = '#306998'; // Python blue
    accentColor = '#ffd43b'; // Python yellow
  }

  // File structure generator based on type
  const files: BuildSpecs['fileTree'] = [];
  if (['android', 'flutter', 'react_native', 'ios'].includes(type)) {
    files.push(
      { path: 'src/', type: 'folder', desc: isAr ? 'مجلد الأكواد البرمجية الرئيسي' : 'Main source folder' },
      { path: 'src/components/', type: 'folder', desc: isAr ? 'مكونات الواجهة التفاعلية' : 'UI component widgets' },
      { path: type === 'flutter' ? 'lib/main.dart' : 'src/App.tsx', type: 'file', size: '4.2 KB', desc: isAr ? 'نقطة انطلاق التطبيق للموبايل' : 'Main mobile entry point file' },
      { path: 'assets/images/', type: 'folder', desc: isAr ? 'أيقونات وصور التطبيق' : 'Application images and assets' },
      { path: 'database/schema.sql', type: 'file', size: '2.1 KB', desc: isAr ? 'تخطيط الهياكل المحلية' : 'Local schema layout SQLite' },
      { path: type === 'android' ? 'build.gradle' : 'package.json', type: 'file', size: '1.8 KB', desc: isAr ? 'ملف إدارة المكتبات والاعتماديات' : 'Dependency manager configuration' },
      { path: 'README.md', type: 'file', size: '3.0 KB', desc: isAr ? 'دليل تشغيل التطبيق وتثبيته' : 'Instructions & setup guide' },
      { path: 'LICENSE', type: 'file', size: '1.1 KB', desc: isAr ? 'ملف ترخيص المشروع مفتوح المصدر' : 'Open-source MIT license' },
      { path: 'CHANGELOG.md', type: 'file', size: '1.4 KB', desc: isAr ? 'سجل التغييرات والإصدارات' : 'Release changelog notes' }
    );
  } else if (['python', 'fastapi', 'django'].includes(type)) {
    files.push(
      { path: 'app/', type: 'folder', desc: isAr ? 'الخادم البرمجي الأساسي' : 'Core API application folder' },
      { path: 'app/models.py', type: 'file', size: '3.5 KB', desc: isAr ? 'جداول قاعدة البيانات والـ ORM' : 'Database tables & ORM structures' },
      { path: 'app/routes.py', type: 'file', size: '5.2 KB', desc: isAr ? 'مسارات وواجهات الـ APIs التفاعلية' : 'Core API router and query endpoints' },
      { path: 'requirements.txt', type: 'file', size: '540 B', desc: isAr ? 'حزم بايثون الأساسية المطلوبة' : 'Required Python packages list' },
      { path: 'main.py', type: 'file', size: '1.5 KB', desc: isAr ? 'ملف تشغيل الخادم والبدء' : 'Main execution script entrypoint' },
      { path: 'README.md', type: 'file', size: '2.5 KB', desc: isAr ? 'شرح المكونات وتشغيل الخادم' : 'Application execution handbook' },
      { path: 'LICENSE', type: 'file', size: '1.1 KB', desc: isAr ? 'ترخيص الاستخدام' : 'MIT License text' },
      { path: 'CHANGELOG.md', type: 'file', size: '890 B', desc: isAr ? 'تطورات التطبيق' : 'System updates ledger' }
    );
  } else if (['rust', 'go', 'cpp'].includes(type)) {
    files.push(
      { path: 'src/', type: 'folder', desc: isAr ? 'ملفات الكود المصدرية المحوسبة' : 'Main source code directory' },
      { path: type === 'rust' ? 'src/main.rs' : type === 'go' ? 'main.go' : 'src/main.cpp', type: 'file', size: '6.1 KB', desc: isAr ? 'الكود الأساسي للنظام' : 'Main entry point execution' },
      { path: type === 'rust' ? 'Cargo.toml' : 'go.mod', type: 'file', size: '1.2 KB', desc: isAr ? 'إدارة حزم النظام والمجمع' : 'Build compiler dependency sheet' },
      { path: 'tests/', type: 'folder', desc: isAr ? 'حزمة اختبارات الكود التلقائية' : 'Automated software integration tests' },
      { path: 'README.md', type: 'file', size: '3.1 KB', desc: isAr ? 'دليل التجميع والبناء للتشغيل' : 'How to compile & deploy guide' },
      { path: 'LICENSE', type: 'file', size: '1.1 KB', desc: isAr ? 'ملف ترخيص المشروع' : 'Project MIT license' },
      { path: 'CHANGELOG.md', type: 'file', size: '750 B', desc: isAr ? 'سجل الإصدارات' : 'System release changelog' }
    );
  } else {
    // Default Web (React, Vue, Website, Laravel, PHP, nodejs, etc)
    files.push(
      { path: 'index.html', type: 'file', size: '12.5 KB', desc: isAr ? 'صفحة المدخل والتخطيط الرئيسي' : 'Main index template layout' },
      { path: 'src/App.tsx', type: 'file', size: '8.4 KB', desc: isAr ? 'المنطق الأساسي والواجهات الرسومية' : 'Primary React state manager view' },
      { path: 'src/components/', type: 'folder', desc: isAr ? 'مكونات الصفحة والبطاقات التفاعلية' : 'Reusable interface components' },
      { path: 'src/index.css', type: 'file', size: '1.5 KB', desc: isAr ? 'تنسيقات Tailwind CSS الشاملة' : 'Global stylesheet imports' },
      { path: 'package.json', type: 'file', size: '1.1 KB', desc: isAr ? 'إدارة الحزم والتبعيات والمكتبات' : 'Dependency manager metadata' },
      { path: 'README.md', type: 'file', size: '4.0 KB', desc: isAr ? 'شرح تشغيل المشروع وتفعيله' : 'Project standard README setup guide' },
      { path: 'LICENSE', type: 'file', size: '1.1 KB', desc: isAr ? 'ملف ترخيص الحقوق' : 'MIT License text' },
      { path: 'CHANGELOG.md', type: 'file', size: '1.2 KB', desc: isAr ? 'تفاصيل الإصدار والمراحل' : 'Standard project release changelog' }
    );
  }

  // Dynamic Screens based on cleanPrompt/cleanName
  const screens: BuildSpecs['screens'] = [
    {
      name: isAr ? 'شاشة الترحيب وتسجيل الدخول' : 'Welcome & Login Screen',
      description: isAr 
        ? `شاشة بداية عصرية تحتوي على ترحيب مخصص لـ "${cleanName}" وتدعم المصادقة الآمنة.`
        : `Modern entry layout showcasing branding for "${cleanName}" with secure user login portals.`,
      navigation: isAr ? 'ينقل المستخدم إلى لوحة التحكم الرئيسية بعد التحقق.' : 'Navigates verified users directly to the dashboard.'
    },
    {
      name: isAr ? 'اللوحة الرئيسية والمؤشرات' : 'Main Dashboard & Insights',
      description: isAr
        ? `الواجهة المركزية وتضم ملخص أداء النظام لـ "${cleanPrompt}" مع بطاقات تفاعلية ورسوم بيانية.`
        : `Central control hub displaying metrics of "${cleanPrompt}" using responsive cards & charts.`,
      navigation: isAr ? 'يحتوي على شريط تنقل جانبي لكافة تفاصيل الصفحات الفرعية.' : 'Contains global navigation rails pointing to all secondary modules.'
    },
    {
      name: isAr ? 'صفحة إدارة البيانات والعناصر' : 'Items & Records Management',
      description: isAr
        ? `جدول ذكي يدعم العمليات الأساسية (إضافة، تعديل، حذف، بحث، تصفية) للبيانات الحية.`
        : `Sleek database explorer enabling real-time CRUD operations (add, edit, delete, search).`,
      navigation: isAr ? 'يسمح بفتح تفاصيل أي عنصر بداخل مودال تفاعلي.' : 'Opens interactive overlay view when any record item is selected.'
    },
    {
      name: isAr ? 'إعدادات النظام وإدارة المفاتيح' : 'System Settings & Keys Management',
      description: isAr
        ? 'لوحة كاملة للتحكم بإعدادات الملف الشخصي، تغيير السمة (فاتح/داكن)، ومفاتيح الربط البرمجي.'
        : 'Dedicated panel for profile editing, visual theme toggle (Light/Dark), and backend integration keys.',
      navigation: isAr ? 'يمكن للمسؤول استعادة حالة المصنع أو تصدير التقارير.' : 'Provides options to reset database states or download general logs.'
    }
  ];

  // Database Schema Columns list
  const tables: BuildSpecs['database']['tables'] = [
    {
      name: 'users',
      columns: ['id (UUID)', 'email (VARCHAR)', 'password_hash (TEXT)', 'full_name (VARCHAR)', 'role (VARCHAR)', 'created_at (TIMESTAMP)'],
      rowsCount: 3
    },
    {
      name: type === 'ecommerce' ? 'products' : type === 'game' ? 'game_saves' : 'records',
      columns: type === 'ecommerce' 
        ? ['id (INT)', 'title (VARCHAR)', 'description (TEXT)', 'price (DECIMAL)', 'stock (INT)', 'image_url (TEXT)']
        : type === 'game'
        ? ['id (INT)', 'player_id (UUID)', 'score (INT)', 'level (INT)', 'inventory (JSON)', 'saved_at (TIMESTAMP)']
        : ['id (UUID)', 'title (VARCHAR)', 'content (TEXT)', 'status (VARCHAR)', 'category (VARCHAR)', 'updated_at (TIMESTAMP)'],
      rowsCount: 25
    },
    {
      name: type === 'ecommerce' ? 'orders' : 'audit_logs',
      columns: type === 'ecommerce'
        ? ['id (UUID)', 'customer_id (UUID)', 'total_amount (DECIMAL)', 'payment_status (VARCHAR)', 'shipping_address (TEXT)', 'ordered_at (TIMESTAMP)']
        : ['id (INT)', 'user_id (UUID)', 'action (VARCHAR)', 'ip_address (VARCHAR)', 'performed_at (TIMESTAMP)'],
      rowsCount: 154
    }
  ];

  // API Endpoints list
  const apis: BuildSpecs['apis'] = [
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      desc: isAr ? 'التحقق من بيانات المستخدم وتوليد رمز الوصول' : 'Verifies credentials and generates JWT session tokens',
      response: '{ "token": "eyJhbGciOi...", "user": { "id": "u1", "email": "admin@x.ai" } }'
    },
    {
      method: 'GET',
      path: type === 'ecommerce' ? '/api/v1/products' : '/api/v1/records',
      desc: isAr ? 'استرجاع جميع العناصر مع إمكانية البحث والتصفية' : 'Retrieves all items supporting search, pagination, and filters',
      response: '{ "count": 25, "items": [...] }'
    },
    {
      method: 'POST',
      path: type === 'ecommerce' ? '/api/v1/products' : '/api/v1/records',
      desc: isAr ? 'إنشاء سجل أو عنصر جديد بداخل قاعدة البيانات' : 'Creates and inserts a new document/record in storage',
      response: '{ "success": true, "insertedId": "rec_9821" }'
    },
    {
      method: 'DELETE',
      path: type === 'ecommerce' ? '/api/v1/products/:id' : '/api/v1/records/:id',
      desc: isAr ? 'حذف عنصر معين نهائياً بعد التحقق من الصلاحيات' : 'Permanently deletes specific resource from database storage',
      response: '{ "success": true, "message": "Item deleted" }'
    }
  ];

  // Dynamic workflows
  const workflow: string[] = isAr 
    ? [
        'تهيئة النظام: قراءة المتغيرات البيئية وبدء محرك قاعدة البيانات ' + dbEngine + '.',
        'المصادقة: يدخل المستخدم بريده الإلكتروني، فيقوم النظام بمقارنة التوقيع الرقمي الآمن وتوفير جلسة مشفرة.',
        'تحميل البيانات: يستدعي التطبيق واجهات الـ APIs لاسترجاع العناصر وعرض المؤشرات التفاعلية في لوحة المبيعات أو الإحصائيات.',
        'التحكم الحي: يمكن للمستخدم تشغيل واجهات الإضافة والحذف والمزامنة مع تحديث الرسوم البيانية فورياً عبر المحاكاة السحابية.',
        'التخزين الاحتياطي: يتم الاحتفاظ بكامل التعديلات بداخل ' + dbEngine + ' بشكل دائم مع إمكانية التصدير بصيغة ZIP.'
      ]
    : [
        'Booting sequence: Reading environment credentials and spawning ' + dbEngine + ' database cluster.',
        'User authentication: Validating credentials and securing API requests using structured authentication headers.',
        'Data syncing: Client sends GET requests to fetch metrics and load charts inside the interactive viewport.',
        'Real-time operations: Running CRUD triggers on components with immediate changes reflected in dashboard state.',
        'Backup & Export: Compiling project tree with persistent databases into ZIP, ready for production deployment.'
      ];

  return {
    screens,
    design: {
      colors: [
        { name: isAr ? 'اللون الأساسي' : 'Primary Color', hex: primaryColor, role: isAr ? 'العلامة التجارية والأزرار الهامة' : 'Branding, primary actions, active items' },
        { name: isAr ? 'اللون الخلفي' : 'Background Canvas', hex: secondaryColor, role: isAr ? 'شاشات العرض والبطاقات' : 'Durable background structure' },
        { name: isAr ? 'اللون الثانوي/التأكيدي' : 'Accent Color', hex: accentColor, role: isAr ? 'مؤشرات النجاح والعمليات المكتملة' : 'Success alerts, metrics progress highlights' }
      ],
      fontSans: isAr ? 'Cairo (sans-serif)' : 'Inter (sans-serif)',
      fontMono: 'JetBrains Mono (monospace)',
      icons: 'Lucide Developer Icons'
    },
    fileTree: files,
    database: {
      engine: dbEngine,
      tables
    },
    apis,
    workflow
  };
}
