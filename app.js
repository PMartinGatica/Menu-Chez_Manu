/**
 * CHEZ MANU - FRONTEND APPLICATION
 * Sistema de visualización de menú con actualización automática
 * Optimizado para rendimiento y velocidad
 */

// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

let menuData = {
    entrees: [],
    plats: [],
    desserts: [],
    vinos: [],
    lastUpdate: null
};

let currentCategory = 'entrees';
let autoRefreshInterval = null;
let isLoading = false; // Prevenir múltiples cargas simultáneas
let loadingController = null; // AbortController para cancelar requests
let retryCount = 0;
const MAX_RETRIES = 3;
const CACHE_KEY = 'chezManuMenu';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas - solo refresca si hay cambios en Google Sheets
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos (solo chequea si hay cambios)

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Chez Manu - Menu App Iniciada');

    // Marcar body como loaded para prevenir FOUC
    document.body.classList.add('loaded');

    // Configurar navegación primero (no requiere datos)
    setupNavigation();

    // Intentar cargar desde cache primero (carga instantánea)
    const cachedData = loadFromCache();
    if (cachedData) {
        console.log('✅ Cargando desde cache (carga instantánea)...');
        menuData = cachedData;
        renderMenu();
        updateLastUpdate();
        showLoader(false);

        // Solo chequear actualizaciones en segundo plano (no bloquea UI)
        checkForUpdatesInBackground();
    } else {
        // Sin cache: cargar del servidor
        loadMenu();
    }

    // Auto-refresh cada 5 minutos (solo chequea si hay cambios, no recarga siempre)
    startAutoRefresh(AUTO_REFRESH_INTERVAL);

    // Optimización: Precarga de imágenes
    preloadCriticalAssets();
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

