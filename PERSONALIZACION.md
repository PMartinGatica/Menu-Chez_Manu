# 🎨 Guía de Personalización

## Logo del Restaurante

### Opción 1: Usar una Imagen (Recomendado)

Si tienes el logo en formato de imagen (PNG, JPG, SVG):

1. Guarda tu logo como `logo.png` en la misma carpeta
2. Abre `index.html`
3. Reemplaza el SVG actual con:

```html
<div class="logo-container">
    <h1 class="logo-title">Chez Manu</h1>
    <img src="logo.png" alt="Chez Manu Logo" class="logo-image">
    <p class="logo-subtitle">Ushuaia<br>Tierra del Fuego</p>
</div>
```

4. Agrega estos estilos en `styles.css`:

```css
.logo-image {
    width: 120px;
    height: auto;
    margin: 15px 0;
}
```

### Opción 2: Personalizar el SVG Actual

El logo actual es un SVG simple de una veleta. Para modificarlo:

1. Abre `index.html`
2. Busca la sección `<svg>` dentro de `.logo-icon`
3. Modifica los colores cambiando `fill="#8B0000"` por tu color
4. Ajusta el tamaño modificando `width` y `height`

### Opción 3: Sin Logo (Solo Texto)

Si prefieres solo texto:

```html
<div class="logo-container">
    <h1 class="logo-title">Chez Manu</h1>
    <p class="logo-subtitle">Restaurant<br>Ushuaia - Tierra del Fuego</p>
</div>
```

---

## Colores del Diseño

En `styles.css`, busca `:root` y modifica:

```css
:root {
    --primary-color: #8B0000;      /* Color principal (borgoña) */
    --secondary-color: #333;       /* Texto secundario */
    --text-color: #2c2c2c;        /* Texto principal */
    --light-gray: #f5f5f5;        /* Fondo claro */
    --border-color: #e0e0e0;      /* Bordes */
    --accent-red: #B22222;        /* Rojo de acento */
    --background: #FEFEFE;        /* Fondo general */
}
```

### Ejemplos de Paletas

**Elegante Negro y Dorado**
```css
--primary-color: #D4AF37;  /* Dorado */
--secondary-color: #1a1a1a;
--accent-red: #C9A961;
```

**Azul Marino Clásico**
```css
--primary-color: #003366;  /* Azul marino */
--secondary-color: #1a1a1a;
--accent-red: #004080;
```

**Verde Elegante**
```css
--primary-color: #2C5F2D;  /* Verde bosque */
--secondary-color: #1a1a1a;
--accent-red: #97BC62;
```

---

## Tipografías

### Cambiar la Fuente Principal

En `styles.css`, busca `body` y modifica:

```css
body {
    font-family: 'Tu-Fuente', 'Georgia', serif;
}
```

### Usar Google Fonts

