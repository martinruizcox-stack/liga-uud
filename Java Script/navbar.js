// navbar.js
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function renderNavbar() {
    const navContainer = document.getElementById('navbar');
    if (!navContainer) return; // Si no existe el div, no hace nada

    const { data: { session } } = await client.auth.getSession();

    if (session) {
        navContainer.innerHTML = `
            <button onclick="logout()" class="bg-red-600 px-4 py-2 rounded text-white text-sm">
                Cerrar Sesión
            </button>`;
    } else {
        navContainer.innerHTML = `
            <a href="./index.html" class="bg-purple-600 px-4 py-2 rounded text-white text-sm">
                Log In
            </a>`;
    }
}

async function logout() {
    await client.auth.signOut();
    window.location.href = './index.html';
}

// Ejecutar al cargar
renderNavbar();