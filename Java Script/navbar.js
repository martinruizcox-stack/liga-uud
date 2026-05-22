<<<<<<< HEAD
// CONFIGURACIÓN GLOBAL DE SUPABASE
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";

let mizuClient = null;

// Inicializar Supabase cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
    if (typeof supabase !== 'undefined') {
        mizuClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Escuchar cambios en el estado de la sesión (Login/Logout)
        mizuClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                renderNavbar(session.user);
            } else {
                renderNavbar(null);
            }
        });
    } else {
        console.error("Supabase SDK no se ha cargado correctamente.");
    }
});

// FUNCIÓN DE RENDERIZADO COMPLETO DEL NAVBAR
function renderNavbar(user = null) {
    const navbarContainer = document.getElementById('global-navbar');
    if (!navbarContainer) return;

    const isLoggedIn = !!user;

    navbarContainer.innerHTML = `
        <nav class="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between">
            
            <a href="./index.html" class="flex items-center gap-3 hover:opacity-90 transition-all">
                <img src="./Untap Upkeep Draw logo.jpg" alt="Logo" class="w-8 h-8 rounded-full border border-purple-500/40 object-cover">
                <span class="font-bold text-white tracking-wide text-sm md:text-base">Liga Untap Upkeep Draw</span>
            </a>

            <div class="flex items-center gap-4">
                ${isLoggedIn ? `
                    <div class="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-[11px] font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Conectado
                    </div>
                    
                    <div class="relative inline-block text-left">
                        <button onclick="toggleUserMenu(event)" class="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-800 transition-all focus:outline-none">
                            <img src="${user.user_metadata?.avatar_url || './Untap Upkeep Draw logo.jpg'}" 
                                 alt="Avatar" class="w-8 h-8 rounded-full border border-purple-500/30 object-cover">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div id="dropdown-user-menu" class="hidden absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                            <div class="px-4 py-2 border-b border-gray-900">
                                <p class="text-xs text-gray-400 font-medium">Jugador</p>
                                <p class="text-sm font-bold text-white truncate">${user.user_metadata?.full_name || 'Competidor'}</p>
                            </div>
                            <a href="./dashboard.html" class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-900 hover:text-white transition-all">
                                👤 Mi Perfil
                            </a>
                            <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-900 hover:text-white transition-all">
                                ⚔️ Registrar Partida
                            </a>
                            <div class="border-t border-gray-900 my-1"></div>
                            <button onclick="cerrarSesion()" class="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left">
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    </div>
                ` : `
                    <button onclick="ingresarConGoogle()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all text-xs">
                        <svg class="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Log In
                    </button>
                `}
            </div>
        </nav>
    `;
}

// CONTROL DE INTERACCIÓN GLOBAL
function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('dropdown-user-menu');
    if (menu) menu.classList.toggle('hidden');
}

async function ingresarConGoogle() {
    if (!mizuClient) return;
    await mizuClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname.replace('index.html', '') + 'dashboard.html'
        }
    });
}

async function cerrarSesion() {
    if (!mizuClient) return;
    const { error } = await mizuClient.auth.signOut();
    if (!error) {
        window.location.href = './index.html';
    }
}

window.addEventListener('click', (e) => {
    const menu = document.getElementById('dropdown-user-menu');
    if (menu && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
=======
// CONFIGURACIÓN GLOBAL DE SUPABASE
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";

let mizuClient = null;

// Inicializar Supabase cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
    if (typeof supabase !== 'undefined') {
        mizuClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Escuchar cambios en el estado de la sesión (Login/Logout)
        mizuClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                renderNavbar(session.user);
            } else {
                renderNavbar(null);
            }
        });
    } else {
        console.error("Supabase SDK no se ha cargado correctamente.");
    }
});

// FUNCIÓN DE RENDERIZADO COMPLETO DEL NAVBAR
function renderNavbar(user = null) {
    const navbarContainer = document.getElementById('global-navbar');
    if (!navbarContainer) return;

    const isLoggedIn = !!user;

    navbarContainer.innerHTML = `
        <nav class="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between">
            
            <a href="./index.html" class="flex items-center gap-3 hover:opacity-90 transition-all">
                <img src="./Untap Upkeep Draw logo.jpg" alt="Logo" class="w-8 h-8 rounded-full border border-purple-500/40 object-cover">
                <span class="font-bold text-white tracking-wide text-sm md:text-base">Liga Untap Upkeep Draw</span>
            </a>

            <div class="flex items-center gap-4">
                ${isLoggedIn ? `
                    <div class="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-[11px] font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Conectado
                    </div>
                    
                    <div class="relative inline-block text-left">
                        <button onclick="toggleUserMenu(event)" class="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-800 transition-all focus:outline-none">
                            <img src="${user.user_metadata?.avatar_url || './Untap Upkeep Draw logo.jpg'}" 
                                 alt="Avatar" class="w-8 h-8 rounded-full border border-purple-500/30 object-cover">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div id="dropdown-user-menu" class="hidden absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                            <div class="px-4 py-2 border-b border-gray-900">
                                <p class="text-xs text-gray-400 font-medium">Jugador</p>
                                <p class="text-sm font-bold text-white truncate">${user.user_metadata?.full_name || 'Competidor'}</p>
                            </div>
                            <a href="./dashboard.html" class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-900 hover:text-white transition-all">
                                👤 Mi Perfil
                            </a>
                            <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-900 hover:text-white transition-all">
                                ⚔️ Registrar Partida
                            </a>
                            <div class="border-t border-gray-900 my-1"></div>
                            <button onclick="cerrarSesion()" class="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left">
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    </div>
                ` : `
                    <button onclick="ingresarConGoogle()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all text-xs">
                        <svg class="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Log In
                    </button>
                `}
            </div>
        </nav>
    `;
}

// CONTROL DE INTERACCIÓN GLOBAL
function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('dropdown-user-menu');
    if (menu) menu.classList.toggle('hidden');
}

async function ingresarConGoogle() {
    if (!mizuClient) return;
    await mizuClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname.replace('index.html', '') + 'dashboard.html'
        }
    });
}

async function cerrarSesion() {
    if (!mizuClient) return;
    const { error } = await mizuClient.auth.signOut();
    if (!error) {
        window.location.href = './index.html';
    }
}

window.addEventListener('click', (e) => {
    const menu = document.getElementById('dropdown-user-menu');
    if (menu && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
>>>>>>> d75c7da8abe616b87d058862d1e08596073851e9
});