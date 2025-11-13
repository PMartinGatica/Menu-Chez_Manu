/**
 * CHEZ MANU - FRONTEND APPLICATION
 * Sistema de visualización de menú con actualización automática
 */

// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

let menuData = {
    entrees: [],
    plats: [],
    desserts: [],
    lastUpdate: null
};

let currentCategory = 'entrees';
let autoRefreshInterval = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Chez Manu - Menu App Iniciada');

    // Cargar menú inicial
    loadMenu();

    // Configurar navegación
    setupNavigation();

    // Auto-refresh cada 30 segundos
    startAutoRefresh(30000);
});

// ============================================
// NAVEGACIÓN
// ============================================

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');

            // Actualizar botones activos
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Mostrar sección correspondiente
            showCategory(category);
        });
    });
}

function showCategory(category) {
    currentCategory = category;

    // Ocultar todas las secciones
    document.querySelectorAll('.menu-section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar sección seleccionada
    const sectionId = `${category}-section`;
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('fade-in');
    }
}

// ============================================
// CARGA DE DATOS
// ============================================

async function loadMenu() {
    showLoader(true);

    try {
        // Usar proxy de Netlify (configurado en netlify.toml)
        // En producción usa /api/, en local usa la URL directa
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

        let apiEndpoint;
        if (isLocal) {
            // Modo local: usar proxy externo
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const targetUrl = encodeURIComponent(`${API_URL}?action=getMenu`);
            apiEndpoint = `${proxyUrl}${targetUrl}`;
        } else {
            // Modo producción: usar proxy de Netlify
            apiEndpoint = '/api/?action=getMenu';
        }

        const response = await fetch(apiEndpoint, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Guardar datos
        menuData = data;

        // Renderizar menú
        renderMenu();

        // Actualizar timestamp
        updateLastUpdate();

        console.log('Menú cargado correctamente', data);

    } catch (error) {
        console.error('Error al cargar el menú:', error);
        showError('Error al cargar el menú. Por favor, verifica la configuración de la API.');
    } finally {
        showLoader(false);
    }
}

// ============================================
// RENDERIZADO DEL MENÚ
// ============================================

function renderMenu() {
    renderEntrees();
    renderPlats();
    renderDesserts();
}

function renderEntrees() {
    const container = document.getElementById('entrees-items');
    if (!container) return;

    container.innerHTML = '';

    if (!menuData.entrees || menuData.entrees.length === 0) {
        container.innerHTML = '<p class="no-items">No hay entradas disponibles</p>';
        return;
    }

    menuData.entrees.forEach(item => {
        const itemElement = createMenuItem(item);
        container.appendChild(itemElement);
    });
}

function renderPlats() {
    const merContainer = document.getElementById('plats-mer-items');
    const terreContainer = document.getElementById('plats-terre-items');

    if (!merContainer || !terreContainer) return;

    merContainer.innerHTML = '';
    terreContainer.innerHTML = '';

    if (!menuData.plats || menuData.plats.length === 0) {
        merContainer.innerHTML = '<p class="no-items">No hay platos disponibles</p>';
        return;
    }

    // Separar por subcategoría
    const platsMer = menuData.plats.filter(item =>
        item.subcategoria && item.subcategoria.toLowerCase().includes('mer')
    );
    const platsTerre = menuData.plats.filter(item =>
        item.subcategoria && item.subcategoria.toLowerCase().includes('terre')
    );

    // Renderizar La Mer
    if (platsMer.length === 0) {
        merContainer.innerHTML = '<p class="no-items">No hay platos del mar disponibles</p>';
    } else {
        platsMer.forEach(item => {
            const itemElement = createMenuItem(item);
            merContainer.appendChild(itemElement);
        });
    }

    // Renderizar La Terre
    if (platsTerre.length === 0) {
        terreContainer.innerHTML = '<p class="no-items">No hay platos de tierra disponibles</p>';
    } else {
        platsTerre.forEach(item => {
            const itemElement = createMenuItem(item);
            terreContainer.appendChild(itemElement);
        });
    }
}

function renderDesserts() {
    const container = document.getElementById('desserts-items');
    if (!container) return;

    container.innerHTML = '';

    if (!menuData.desserts || menuData.desserts.length === 0) {
        container.innerHTML = '<p class="no-items">No hay postres disponibles</p>';
        return;
    }

    menuData.desserts.forEach(item => {
        const itemElement = createMenuItem(item);
        container.appendChild(itemElement);
    });
}

// ============================================
// CREACIÓN DE ELEMENTOS
// ============================================

function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-id', item.id);

    // Nombre en español
    if (item.nombreEs) {
        const nombreEs = document.createElement('div');
        nombreEs.className = 'item-name-es';
        nombreEs.textContent = item.nombreEs;
        div.appendChild(nombreEs);
    }

    // Nombre en inglés
    if (item.nombreEn) {
        const nombreEn = document.createElement('div');
        nombreEn.className = 'item-name-en';
        nombreEn.textContent = item.nombreEn;
        div.appendChild(nombreEn);
    }

    // Descripción en español
    if (item.descripcionEs) {
        const descripcionEs = document.createElement('div');
        descripcionEs.className = 'item-description-es';
        descripcionEs.textContent = item.descripcionEs;
        div.appendChild(descripcionEs);
    }

    // Descripción en inglés
    if (item.descripcionEn) {
        const descripcionEn = document.createElement('div');
        descripcionEn.className = 'item-description-en';
        descripcionEn.textContent = item.descripcionEn;
        div.appendChild(descripcionEn);
    }

    // Precio
    const precio = document.createElement('div');
    precio.className = 'item-price';
    precio.textContent = formatPrice(item.precio);
    div.appendChild(precio);

    return div;
}