// Chequear actualizaciones en segundo plano (sin loader, sin interrumpir)
async function checkForUpdatesInBackground() {
    if (isLoading) return;

    console.log('🔄 Chequeando actualizaciones en segundo plano...');

    try {
        const isLocal = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.protocol === 'file:';

        let apiEndpoint;
        if (isLocal) {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const targetUrl = encodeURIComponent(`${API_URL}?action=getMenu`);
            apiEndpoint = `${proxyUrl}${targetUrl}`;
        } else {
            apiEndpoint = '/api/?action=getMenu';
        }

        const response = await fetch(apiEndpoint, {
            method: 'GET',
            cache: 'no-cache',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Comparar con datos actuales para ver si hay cambios
        const hasChanges = JSON.stringify(menuData) !== JSON.stringify(data);

        if (hasChanges) {
            console.log('✨ Se detectaron cambios - Actualizando menú...');
            menuData = data;
            saveToCache(data);
            renderMenu();
            updateLastUpdate();
        } else {
            console.log('✅ No hay cambios - Menú actualizado');
        }

    } catch (error) {
        console.warn('⚠️ Error al chequear actualizaciones:', error.message);
        // No mostrar error al usuario, solo log
    }
}

async function loadMenu() {
    // Prevenir múltiples cargas simultáneas
    if (isLoading) {
        console.log('Carga ya en progreso, cancelando...');
        return;
    }

    isLoading = true;
    showLoader(true);

    // Cancelar request anterior si existe
    if (loadingController) {
        loadingController.abort();
    }

    // Crear nuevo AbortController para este request
    loadingController = new AbortController();

    try {
        // Usar proxy de Netlify (configurado en netlify.toml)
        const isLocal = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.protocol === 'file:';

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
            method: 'GET',
            signal: loadingController.signal,
            // Optimizaciones de fetch
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Guardar datos en memoria y cache
        menuData = data;
        saveToCache(data);

        // Renderizar solo si hay cambios (optimización)
        renderMenu();

        // Actualizar timestamp
        updateLastUpdate();

        // Reset retry count en caso de éxito
        retryCount = 0;

        console.log('✅ Menú cargado correctamente');

    } catch (error) {
        // Si fue abortado, no es un error real
        if (error.name === 'AbortError') {
            console.log('Request cancelado');
            return;
        }

        console.error('❌ Error al cargar el menú:', error);

        // Retry con backoff exponencial
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.log(`Reintentando en ${retryDelay}ms... (${retryCount}/${MAX_RETRIES})`);

            setTimeout(() => {
                isLoading = false;
                loadMenu();
            }, retryDelay);
        } else {
            // Si falló después de todos los reintentos, mostrar error
            showError(`Error al cargar el menú: ${error.message}`);
            retryCount = 0;
        }

    } finally {
        isLoading = false;
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
    renderVinos();
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

function renderVinos() {
    if (!menuData.vinos || menuData.vinos.length === 0) return;

    // Agrupar vinos por categoría principal y varietal
    const vinosPorCategoria = {};

    menuData.vinos.forEach(vino => {
        const subcategoria = vino.subcategoria || 'Otros';
        if (!vinosPorCategoria[subcategoria]) {
            vinosPorCategoria[subcategoria] = [];
        }
        vinosPorCategoria[subcategoria].push(vino);
    });

    // Renderizar cada categoría en su contenedor correspondiente
    for (const subcategoria in vinosPorCategoria) {
        const partes = subcategoria.split(' - ');
        const categoriaPrincipal = partes[0];
        const varietal = partes[1] || '';

        // Generar ID del contenedor basado en la subcategoría
        const containerId = `vinos-${subcategoria.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        const container = document.getElementById(containerId);

        console.log('🔍 Buscando contenedor:', containerId, container ? '✅ Encontrado' : '❌ No encontrado');

        if (!container) {
            console.warn('⚠️ No se encontró contenedor para:', subcategoria, '(ID esperado:', containerId + ')');
            continue;
        }

        container.innerHTML = '';

        // Renderizar vinos (sin título de varietal duplicado, ya está en el HTML)
        vinosPorCategoria[subcategoria].forEach(vino => {
            const vinoElement = createVinoItem(vino);
            container.appendChild(vinoElement);
        });
    }
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

function createVinoItem(vino) {
    const div = document.createElement('div');
    div.className = 'vino-item';
    div.setAttribute('data-id', vino.id);

    const table = document.createElement('div');
    table.className = 'vino-table';

    // Nombre del vino
    const nombre = document.createElement('div');
    nombre.className = 'vino-nombre';
    nombre.textContent = vino.nombreEs;
    table.appendChild(nombre);

    // Precio del vino
    const precio = document.createElement('div');
    precio.className = 'vino-precio';
    precio.textContent = formatPrice(vino.precio);
    table.appendChild(precio);

    div.appendChild(table);
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

    // Crear nuevo intervalo - solo chequea cambios en background
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refresh: Chequeando cambios...');
        checkForUpdatesInBackground();
    }, intervalMs);

    console.log(`Auto-refresh configurado cada ${intervalMs / 1000} segundos (solo chequea cambios)`);
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
        startAutoRefresh(AUTO_REFRESH_INTERVAL);
        // Chequear cambios en segundo plano (sin loader)
        checkForUpdatesInBackground();
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
// CACHE LOCAL (LocalStorage)
// ============================================

function saveToCache(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('✅ Datos guardados en cache');
    } catch (error) {
        console.warn('⚠️ No se pudo guardar en cache:', error);
    }
}

function loadFromCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;

        // Si el cache es muy viejo, ignorarlo
        if (age > CACHE_DURATION) {
            console.log('Cache expirado, eliminando...');
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        console.log(`Cache válido (${Math.round(age / 1000)}s de antigüedad)`);
        return cacheData.data;
    } catch (error) {
        console.warn('⚠️ Error al cargar cache:', error);
        return null;
    }
}

function clearCache() {
    localStorage.removeItem(CACHE_KEY);
    console.log('Cache eliminado');
}

// ============================================
// OPTIMIZACIONES DE RENDIMIENTO
// ============================================

function preloadCriticalAssets() {
    // Precarga del logo si existe
    const logoImg = new Image();
    logoImg.src = 'chezmanulogo.jpg';
}

// Debounce para evitar renderizados excesivos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para limitar frecuencia de actualizaciones
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// OPTIMIZACIÓN DE RENDERIZADO
// ============================================

// Usar requestAnimationFrame para renderizar de forma eficiente
function optimizedRender(renderFunc) {
    if (window.requestAnimationFrame) {
        requestAnimationFrame(renderFunc);
    } else {
        renderFunc();
    }
}

// Lazy loading de imágenes (para cuando agreguen fotos de platos)
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// MONITOREO DE RENDIMIENTO
// ============================================

function measurePerformance() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

                console.log(`📊 Rendimiento:`);
                console.log(`   - Tiempo de carga total: ${pageLoadTime}ms`);
                console.log(`   - DOM listo en: ${domReadyTime}ms`);
            }, 0);
        });
    }
}

measurePerformance();

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', (event) => {
    console.error('❌ Error global:', event.error);
    // No mostrar al usuario errores menores, solo loggear
    if (event.error && event.error.message && event.error.message.includes('fetch')) {
        // Los errores de fetch ya se manejan en loadMenu
        event.preventDefault();
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada:', event.reason);
    event.preventDefault();
});

// ============================================
// FUNCIONES PÚBLICAS PARA DEBUGGING
// ============================================

window.chezManu = {
    loadMenu,
    startAutoRefresh,
    stopAutoRefresh,
    showCategory,
    clearCache,
    menuData: () => menuData,
    performance: () => window.performance?.timing,
    version: '2.0.0-optimized'
};

console.log('🍽️ Chez Manu Menu App v2.0.0 - Optimizado');
console.log('Funciones disponibles:', Object.keys(window.chezManu));
