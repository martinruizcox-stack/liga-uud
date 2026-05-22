// CONFIGURACIÓN GLOBAL
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";

let mizuClient = null;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    if (typeof supabase !== 'undefined') {
        mizuClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        mizuClient.auth.onAuthStateChange((event, session) => {
            renderNavbar(session ? session.user : null);
        });
    } else {
        console.error("Supabase SDK no cargado");
    }
});

function renderNavbar(user = null) {
    const nav = document.getElementById('global-navbar');
    if (!nav) return;
    
    nav.innerHTML = user ? `
        <div class="flex items-center gap-4 bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span class="text-sm text-gray-300 truncate">${user.email}</span>
            <button onclick="cerrarSesion()" class="text-xs text-red-400 hover:text-red-300">Cerrar Sesión</button>
        </div>
    ` : `
        <button onclick="ingresarConGoogle()" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all">
            Log In
        </button>
    `;
}

async function ingresarConGoogle() {
    if (!mizuClient) return;
    try {
        // CORRECCIÓN: Asegúrate de incluir /liga-uud/ en el path
        await mizuClient.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: window.location.origin + '/liga-uud/dashboard.html' 
            }
        });
    } catch (e) {
        console.error("Error al iniciar sesión:", e);
    }
}

async function cerrarSesion() {
    if (!mizuClient) return;
    await mizuClient.auth.signOut();
    window.location.reload();
}