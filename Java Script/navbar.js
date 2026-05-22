// Configuración de Supabase
const SUPABASE_URL = "https://kdwqdjfafywzttupgdvw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TmaZmfzJZU9WHpNMQgQ2wg_xZvPknuT";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function renderNavbar(tituloPagina) {
    const navContainer = document.getElementById('navbar');
    if (!navContainer) return;

    const { data: { session } } = await client.auth.getSession();

    const authButton = session 
        ? `<button onclick="logout()" class="bg-red-600 px-4 py-2 rounded text-white text-sm font-bold">Cerrar Sesión</button>`
        : `<a href="index.html" class="bg-purple-600 px-4 py-2 rounded text-white text-sm font-bold">Log In</a>`;

    navContainer.innerHTML = `
        <header class="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 shadow-md">
            <img src="Imagenes/Untap Upkeep Draw logo.jpg" alt="Logo" class="h-12 w-auto">
            <h1 class="text-xl font-bold tracking-wider text-white">${tituloPagina}</h1>
            <div>${authButton}</div>
        </header>
    `;
}

async function logout() {
    await client.auth.signOut();
    window.location.href = 'index.html';
}