1. Ve a [Google Fonts](https://fonts.google.com)
2. Selecciona una fuente (ej: Playfair Display, Lora, Cormorant)
3. Copia el `<link>` en el `<head>` de `index.html`:

```html
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
```

4. Actualiza el CSS:

```css
body {
    font-family: 'Playfair Display', Georgia, serif;
}
```

### Fuentes Recomendadas para Restaurantes

- **Elegantes**: Playfair Display, Cormorant Garamond, Libre Baskerville
- **Modernas**: Montserrat, Raleway, Josefin Sans
- **Clásicas**: Merriweather, Lora, Crimson Text

---

## Textos e Idioma

### Cambiar el Título Principal

En `index.html`:

```html
<h1 class="logo-title">Tu Nombre de Restaurante</h1>
```

### Cambiar Subtítulo

```html
<p class="logo-subtitle">Tu Ciudad<br>Tu Región</p>
```

### Nombres de Categorías

En `index.html`, busca los botones de navegación:

```html
<button class="nav-btn active" data-category="entrees">Entradas</button>
<button class="nav-btn" data-category="plats">Platos Principales</button>
<button class="nav-btn" data-category="desserts">Postres</button>
```

Y los títulos de sección:

```html
<h2 class="section-title">Entradas</h2>
```

---

## Formato de Precios

En `app.js`, busca la función `formatPrice`:

### Cambiar Símbolo de Moneda

```javascript
function formatPrice(price) {
    if (!price) return '';
    // Para pesos argentinos:
    return `$${price.toLocaleString('es-AR')}`;

    // Para dólares:
    // return `USD $${price.toLocaleString('en-US')}`;

    // Para euros:
    // return `€${price.toLocaleString('de-DE')}`;
}
```

### Agregar Decimales

```javascript
function formatPrice(price) {
    if (!price) return '';
    return `$${price.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
```

---

## Diseño y Layout

### Cambiar el Ancho Máximo

En `styles.css`, busca `.container`:

```css
.container {
    max-width: 900px;  /* Cambiar a 1200px para más ancho */
}
```

### Modificar Espaciados

```css
.menu-item {
    padding: 20px 0;  /* Aumentar para más espacio entre items */
}

.menu-items {
    gap: 30px;  /* Espacio entre items */
}
```

### Cambiar Tamaños de Fuente

```css
.item-name-es {
    font-size: 1.1rem;  /* Aumentar a 1.3rem para nombres más grandes */
}

.item-price {
    font-size: 1.1rem;  /* Aumentar a 1.3rem para precios más grandes */
}
```

---

## Auto-Refresh

### Cambiar Frecuencia de Actualización

En `app.js`, busca `startAutoRefresh`:

```javascript
// Cada 30 segundos (por defecto)
startAutoRefresh(30000);

// Cada 1 minuto
startAutoRefresh(60000);

// Cada 10 segundos (para testing)
startAutoRefresh(10000);

// Deshabilitar completamente
// Comenta esta línea en el DOMContentLoaded
```

---

## Agregar Funcionalidades

### Agregar Alergenos

1. En Google Sheets, agrega una columna "Alergenos"
2. En `app.js`, modifica `createMenuItem`:

```javascript
// Después del precio
if (item.alergenos) {
    const alergenos = document.createElement('div');
    alergenos.className = 'item-alergenos';
    alergenos.textContent = `🔴 ${item.alergenos}`;
    div.appendChild(alergenos);
}
```

3. En `styles.css`:

```css
.item-alergenos {
    font-size: 0.85rem;
    color: #ff6b6b;
    margin-top: 8px;
    font-style: italic;
}
```

### Agregar Platos Destacados

En `styles.css`:

```css
.menu-item.destacado {
    background: #fff9e6;
    border-left: 4px solid var(--primary-color);
    padding-left: 15px;
}

.menu-item.destacado::before {
    content: "⭐ ";
    color: gold;
}
```

En Google Sheets, agrega columna "Destacado" (TRUE/FALSE)

En `app.js`, en `createMenuItem`:

```javascript
if (item.destacado) {
    div.classList.add('destacado');
}
```

---

## Modo Oscuro

Agrega en `styles.css`:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --background: #1a1a1a;
        --text-color: #e0e0e0;
        --secondary-color: #ccc;
        --border-color: #333;
        --light-gray: #2a2a2a;
    }

    .container {
        background: #1a1a1a;
    }

    .menu-item {
        border-bottom-color: #333;
    }
}
```

---

## Favicon (Ícono de Pestaña)

1. Crea o descarga un favicon (16x16px o 32x32px)
2. Guárdalo como `favicon.ico`
3. En `index.html`, agrega en el `<head>`:

```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

---

## Meta Tags para Redes Sociales

En `index.html`, agrega en el `<head>`:

```html
<!-- Open Graph (Facebook) -->
<meta property="og:title" content="Chez Manu - Restaurant">
<meta property="og:description" content="Restaurante en Ushuaia, Tierra del Fuego">
<meta property="og:image" content="https://tu-sitio.com/logo.png">
<meta property="og:url" content="https://tu-sitio.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Chez Manu - Restaurant">
<meta name="twitter:description" content="Restaurante en Ushuaia, Tierra del Fuego">
<meta name="twitter:image" content="https://tu-sitio.com/logo.png">
```

---

¡Con estas personalizaciones puedes adaptar completamente el diseño a tu marca! 🎨
