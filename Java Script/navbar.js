// CONFIGURACIÓN GLOBAL
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";

let mizuClient = null;

// Inicialización segura
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
    
    // Si el usuario existe, muestra perfil; si no, muestra botón Login
    nav.innerHTML = user ? `
        <div class="p-4 bg-gray-900 text-white">Hola, ${user.email}</div>
    ` : `
        <button onclick="ingresarConGoogle()" class="bg-purple-600 px-4 py-2 rounded text-white font-bold">
            Log In
        </button>
    `;
}

async function ingresarConGoogle() {
    if (!mizuClient) return;
    try {
        await mizuClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/dashboard.html' }
        });
    } catch (e) {
        console.error("Error al iniciar sesión:", e);
    }
}