// ============================================
// UTILIDADES
// ============================================

function formatPrice(price) {
    if (!price) return '';
    return `$${price.toLocaleString('es-AR')}`;
}

function updateLastUpdate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (!lastUpdateElement) return;

    const now = new Date();
    const formattedDate = now.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    lastUpdateElement.textContent = formattedDate;
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    const content = document.getElementById('menuContent');

    if (!loader || !content) return;

    if (show) {
        loader.classList.remove('hidden');
        content.style.opacity = '0.3';
    } else {
        loader.classList.add('hidden');
        content.style.opacity = '1';
    }
}

function showError(message) {
    const content = document.getElementById('menuContent');
    if (!content) return;

    content.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <h3 style="color: #B22222; margin-bottom: 15px;">Error</h3>
            <p style="color: #666;">${message}</p>
            <button onclick="loadMenu()" style="margin-top: 20px; padding: 10px 20px; background: #8B0000; color: white; border: none; cursor: pointer; font-family: Georgia, serif;">
                Reintentar
            </button>
        </div>
    `;
}

// ============================================
// AUTO-REFRESH
// ============================================

function startAutoRefresh(intervalMs = 30000) {
    // Limpiar intervalo existente
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }

    // Crear nuevo intervalo
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refresh: Actualizando menú...');
        loadMenu();
    }, intervalMs);

    console.log(`Auto-refresh configurado cada ${intervalMs / 1000} segundos`);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('Auto-refresh detenido');
    }
}

// ============================================
// DETECCIÓN DE VISIBILIDAD
// ============================================

// Pausar auto-refresh cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh();
        console.log('Página oculta - Auto-refresh pausado');
    } else {
        startAutoRefresh(30000);
        loadMenu(); // Actualizar inmediatamente al volver
        console.log('Página visible - Auto-refresh reanudado');
    }
});

// ============================================
// MANEJO DE ERRORES DE API URL
// ============================================

if (typeof API_URL === 'undefined' || API_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
    console.error('⚠️ API_URL no configurada. Por favor, configura la URL de tu Google Apps Script en index.html');

    setTimeout(() => {
        showError(`
            La URL de la API no está configurada.<br><br>
            Por favor, sigue estos pasos:<br>
            1. Despliega el Google Apps Script como Web App<br>
            2. Copia la URL generada<br>
            3. Pégala en el archivo index.html en la variable API_URL
        `);
    }, 100);
}

// ============================================
// FUNCIONES PÚBLICAS PARA DEBUGGING
// ============================================

window.chezManu = {
    loadMenu,
    startAutoRefresh,
    stopAutoRefresh,
    showCategory,
    menuData: () => menuData,
    version: '1.0.0'
};

console.log('Chez Manu Menu App v1.0.0 - Ready');
console.log('Funciones disponibles:', Object.keys(window.chezManu));
