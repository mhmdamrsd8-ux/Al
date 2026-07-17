import { Project } from '../types';

export const TEMPLATES: Project[] = [
  {
    id: 'ecommerce',
    name: 'لوحة تحكم مبيعات ذكية',
    description: 'لوحة تحكم تفاعلية للمبيعات والمنتجات والعملاء مع مخططات بيانية وتحليلات دقيقة.',
    createdAt: new Date().toISOString(),
    activeFile: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة مبيعات X AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-slate-950 border-l border-slate-800 flex flex-col justify-between p-4 hidden md:flex">
            <div>
                <div class="flex items-center gap-3 px-2 py-3 border-b border-slate-800 mb-6">
                    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <i data-lucide="activity" class="w-5 h-5 text-white"></i>
                    </div>
                    <span class="font-bold text-lg text-white">X مبيعات</span>
                </div>
                <nav class="space-y-1">
                    <a href="#" onclick="switchTab('dashboard')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white font-medium">
                        <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                        <span>الرئيسية</span>
                    </a>
                    <a href="#" onclick="switchTab('products')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
                        <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                        <span>المنتجات</span>
                    </a>
                    <a href="#" onclick="switchTab('customers')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
                        <i data-lucide="users" class="w-5 h-5"></i>
                        <span>العملاء</span>
                    </a>
                    <a href="#" onclick="switchTab('settings')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
                        <i data-lucide="settings" class="w-5 h-5"></i>
                        <span>الإعدادات</span>
                    </a>
                </nav>
            </div>
            <div class="p-2 border-t border-slate-800 flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400">م</div>
                <div>
                    <h4 class="text-xs font-semibold text-white">محمد عمر</h4>
                    <p class="text-[10px] text-slate-500">مسؤول النظام</p>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8">
            <!-- Header -->
            <header class="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                <div>
                    <h1 class="text-2xl font-bold text-white" id="page-title">لوحة التحليلات والمبيعات</h1>
                    <p class="text-sm text-slate-400 mt-1">مرحباً بك مجدداً! إليك نظرة سريعة على أداء متجرك اليوم.</p>
                </div>
                <button onclick="addSale()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    <span>عملية بيع جديدة</span>
                </button>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-medium text-slate-400">إجمالي الإيرادات</p>
                            <h3 class="text-2xl font-bold text-white mt-2" id="stat-revenue">$124,500</h3>
                        </div>
                        <div class="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                            <i data-lucide="dollar-sign" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        <span>+12.5% من الشهر الماضي</span>
                    </div>
                </div>

                <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-medium text-slate-400">المبيعات المكتملة</p>
                            <h3 class="text-2xl font-bold text-white mt-2" id="stat-sales">845</h3>
                        </div>
                        <div class="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        <span>+8.2% من الأسبوع الماضي</span>
                    </div>
                </div>

                <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-medium text-slate-400">العملاء الجدد</p>
                            <h3 class="text-2xl font-bold text-white mt-2" id="stat-customers">142</h3>
                        </div>
                        <div class="p-2.5 bg-violet-500/10 text-violet-400 rounded-lg">
                            <i data-lucide="user-plus" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                        <i data-lucide="arrow-down-right" class="w-4 h-4"></i>
                        <span>-2.1% من أمس</span>
                    </div>
                </div>

                <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-medium text-slate-400">معدل التحويل</p>
                            <h3 class="text-2xl font-bold text-white mt-2">4.8%</h3>
                        </div>
                        <div class="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                            <i data-lucide="percent" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        <span>+0.6% زيادة اليوم</span>
                    </div>
                </div>
            </div>

            <!-- Recent Transactions & Product Performance -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Sales List -->
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 class="text-lg font-bold text-white mb-4">آخر العمليات المستلمة</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-right">
                            <thead>
                                <tr class="text-slate-500 border-b border-slate-800 text-xs">
                                    <th class="pb-3">العميل</th>
                                    <th class="pb-3">المنتج</th>
                                    <th class="pb-3">الحالة</th>
                                    <th class="pb-3">القيمة</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-slate-900" id="sales-table">
                                <tr class="text-slate-300">
                                    <td class="py-3.5 flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-xs">أ</div>
                                        <span>أحمد الغامدي</span>
                                    </td>
                                    <td class="py-3.5">ساعة ذكية برو</td>
                                    <td class="py-3.5"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">مكتمل</span></td>
                                    <td class="py-3.5 font-bold text-white">$299.00</td>
                                </tr>
                                <tr class="text-slate-300">
                                    <td class="py-3.5 flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-purple-400 text-xs">س</div>
                                        <span>سارة العتيبي</span>
                                    </td>
                                    <td class="py-3.5">سماعات لاسلكية x3</td>
                                    <td class="py-3.5"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">مكتمل</span></td>
                                    <td class="py-3.5 font-bold text-white">$149.00</td>
                                </tr>
                                <tr class="text-slate-300">
                                    <td class="py-3.5 flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs">خ</div>
                                        <span>خالد الحربي</span>
                                    </td>
                                    <td class="py-3.5">شاحن مغناطيسي سريع</td>
                                    <td class="py-3.5"><span class="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs">قيد المراجعة</span></td>
                                    <td class="py-3.5 font-bold text-white">$45.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Simple Sidebar Panel -->
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-white mb-4">المنتجات الأكثر مبيعاً</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center p-3 rounded-lg bg-slate-900">
                            <div>
                                <h4 class="font-semibold text-sm">ساعة ذكية برو</h4>
                                <p class="text-xs text-slate-500 mt-0.5">142 عملية بيع</p>
                            </div>
                            <span class="text-blue-400 font-bold">$42,458</span>
                        </div>
                        <div class="flex justify-between items-center p-3 rounded-lg bg-slate-900">
                            <div>
                                <h4 class="font-semibold text-sm">سماعات لاسلكية x3</h4>
                                <p class="text-xs text-slate-500 mt-0.5">98 عملية بيع</p>
                            </div>
                            <span class="text-emerald-400 font-bold">$14,602</span>
                        </div>
                        <div class="flex justify-between items-center p-3 rounded-lg bg-slate-900">
                            <div>
                                <h4 class="font-semibold text-sm">لوحة مفاتيح ميكانيكية</h4>
                                <p class="text-xs text-slate-500 mt-0.5">75 عملية بيع</p>
                            </div>
                            <span class="text-violet-400 font-bold">$9,375</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        lucide.createIcons();

        let totalRevenue = 124500;
        let totalSales = 845;
        let totalCustomers = 142;

        function addSale() {
            const customerName = prompt("أدخل اسم العميل:");
            if (!customerName) return;
            const productName = prompt("أدخل اسم المنتج:", "هاتف ذكي بلس");
            const price = parseFloat(prompt("أدخل السعر بالدولار:", "599"));
            if (isNaN(price)) return;

            // Update stats
            totalRevenue += price;
            totalSales += 1;
            totalCustomers += 1;

            document.getElementById('stat-revenue').innerText = '$' + totalRevenue.toLocaleString();
            document.getElementById('stat-sales').innerText = totalSales.toLocaleString();
            document.getElementById('stat-customers').innerText = totalCustomers.toLocaleString();

            // Insert Table Row
            const table = document.getElementById('sales-table');
            const newRow = document.createElement('tr');
            newRow.className = 'text-slate-300 border-t border-slate-900';
            newRow.innerHTML = \`
                <td class="py-3.5 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-xs">\${customerName[0] || 'ج'}</div>
                    <span>\${customerName}</span>
                </td>
                <td class="py-3.5">\${productName}</td>
                <td class="py-3.5"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">مكتمل</span></td>
                <td class="py-3.5 font-bold text-white">\$\${price.toFixed(2)}</td>
            \`;
            table.insertBefore(newRow, table.firstChild);
            alert("تم تسجيل عملية البيع بنجاح وتحديث لوحة التحكم!");
        }

        function switchTab(tab) {
            const title = document.getElementById('page-title');
            if (tab === 'dashboard') {
                title.innerText = 'لوحة التحليلات والمبيعات';
            } else if (tab === 'products') {
                title.innerText = 'إدارة المنتجات';
            } else if (tab === 'customers') {
                title.innerText = 'سجلات العملاء والمشترين';
            } else if (tab === 'settings') {
                title.innerText = 'إعدادات النظام والمنصة';
            }
        }
    </script>
</body>
</html>`,
      'README.md': `# لوحة تحكم مبيعات ذكية
تطبيق ويب متكامل مصمم بأحدث التقنيات وأسلوب رائع لعرض المبيعات والإيرادات اليومية وتعديل البيانات بشكل فوري وتفاعلي بالكامل.

## الميزات:
- تصميم RTL بالكامل مخصص للغة العربية
- واجهة تفاعلية لتسجيل المبيعات المباشرة وتحديث الإحصائيات فوراً
- تصميم متجاوب لجميع الهواتف والأجهزة اللوحية والكمبيوتر
`
    }
  },
  {
    id: 'kanban',
    name: 'تطبيق تعقب المهام الذكي',
    description: 'تطبيق إدارة وتتبع المهام بنظام بطاقات كأنبان، السحب والإفلات، وإضافة المهام حسب الأولوية.',
    createdAt: new Date().toISOString(),
    activeFile: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تعقب المهام الذكي</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-[#0b0f19] text-slate-100 min-h-screen p-6 md:p-8">
    <!-- Navbar -->
    <header class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <i data-lucide="check-square" class="w-6 h-6 text-white"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold text-white">نظام كأنبان المهام</h1>
                <p class="text-xs text-slate-400">إدارة مشاريعك وزيادة إنتاجية فريق عملك.</p>
            </div>
        </div>
        <button onclick="openAddTaskModal()" class="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 transition duration-200">
            <i data-lucide="plus" class="w-5 h-5"></i>
            <span>إضافة مهمة جديدة</span>
        </button>
    </header>

    <!-- Boards Container -->
    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Todo Column -->
        <div class="bg-[#121826] border border-slate-800 rounded-xl p-4 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <h3 class="font-bold text-sm">بانتظار العمل</h3>
                </div>
                <span id="todo-count" class="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-full font-semibold">2</span>
            </div>
            <div id="todo-list" class="space-y-3 flex-1">
                <!-- Task 1 -->
                <div class="bg-[#161f32] border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition cursor-pointer group" onclick="moveTask(this, 'doing')">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">تصميم الواجهة</span>
                    <h4 class="font-semibold text-sm text-white mt-2 group-hover:text-blue-400 transition">بناء واجهة لوحة تحكم X AI</h4>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2">تصميم ملفات الاستايل ومفاتيح التنقل في الصفحة الرئيسية وتوفير الوضع الداكن.</p>
                    <div class="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-2 text-xs text-slate-500">
                        <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 18 يوليو</span>
                        <span class="flex items-center gap-1 text-blue-400"><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i> نقل للبدء</span>
                    </div>
                </div>
                <!-- Task 2 -->
                <div class="bg-[#161f32] border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition cursor-pointer group" onclick="moveTask(this, 'doing')">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-500/10 text-violet-400">تطوير خادم</span>
                    <h4 class="font-semibold text-sm text-white mt-2 group-hover:text-blue-400 transition">إنشاء راوت API الخاص بـ Gemini</h4>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2">بناء حلقة الربط وتمرير الرسائل وتوليد الكود عبر الخادم بشكل آمن.</p>
                    <div class="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-2 text-xs text-slate-500">
                        <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> 20 يوليو</span>
                        <span class="flex items-center gap-1 text-blue-400"><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i> نقل للبدء</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- In Progress Column -->
        <div class="bg-[#121826] border border-slate-800 rounded-xl p-4 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h3 class="font-bold text-sm">قيد التنفيذ</h3>
                </div>
                <span id="doing-count" class="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-full font-semibold">1</span>
            </div>
            <div id="doing-list" class="space-y-3 flex-1">
                <!-- Task 3 -->
                <div class="bg-[#161f32] border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition cursor-pointer group" onclick="moveTask(this, 'done')">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">قيد البرمجة</span>
                    <h4 class="font-semibold text-sm text-white mt-2 group-hover:text-amber-400 transition">كتابة معالج مستكشف الملفات</h4>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2">تطوير مكون الشجرة الجانبي لعرض قائمة الملفات المصدرية ودعم الفئات المخصصة.</p>
                    <div class="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-2 text-xs text-slate-500">
                        <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> اليوم</span>
                        <span class="flex items-center gap-1 text-emerald-400"><i data-lucide="check" class="w-3.5 h-3.5"></i> نقل للمكتملة</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Done Column -->
        <div class="bg-[#121826] border border-slate-800 rounded-xl p-4 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 class="font-bold text-sm">المكتملة</h3>
                </div>
                <span id="done-count" class="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-full font-semibold">1</span>
            </div>
            <div id="done-list" class="space-y-3 flex-1">
                <!-- Task 4 -->
                <div class="bg-[#161f32] border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition cursor-pointer group opacity-75" onclick="deleteTask(this)">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">جاهز للتنفيذ</span>
                    <h4 class="font-semibold text-sm text-slate-300 mt-2 line-through">تثبيت باقات npm والبدء</h4>
                    <p class="text-xs text-slate-500 mt-1 line-clamp-2">تأكيد حزم tailwind و lucide-react وإتاحة البدء مباشرة للتطبيق الرسومي.</p>
                    <div class="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-2 text-xs text-slate-500">
                        <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> أمس</span>
                        <span class="text-rose-400 hover:underline"><i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i> حذف</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        lucide.createIcons();

        function moveTask(taskEl, targetColumnId) {
            const currentList = taskEl.parentElement;
            const targetList = document.getElementById(targetColumnId + '-list');

            if (targetColumnId === 'doing') {
                taskEl.setAttribute('onclick', "moveTask(this, 'done')");
                taskEl.querySelector('.text-slate-500:last-child').innerHTML = '<span class="flex items-center gap-1 text-emerald-400"><i data-lucide="check" class="w-3.5 h-3.5"></i> نقل للمكتملة</span>';
            } else if (targetColumnId === 'done') {
                taskEl.setAttribute('onclick', "deleteTask(this)");
                taskEl.classList.add('opacity-75');
                const title = taskEl.querySelector('h4');
                title.classList.add('line-through');
                title.classList.remove('group-hover:text-blue-400', 'group-hover:text-amber-400');
                taskEl.querySelector('.text-slate-500:last-child').innerHTML = '<span class="text-rose-400 hover:underline"><i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i> حذف</span>';
            }

            targetList.appendChild(taskEl);
            updateCounts();
            lucide.createIcons();
        }

        function deleteTask(taskEl) {
            if (confirm("هل تريد بالتأكيد حذف هذه المهمة بالكامل؟")) {
                taskEl.remove();
                updateCounts();
            }
        }

        function openAddTaskModal() {
            const taskTitle = prompt("أدخل عنوان المهمة الجديدة:");
            if (!taskTitle) return;
            const taskDesc = prompt("أدخل تفاصيل المهمة:", "تفاصيل العمل المطلوبة لتنفيذ المهمة...");
            const taskTag = prompt("تصنيف المهمة (مثال: واجهة، برمجة، خادم):", "عام");

            const todoList = document.getElementById('todo-list');
            const newTask = document.createElement('div');
            newTask.className = 'bg-[#161f32] border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition cursor-pointer group';
            newTask.setAttribute('onclick', "moveTask(this, 'doing')");
            newTask.innerHTML = \`
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">\${taskTag}</span>
                <h4 class="font-semibold text-sm text-white mt-2 group-hover:text-blue-400 transition">\${taskTitle}</h4>
                <p class="text-xs text-slate-400 mt-1 line-clamp-2">\${taskDesc}</p>
                <div class="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-2 text-xs text-slate-500">
                    <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> اليوم</span>
                    <span class="flex items-center gap-1 text-blue-400"><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i> نقل للبدء</span>
                </div>
            \`;
            todoList.insertBefore(newTask, todoList.firstChild);
            updateCounts();
            lucide.createIcons();
        }

        function updateCounts() {
            document.getElementById('todo-count').innerText = document.getElementById('todo-list').children.length;
            document.getElementById('doing-count').innerText = document.getElementById('doing-list').children.length;
            document.getElementById('done-count').innerText = document.getElementById('done-list').children.length;
        }
    </script>
</body>
</html>`,
      'README.md': `# تعقب المهام بنظام Kanban
لوحة عمل رشيقة ومبسطة تساعد المطورين والفرق على فرز مهام العمل بشكل فوري وبسيط.

## الميزات:
- نقل المهام بين الأعمدة (جديد، قيد العمل، منجز) بنقرة واحدة
- إمكانية إضافة وحذف مهام جديدة بشكل ديناميكي كامل
- الرموز والتنسيقات الحديثة المستندة لمكتبة Lucide و Tailwind CSS
`
    }
  }
];
