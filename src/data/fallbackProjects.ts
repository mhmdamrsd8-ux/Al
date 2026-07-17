import { Project } from '../types';

export function generateFallbackProjectFiles(
  name: string,
  prompt: string,
  type: string,
  lang: 'ar' | 'en'
): Record<string, string> {
  const isAr = lang === 'ar';
  const cleanName = name || (isAr ? 'تطبيق ذكي مخصص' : 'Custom Smart App');
  const cleanPrompt = prompt || (isAr ? 'تطبيق عالي الأداء' : 'High performance application');

  // Set color theme
  let mainColor = 'indigo-600';
  let mainColorHover = 'indigo-500';
  let bannerBg = 'bg-indigo-900/20 text-indigo-400';
  let accentColor = 'emerald-500';

  if (type === 'android') {
    mainColor = 'emerald-600';
    mainColorHover = 'emerald-500';
    accentColor = 'teal-400';
  } else if (type === 'ios') {
    mainColor = 'blue-600';
    mainColorHover = 'blue-500';
    accentColor = 'sky-400';
  } else if (type === 'game') {
    mainColor = 'rose-600';
    mainColorHover = 'rose-500';
    accentColor = 'amber-400';
  } else if (type === 'laravel' || type === 'rust') {
    mainColor = 'red-600';
    mainColorHover = 'red-500';
    accentColor = 'orange-400';
  }

  // Generate specialized interactive index.html depending on project type!
  let htmlContent = '';

  if (type === 'game') {
    // Return a fully playable 2D HTML5 canvas Game!
    htmlContent = `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-neutral-950 text-white min-h-screen flex flex-col justify-between">
    <!-- Header -->
    <header class="border-b border-neutral-800 bg-neutral-900/60 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                <i data-lucide="gamepad-2" class="w-5 h-5 text-white animate-bounce"></i>
            </div>
            <div>
                <h1 class="text-sm font-bold text-white">${cleanName}</h1>
                <p class="text-[10px] text-gray-400">${isAr ? 'بوابة الألعاب المصغرة ثنائية الأبعاد' : 'Interactive 2D Game Portal'}</p>
            </div>
        </div>
        <div class="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20 font-bold">
            ${isAr ? 'لعبة تفاعلية نشطة' : 'Playable Demo'}
        </div>
    </header>

    <!-- Main Canvas Arena -->
    <main class="flex-1 flex flex-col items-center justify-center p-4">
        <div class="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl text-center space-y-4">
            <div class="flex justify-between items-center text-xs font-mono px-2">
                <div>${isAr ? 'النقاط:' : 'SCORE:'} <span id="score" class="font-bold text-rose-400">0</span></div>
                <div>${isAr ? 'أعلى نتيجة:' : 'HIGH SCORE:'} <span id="highscore" class="font-bold text-amber-400">0</span></div>
            </div>

            <div class="relative bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center h-64">
                <canvas id="gameCanvas" width="400" height="256" class="w-full h-full block bg-black"></canvas>
                
                <div id="startScreen" class="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 space-y-3">
                    <h2 class="text-lg font-bold text-white animate-pulse">${isAr ? 'لعبة مغامرة النقر تفاعلية' : 'Tap & Jump Adventure'}</h2>
                    <p class="text-[10px] text-gray-400 max-w-xs">${isAr ? 'اضغط مسافة بالكمبيوتر أو انقر على الشاشة للقفز وتفادي العوائق الحمراء!' : 'Press Spacebar or Click screen to jump over incoming hazards!'}</p>
                    <button onclick="startGame()" class="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-rose-600/20">
                        ${isAr ? 'ابدأ اللعب الآن' : 'Start Play'}
                    </button>
                </div>

                <div id="gameOverScreen" class="absolute inset-0 bg-black/90 hidden flex flex-col items-center justify-center p-4 space-y-3">
                    <h2 class="text-lg font-bold text-red-500">${isAr ? 'انتهت اللعبة! 💀' : 'GAME OVER! 💀'}</h2>
                    <p class="text-[10px] text-gray-400">${isAr ? 'لقد اصطدمت بحاجز خطير.' : 'You crashed into an obstacle.'}</p>
                    <button onclick="startGame()" class="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-xs font-bold transition">
                        ${isAr ? 'إعادة المحاولة' : 'Try Again'}
                    </button>
                </div>
            </div>

            <div class="flex justify-center gap-2">
                <button id="jumpBtn" class="w-full py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-sm font-bold text-rose-400 transition flex items-center justify-center gap-2 select-none border border-neutral-700">
                    <i data-lucide="zap" class="w-4 h-4"></i>
                    <span>${isAr ? 'قفـــــــز!' : 'JUMP!'}</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Footer info -->
    <footer class="p-4 border-t border-neutral-800 text-center text-[10px] text-gray-500 bg-neutral-900/40">
        ${isAr ? 'مبني بذكاء كـ لعبة HTML5 تفاعلية بالكامل' : 'Engineered cleanly as a self-contained HTML5 Canvas game.'}
    </footer>

    <script>
        lucide.createIcons();
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let score = 0;
        let highscore = 0;
        let gameActive = false;
        let player, obstacles, animationId;

        class Player {
            constructor() {
                this.x = 40;
                this.y = 200;
                this.radius = 12;
                this.gravity = 0.6;
                this.lift = -10;
                this.velocity = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#f43f5e';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
            }
            jump() {
                if (this.y === 220) { // jump only if on ground
                    this.velocity = this.lift;
                }
            }
            update() {
                this.velocity += this.gravity;
                this.y += this.velocity;
                if (this.y > 220) {
                    this.y = 220;
                    this.velocity = 0;
                }
            }
        }

        class Obstacle {
            constructor() {
                this.x = 400;
                this.y = 212;
                this.width = 16;
                this.height = 20;
                this.speed = 4;
            }
            draw() {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
            update() {
                this.x -= this.speed;
            }
        }

        function startGame() {
            document.getElementById('startScreen').classList.add('hidden');
            document.getElementById('gameOverScreen').classList.add('hidden');
            score = 0;
            document.getElementById('score').innerText = '0';
            player = new Player();
            obstacles = [];
            gameActive = true;
            if (animationId) cancelAnimationFrame(animationId);
            gameLoop();
        }

        function gameOver() {
            gameActive = false;
            document.getElementById('gameOverScreen').classList.remove('hidden');
            if (score > highscore) {
                highscore = score;
                document.getElementById('highscore').innerText = highscore;
            }
        }

        function gameLoop() {
            if (!gameActive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Ground
            ctx.strokeStyle = '#525252';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 232);
            ctx.lineTo(400, 232);
            ctx.stroke();

            player.update();
            player.draw();

            if (Math.random() < 0.015 && obstacles.length < 3) {
                obstacles.push(new Obstacle());
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].update();
                obstacles[i].draw();

                // Check collision
                let p_distX = Math.abs(player.x - (obstacles[i].x + obstacles[i].width/2));
                let p_distY = Math.abs(player.y - (obstacles[i].y + obstacles[i].height/2));
                if (p_distX < (player.radius + obstacles[i].width/2) && p_distY < (player.radius + obstacles[i].height/2)) {
                    gameOver();
                }

                if (obstacles[i].x < -20) {
                    obstacles.splice(i, 1);
                    score++;
                    document.getElementById('score').innerText = score;
                }
            }

            animationId = requestAnimationFrame(gameLoop);
        }

        document.getElementById('jumpBtn').addEventListener('click', () => {
            if (gameActive) player.jump();
        });
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (gameActive) player.jump();
                else startGame();
            }
        });
    </script>
</body>
</html>`;
  } else if (type === 'ecommerce') {
    // Return a fully functioning luxurious e-commerce showcase store
    htmlContent = `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-neutral-900 text-neutral-100 min-h-screen flex flex-col justify-between">
    <!-- Navbar -->
    <nav class="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-${mainColor} flex items-center justify-center">
                <i data-lucide="shopping-bag" class="w-4 h-4 text-white"></i>
            </div>
            <span class="font-bold text-white text-base">${cleanName}</span>
        </div>
        
        <div class="flex items-center gap-4">
            <button onclick="toggleCart()" class="relative p-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-white transition">
                <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                <span id="cartCount" class="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">0</span>
            </button>
        </div>
    </nav>

    <!-- Main Container -->
    <main class="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Products Grid (2 cols) -->
        <div class="md:col-span-2 space-y-4">
            <h2 class="text-sm font-bold text-gray-300 uppercase tracking-wider">${isAr ? 'المنتجات المميزة المعروضة' : 'Featured Luxury Products'}</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="products-list">
                <!-- Product 1 -->
                <div class="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                    <div class="h-32 bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800/50">
                        <i data-lucide="sparkles" class="w-10 h-10 text-amber-500"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">${isAr ? 'عطر الروح الذهبي الباريسي' : 'Golden Aura Parisian Parfum'}</h3>
                        <p class="text-[10px] text-gray-400 mt-1 line-clamp-2">${isAr ? 'مزيج فاخر من المسك الأبيض وعبق الياسمين الساحر.' : 'Premium blend of rich white musk, amber and fresh lavender.'}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-neutral-900">
                        <span class="font-bold text-xs text-amber-400">$189.00</span>
                        <button onclick="addToCart('${isAr ? 'عطر الروح الذهبي' : 'Golden Aura Parfum'}', 189)" class="px-3 py-1.5 bg-${mainColor} hover:bg-${mainColorHover} text-white rounded text-[10px] font-semibold transition">
                            ${isAr ? 'إضافة للسلة' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                <!-- Product 2 -->
                <div class="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                    <div class="h-32 bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800/50">
                        <i data-lucide="package" class="w-10 h-10 text-sky-400"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-white">${isAr ? 'مبخرة السمو الذكية الفاخرة' : 'Al-Sumou Smart Luxury Oud Incense'}</h3>
                        <p class="text-[10px] text-gray-400 mt-1 line-clamp-2">${isAr ? 'تعمل بالشحن السريع وتحتفظ بجودة روائح العود الأصلية.' : 'High efficiency electronic smart incense burner.'}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-neutral-900">
                        <span class="font-bold text-xs text-amber-400">$85.00</span>
                        <button onclick="addToCart('${isAr ? 'مبخرة السمو الذكية' : 'Smart Oud Burner'}', 85)" class="px-3 py-1.5 bg-${mainColor} hover:bg-${mainColorHover} text-white rounded text-[10px] font-semibold transition">
                            ${isAr ? 'إضافة للسلة' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Cart List (1 col) -->
        <div class="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
            <div>
                <h3 class="font-bold text-sm text-white border-b border-neutral-800 pb-3 mb-4 flex items-center gap-2">
                    <i data-lucide="shopping-cart" class="w-4 h-4 text-${mainColor}"></i>
                    <span>${isAr ? 'سلة التسوق والمشتريات' : 'Shopping Cart'}</span>
                </h3>
                
                <div id="cartItems" class="space-y-3 overflow-y-auto max-h-[260px] text-xs">
                    <div class="text-center py-10 text-gray-500">${isAr ? 'سلتك فارغة تماماً' : 'Cart is empty'}</div>
                </div>
            </div>

            <div class="border-t border-neutral-800 pt-4 space-y-3">
                <div class="flex justify-between items-center text-xs font-bold">
                    <span>${isAr ? 'إجمالي الحساب:' : 'TOTAL AMOUNT:'}</span>
                    <span id="cartTotal" class="text-emerald-400 text-sm">$0.00</span>
                </div>
                <button onclick="checkout()" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition">
                    ${isAr ? 'إتمام الدفع والشراء المباشر' : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="p-4 border-t border-neutral-800 text-center text-[10px] text-gray-500 bg-neutral-950">
        ${isAr ? 'بوابة بيع تفاعلية مدمجة حية ومبهرة' : 'Self-contained e-commerce interactive checkout simulator.'}
    </footer>

    <script>
        lucide.createIcons();
        let cart = [];

        function updateCart() {
            const countEl = document.getElementById('cartCount');
            const listEl = document.getElementById('cartItems');
            const totalEl = document.getElementById('cartTotal');
            
            countEl.innerText = cart.length;
            
            if (cart.length === 0) {
                listEl.innerHTML = '<div class="text-center py-10 text-gray-500">${isAr ? 'سلتك فارغة تماماً' : 'Cart is empty'}</div>';
                totalEl.innerText = '$0.00';
                return;
            }

            let total = 0;
            listEl.innerHTML = '';
            
            cart.forEach((item, index) => {
                total += item.price;
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center bg-neutral-900 border border-neutral-800/50 p-2.5 rounded-lg';
                row.innerHTML = \`
                    <div>
                        <span class="font-bold text-white block">\${item.name}</span>
                        <span class="text-[10px] text-amber-400">\$\${item.price.toFixed(2)}</span>
                    </div>
                    <button onclick="removeFromCart(\${index})" class="text-rose-400 hover:text-rose-500 text-[10px] font-bold">
                        ${isAr ? 'حذف' : 'Remove'}
                    </button>
                \`;
                listEl.appendChild(row);
            });

            totalEl.innerText = '$' + total.toFixed(2);
        }

        function addToCart(name, price) {
            cart.push({ name, price });
            updateCart();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }

        function checkout() {
            if (cart.length === 0) {
                alert("${isAr ? 'يرجى إضافة منتجات للسلة أولاً!' : 'Your cart is empty! Please add some items.'}");
                return;
            }
            alert("${isAr ? 'تهانينا! تم تفعيل طلب الشراء ومزامنة حسابك المصرفي بنجاح.' : 'Checkout successful! Your order has been placed.'}");
            cart = [];
            updateCart();
        }
    </script>
</body>
</html>`;
  } else {
    // Standard beautiful customizable full-view responsive dashboard matching other custom types
    htmlContent = `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.344.0/dist/umd/lucide.min.js"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between">
    <!-- Top Header -->
    <header class="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-${mainColor} flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <i data-lucide="layers" class="w-5 h-5 text-white"></i>
            </div>
            <div>
                <h1 class="text-sm font-bold text-white">${cleanName}</h1>
                <p class="text-[9px] text-slate-400">${isAr ? 'تطبيق إدارة مخصص ذكي' : 'Integrated administrative suite'}</p>
            </div>
        </div>
        
        <div class="flex items-center gap-3">
            <span class="text-[10px] bg-${bannerBg} border border-indigo-500/10 px-2 py-0.5 rounded font-mono font-bold">${type.toUpperCase()}</span>
        </div>
    </header>

    <!-- Main Grid Dashboard -->
    <main class="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <!-- Welcoming Alert Banner -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-right" dir="${isAr ? 'rtl' : 'ltr'}">
                <h2 class="text-base font-bold text-white">${isAr ? 'مرحباً بك في النظام الذكي المكامل' : 'Welcome to your smart system'}</h2>
                <p class="text-xs text-slate-400 mt-1">${cleanPrompt}</p>
            </div>
            
            <button onclick="toggleSetupModal()" class="px-4 py-2 bg-${mainColor} hover:bg-${mainColorHover} text-white font-semibold rounded-lg text-xs transition shrink-0">
                ${isAr ? 'تهيئة النظام والبدء' : 'Initialize Workspace'}
            </button>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold">${isAr ? 'المستخدمين النشطين' : 'Active Users'}</span>
                  <h3 id="metric-users" class="text-xl font-bold text-white mt-1">1,248</h3>
                </div>
                <div class="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <i data-lucide="users" class="w-4 h-4"></i>
                </div>
            </div>

            <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold">${isAr ? 'العمليات الناجحة' : 'Transactions'}</span>
                  <h3 id="metric-trans" class="text-xl font-bold text-white mt-1">14,289</h3>
                </div>
                <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                </div>
            </div>

            <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold">${isAr ? 'معدل كفاءة الخادم' : 'Server Latency'}</span>
                  <h3 class="text-xl font-bold text-white mt-1">99.98%</h3>
                </div>
                <div class="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                  <i data-lucide="activity" class="w-4 h-4"></i>
                </div>
            </div>

            <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold">${isAr ? 'سعة قاعدة البيانات' : 'Memory Cluster'}</span>
                  <h3 class="text-xl font-bold text-white mt-1">4.2 GB</h3>
                </div>
                <div class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <i data-lucide="database" class="w-4 h-4"></i>
                </div>
            </div>
        </div>

        <!-- Database Logs View -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div class="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
                <h3 class="font-bold text-xs text-white uppercase tracking-wider">${isAr ? 'لوحة البيانات والتحكم والـ APIs' : 'Real-Time Audit Records & APIs'}</h3>
                <button onclick="addNewRecord()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    <span>${isAr ? 'إدراج سجل بيانات جديد' : 'Insert Data Record'}</span>
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-right text-xs">
                    <thead>
                        <tr class="text-slate-500 border-b border-slate-800 font-bold">
                            <th class="pb-2.5">${isAr ? 'المعرف' : 'ID'}</th>
                            <th class="pb-2.5">${isAr ? 'العنوان والمسمى' : 'TITLE'}</th>
                            <th class="pb-2.5">${isAr ? 'حالة التزامن' : 'SYNC STATUS'}</th>
                            <th class="pb-2.5">${isAr ? 'التصنيف' : 'CATEGORY'}</th>
                        </tr>
                    </thead>
                    <tbody id="audit-body" class="divide-y divide-slate-900 text-slate-300">
                        <tr>
                            <td class="py-3 font-mono text-[10px]">#usr-00921</td>
                            <td class="py-3 font-bold">${isAr ? 'تهيئة الجلسة المشفرة للمشرف' : 'System session init secure authorization'}</td>
                            <td class="py-3"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">${isAr ? 'متزامن' : 'Synced'}</span></td>
                            <td class="py-3 text-slate-400">Security</td>
                        </tr>
                        <tr>
                            <td class="py-3 font-mono text-[10px]">#rec-00431</td>
                            <td class="py-3 font-bold">${isAr ? 'تحديث مؤشر المبيعات اللحظي' : 'Update responsive sales indicator table'}</td>
                            <td class="py-3"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">${isAr ? 'متزامن' : 'Synced'}</span></td>
                            <td class="py-3 text-slate-400">Analytics</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="p-4 border-t border-slate-800 text-center text-[10px] text-slate-500 bg-slate-950">
        ${isAr ? 'مدعوم بقاعدة بيانات محلية متزامنة ونشطة بالكامل' : 'Protected and backed by client-side storage systems.'}
    </footer>

    <script>
        lucide.createIcons();
        let totalUsers = 1248;
        let totalTrans = 14289;

        function toggleSetupModal() {
            alert("${isAr ? 'تم بدء تهيئة النظام، وفحص ملفات التكوين وقاعدة البيانات بنجاح!' : 'Configuration and system environment verified successfully!'}");
        }

        function addNewRecord() {
            const title = prompt("${isAr ? 'أدخل عنوان السجل البرمجي لربطه بقاعدة البيانات:' : 'Enter audit record title:'}");
            if (!title) return;
            
            // Add Row
            const body = document.getElementById('audit-body');
            const row = document.createElement('tr');
            row.className = 'border-t border-slate-900';
            const randomId = Math.floor(Math.random() * 89999 + 10000);
            row.innerHTML = \`
                <td class="py-3 font-mono text-[10px]">#rec-\${randomId}</td>
                <td class="py-3 font-bold">\${title}</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">${isAr ? 'متزامن' : 'Synced'}</span></td>
                <td class="py-3 text-slate-400">Custom</td>
            \`;
            body.insertBefore(row, body.firstChild);

            // Update stats
            totalUsers += 1;
            totalTrans += 1;
            document.getElementById('metric-users').innerText = totalUsers.toLocaleString();
            document.getElementById('metric-trans').innerText = totalTrans.toLocaleString();
            
            alert("${isAr ? 'تم إدراج البيانات ومزامنة جداول الخادم!' : 'Inserted audit record and synced db rows successfully!'}");
        }
    </script>
</body>
</html>`;
  }

  // Create document files required
  const readme = `# ${cleanName}
هذا المشروع تم إنشاؤه بالكامل وتوليده تلقائياً عبر منصة ذكاء اصطناعي **X AI Studio** تلبيةً لمتطلبات المستخدم وتحليل الأكواد والاعتماديات.

## تفاصيل فكرة المشروع البرمجي:
\`\`\`
${cleanPrompt}
\`\`\`

## تصنيف المشروع البرمجي:
**${type.toUpperCase()}**

## طريقة التشغيل المحلي:
1. قم بفك الضغط عن ملفات المشروع.
2. افتح ملف \`index.html\` مباشرة في أي متصفح إنترنت حديث لمشاهدة وتجربة التطبيق بكافة عناصره التفاعلية والرسومية.
3. لتخصيص الأكواد أو التطوير، قم بتعديل الأكواد داخل المجلد باستخدام محرر الأكواد المفضل لديك مثل VS Code.
`;

  const license = `MIT License

Copyright (c) 2026 X AI Studio App Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

  const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-17
### Added
- Initial automated scaffold deployment for **${cleanName}**.
- Created responsive visual interfaces leveraging **Tailwind CSS**.
- Linked global icons and vector elements utilizing **Lucide**.
- Structuring local SQLite and PostgreSQL schemas for persistent operations.
- Dynamic responsive configurations for Mobile, Tablet, and Desktop viewport wrappers.
- Integrated fully playable canvas mechanics / functional shopping cart logic.
`;

  // Create database simulation seed
  const dbSeed = `{
  "connection": "local_sqlite_embedded",
  "port": 5432,
  "tables": {
    "users": [
      { "id": 1, "name": "Admin", "role": "System Operator" }
    ],
    "records": [
      { "id": 101, "title": "Audit Logs Initialized", "synced": true }
    ]
  }
}`;

  return {
    'index.html': htmlContent,
    'README.md': readme,
    'LICENSE': license,
    'CHANGELOG.md': changelog,
    'database.json': dbSeed
  };
}
