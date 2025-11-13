# ⚡ Optimizaciones de Rendimiento - Chez Manu

## 🎯 Objetivo
Sistema ultra-rápido que carga instantáneamente, se actualiza en tiempo real y nunca se cuelga.

---

## 🚀 Optimizaciones Implementadas

### 1. **Carga Inicial Instantánea (< 100ms)**

#### Cache LocalStorage
- ✅ Primera visita: Carga normal del servidor
- ✅ Visitas siguientes: **Carga instantánea desde cache**
- ✅ Actualización en segundo plano (no bloquea UI)
- ✅ Cache válido por 2 minutos

```javascript
// El usuario ve el menú inmediatamente
loadFromCache() → Renderiza → Actualiza en background
```

### 2. **Prevención de Bloqueos**

#### AbortController
- ✅ Cancela requests anteriores si hay uno nuevo
- ✅ Previene múltiples cargas simultáneas
- ✅ Flag `isLoading` evita race conditions

#### Retry con Backoff Exponencial
- ✅ 3 reintentos automáticos
- ✅ Delays incrementales: 1s → 2s → 4s
- ✅ No molesta al usuario durante los reintentos

```javascript
Intento 1: Falla → Espera 1s → Reintenta
Intento 2: Falla → Espera 2s → Reintenta
Intento 3: Falla → Espera 4s → Reintenta
Intento 4: Falla → Muestra error al usuario
```

### 3. **Optimización de Red**

#### Preload de Recursos Críticos
```html
<link rel="preload" href="styles.css" as="style">
<link rel="preload" href="app.js" as="script">
<link rel="preload" href="chezmanulogo.jpg" as="image">
```

#### Proxy de Netlify
- ✅ Evita CORS (sin servicios externos)
- ✅ Más rápido que proxies externos
- ✅ Más confiable

### 4. **Optimización de Renderizado**

#### GPU Acceleration
```css
.nav-btn {
    transform: translateZ(0); /* Force GPU */
    will-change: background-color, color;
}
```

#### Content Visibility
```css
.menu-content {
    content-visibility: auto; /* Renderiza solo lo visible */
    contain-intrinsic-size: 1000px;
}
```

#### Container Queries
```css
.menu-section {
    contain: layout style paint; /* Aísla el renderizado */
}
```

### 5. **Smart Auto-Refresh**

#### Pausar cuando la pestaña está oculta
```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh(); // No gasta recursos
    } else {
        startAutoRefresh();
        loadMenu(); // Actualiza al volver
    }
});
```

#### Throttle & Debounce
- Evita renderizados excesivos
- Optimiza eventos de scroll/resize

### 6. **Manejo de Errores Robusto**

#### Errores Globales
```javascript
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleRejection);
```

#### Graceful Degradation
- Si falla la API → Muestra cache
- Si falla el cache → Muestra mensaje amigable
- **Nunca se rompe completamente**

### 7. **Optimización de Fuentes**

```css
@font-face {
    font-display: swap; /* No bloquea renderizado */
}
```

```css
body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}
```

### 8. **Prevención de FOUC**

```css
body:not(.loaded) {
    opacity: 0; /* Oculto hasta que esté listo */
}

body.loaded {
    opacity: 1;
    transition: opacity 0.3s;
}
```

### 9. **Lazy Loading**

Preparado para cuando agreguen imágenes de platos:

```javascript
setupLazyLoading(); // Carga imágenes solo cuando son visibles
```

### 10. **Monitoreo de Performance**

```javascript
measurePerformance(); // Reporta métricas en consola
```

Métricas reportadas:
- Tiempo de carga total
- Tiempo hasta DOM listo
- Tiempo de First Contentful Paint

---

## 📊 Resultados Esperados

### Antes (Sin optimizaciones)
- 🔴 Carga inicial: ~2-3 segundos
- 🔴 Múltiples requests simultáneos
- 🔴 Se cuelga con conexión lenta
- 🔴 No funciona offline

### Después (Con optimizaciones)
- 🟢 Carga inicial: < 100ms (con cache)
- 🟢 Primera carga: ~500-800ms
- 🟢 Un solo request a la vez
- 🟢 Reintentos automáticos
- 🟢 Funciona offline (con cache válido)

---

## 🔧 Debugging

### Ver métricas de rendimiento
```javascript
// En la consola del navegador
chezManu.performance()
```

### Limpiar cache
```javascript
chezManu.clearCache()
```

### Ver datos en memoria
```javascript
chezManu.menuData()
```

### Forzar recarga
```javascript
chezManu.loadMenu()
```

---

## 📱 Optimizaciones Móviles

### Smooth Scroll en iOS
```css
-webkit-overflow-scrolling: touch;
```

### Touch Events Optimizados
- No bloquean scroll
- Respuesta instantánea

### Viewport Optimizado
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🌐 Optimizaciones de Netlify

### Headers de Cache
```toml
# CSS y JS cacheados por 1 año
Cache-Control: public, max-age=31536000, immutable

# HTML sin cache (siempre fresco)
Cache-Control: public, max-age=0, must-revalidate
```

### Headers de Seguridad
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### Compression
Netlify comprime automáticamente:
- Gzip para navegadores viejos
- Brotli para navegadores modernos (40% más pequeño)

---

## 🎯 Core Web Vitals

### LCP (Largest Contentful Paint)
**Target: < 2.5s**
- ✅ Preload de recursos críticos
- ✅ Font-display: swap
- ✅ Lazy loading de imágenes

### FID (First Input Delay)
**Target: < 100ms**
- ✅ JavaScript no bloquea el main thread
- ✅ Event listeners optimizados
- ✅ Debounce/Throttle en eventos pesados

### CLS (Cumulative Layout Shift)
**Target: < 0.1**
- ✅ Dimensiones explícitas en imágenes
- ✅ Sin contenido que mueva el layout
- ✅ Skeleton screens durante carga

---

## 🔍 Checklist de Rendimiento

- [x] Cache LocalStorage implementado
- [x] Preload de recursos críticos
- [x] AbortController para cancelar requests
- [x] Retry con backoff exponencial
- [x] GPU acceleration en animaciones
- [x] Content visibility para renderizado eficiente
- [x] Smart auto-refresh (pausa cuando inactivo)
- [x] Manejo robusto de errores
- [x] Font optimization
- [x] Lazy loading preparado
- [x] Performance monitoring
- [x] FOUC prevention
- [x] Smooth scrolling
- [x] Touch optimization para móviles
- [x] Compression en Netlify
- [x] Security headers

---

## 🚦 Límites de Rate

### Google Apps Script
- 20,000 requests/día (más que suficiente)
- Timeout: 30 segundos/request

### Netlify
- 100GB bandwidth/mes (plan free)
- Sin límite de requests

### LocalStorage
- 5-10 MB disponible
- Nuestro cache: ~50 KB

---

## 💡 Tips para Mantener el Rendimiento

1. **No agregues scripts externos pesados**
   - Analytics: OK
   - jQuery: ❌ NO NECESARIO

2. **Imágenes optimizadas**
   - WebP cuando sea posible
   - Compresión adecuada
   - Lazy loading activado

3. **CSS minificado en producción**
   - Netlify lo hace automáticamente

4. **JavaScript moderno**
   - El código usa features modernas
   - Funciona en 95%+ de navegadores

---

## 🎓 Recursos

- [Web Vitals](https://web.dev/vitals/)
- [Netlify Performance](https://www.netlify.com/blog/2020/05/20/how-netlify-helps-with-web-vitals/)
- [LocalStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Versión: 2.0.0-optimized**

**Última actualización: 2025**

¡El sistema está optimizado al máximo! 🚀
