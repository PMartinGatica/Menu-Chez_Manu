# 🍽️ Chez Manu - Sistema de Menú Digital

Sistema completo de gestión de menú para restaurante con Google Sheets como base de datos y actualización instantánea en el frontend.

## 📋 Características

- **Base de datos en Google Sheets** - Fácil de editar para personal no técnico
- **Actualización instantánea** - Los cambios en Google Sheets se reflejan automáticamente
- **CRUD completo** - API REST con Google Apps Script
- **Diseño elegante** - Mantiene la estética del restaurante Chez Manu
- **Responsive** - Funciona en desktop, tablet y móvil
- **Multiidioma** - Soporte para español e inglés
- **Auto-refresh** - El menú se actualiza automáticamente cada 30 segundos

## 🚀 Instalación Paso a Paso

### Paso 1: Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Chez Manu - Menu"

### Paso 2: Configurar Google Apps Script

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Elimina el código por defecto
3. Copia todo el contenido del archivo `google-apps-script.js`
4. Pégalo en el editor de Apps Script
5. Guarda el proyecto (Ctrl+S) con el nombre "Chez Manu API"

### Paso 3: Inicializar la Base de Datos

1. En el editor de Apps Script, selecciona la función `inicializarHojas` en el menú desplegable
2. Haz clic en **Ejecutar** (▶️)
3. Autoriza el script cuando te lo pida
4. Espera a que se ejecute (verás "Execution completed" en los logs)
5. Vuelve a tu Google Sheet y verás 3 hojas creadas:
   - Entrées
   - Plats Principaux
   - Desserts

### Paso 4: Poblar con Datos Iniciales

1. En el editor de Apps Script, selecciona la función `poblarDatosIniciales`
2. Haz clic en **Ejecutar** (▶️)
3. Vuelve a tu Google Sheet y verás todos los platos del menú cargados

### Paso 5: Desplegar como Web App

1. En el editor de Apps Script, haz clic en **Implementar > Nueva implementación**
2. Haz clic en el icono de engranaje ⚙️ y selecciona **Aplicación web**
3. Configura:
   - **Descripción**: "Chez Manu Menu API"
   - **Ejecutar como**: "Yo (tu email)"
   - **Quién tiene acceso**: "Cualquier persona"
4. Haz clic en **Implementar**
5. **IMPORTANTE**: Copia la URL de la aplicación web (algo como: `https://script.google.com/macros/s/...../exec`)
6. Guarda esta URL, la necesitarás en el siguiente paso

### Paso 6: Configurar el Frontend

1. Abre el archivo `index.html`
2. Busca esta línea:
   ```javascript
   const API_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
   ```
3. Reemplázala con tu URL real:
   ```javascript
   const API_URL = 'https://script.google.com/macros/s/...../exec';
   ```
4. Guarda el archivo

### Paso 7: Probar el Sistema

1. Abre `index.html` en tu navegador
2. Deberías ver el menú completo cargado
3. Prueba cambiar un precio en Google Sheets
4. Espera 30 segundos o recarga la página
5. El cambio debería reflejarse en el frontend

## 📁 Estructura de Archivos

```
Carta ChezManu/
│
├── google-apps-script.js    # Código del backend (copiar a Google Apps Script)
├── index.html                # Página principal
├── styles.css                # Estilos
├── app.js                    # Lógica del frontend
└── README.md                 # Este archivo
```

## 🗄️ Estructura de Google Sheets

Cada hoja tiene las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| ID | Identificador único (autogenerado) |
| Nombre (ES) | Nombre del plato en español |
| Nombre (EN) | Nombre del plato en inglés |
| Descripción (ES) | Descripción adicional en español |
| Descripción (EN) | Descripción adicional en inglés |
| Precio | Precio del plato (número) |
| Categoría | Categoría principal (Entrées, Plats, Desserts) |
| Subcategoría | Subcategoría (La Mer, La Terre, etc.) |
| Activo | TRUE/FALSE - Mostrar u ocultar el plato |
| Última Actualización | Fecha automática |

## 🔧 Cómo Usar

### Editar un Plato Existente

1. Abre tu Google Sheet
2. Busca el plato que quieres editar
3. Modifica el precio, nombre o descripción
4. Los cambios se reflejarán automáticamente en el menú (máximo 30 segundos)

### Agregar un Plato Nuevo

**Opción 1: Desde Google Sheets (Recomendado)**
1. Ve a la hoja correspondiente (Entrées, Plats Principaux o Desserts)
2. Añade una nueva fila con todos los datos
3. El ID debe ser el siguiente número consecutivo
4. Marca "Activo" como TRUE

**Opción 2: Usando la API (Avanzado)**
```javascript
// Ejemplo de POST request
fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'addItem',
    data: {
      categoria: 'Entrées',
      nombreEs: 'Nuevo plato',
      nombreEn: 'New dish',
      precio: 25000,
      subcategoria: 'Mar',
      activo: true
    }
  })
});
```

### Ocultar un Plato (Sin Eliminarlo)

1. En Google Sheets, busca el plato
2. Cambia la columna "Activo" de TRUE a FALSE
3. El plato dejará de mostrarse en el menú

### Eliminar un Plato Permanentemente

**Opción 1: Desde Google Sheets**
1. Selecciona la fila completa
2. Click derecho > Eliminar fila

**Opción 2: Usando la API**
```javascript
fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'deleteItem',
    data: {
      categoria: 'Entrées',
      id: 1,
      hard: true  // true = eliminar permanentemente, false = marcar como inactivo
    }
  })
});
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #8B0000;      /* Rojo borgoña principal */
    --secondary-color: #333;       /* Color de texto secundario */
    --text-color: #2c2c2c;        /* Color de texto principal */
    --accent-red: #B22222;        /* Rojo de acento */
}
```

### Cambiar Intervalo de Auto-Refresh

En `app.js`, modifica el valor (en milisegundos):

```javascript
// 30 segundos = 30000ms
startAutoRefresh(30000);

// Para 1 minuto:
startAutoRefresh(60000);
```

## 🌐 Publicar en Internet

### Opción 1: GitHub Pages (Gratis)

1. Crea un repositorio en GitHub
2. Sube los archivos HTML, CSS y JS
3. Ve a Settings > Pages
4. Selecciona la rama main
5. Tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

### Opción 2: Netlify (Gratis)

1. Ve a [Netlify](https://www.netlify.com)
2. Arrastra la carpeta del proyecto
3. Tu sitio se publicará automáticamente

### Opción 3: Hosting propio

Sube los archivos a tu servidor web via FTP.

## 🔒 Seguridad y Permisos

### Configuración Recomendada

Para uso público del menú pero edición privada:

1. **Google Apps Script**:
   - Ejecutar como: "Yo"
   - Acceso: "Cualquier persona" (solo para lectura)

2. **Google Sheet**:
   - Compartir solo con el personal autorizado
   - No hace falta compartir públicamente

### Si Necesitas Autenticación

Modifica el código de Apps Script para requerir autenticación en métodos POST:

```javascript
function doPost(e) {
  // Verificar token de autenticación
  const token = e.parameter.token;
  if (token !== 'TU_TOKEN_SECRETO') {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'No autorizado' })
    );
  }
  // ... resto del código
}
```

## 📱 API Endpoints

### GET Endpoints

```
GET {API_URL}?action=getMenu
```
Devuelve todo el menú (todas las categorías)

```
GET {API_URL}?action=getCategoria&categoria=entrees
```
Devuelve solo una categoría (entrees, plats, desserts)

### POST Endpoints

**Agregar Item**
```json
{
  "action": "addItem",
  "data": {
    "categoria": "Entrées",
    "nombreEs": "Nuevo plato",
    "nombreEn": "New dish",
    "descripcionEs": "Descripción",
    "descripcionEn": "Description",
    "precio": 25000,
    "subcategoria": "Mar",
    "activo": true
  }
}
```

**Actualizar Item**
```json
{
  "action": "updateItem",
  "data": {
    "categoria": "Entrées",
    "id": 1,
    "precio": 30000,
    "nombreEs": "Nombre actualizado"
  }
}
```

**Eliminar Item**
```json
{
  "action": "deleteItem",
  "data": {
    "categoria": "Entrées",
    "id": 1,
    "hard": false
  }
}
```

**Toggle Activo/Inactivo**
```json
{
  "action": "toggleActivo",
  "data": {
    "categoria": "Entrées",
    "id": 1
  }
}
```

## 🐛 Solución de Problemas

### El menú no carga

1. Verifica que la URL del API esté correctamente configurada en `index.html`
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que el Google Apps Script esté desplegado como "Aplicación web"
4. Asegúrate de que el acceso esté configurado como "Cualquier persona"

### Los cambios no se reflejan

1. Espera al menos 30 segundos (tiempo de auto-refresh)
2. Recarga la página manualmente (Ctrl+F5)
3. Verifica que el plato esté marcado como "Activo = TRUE" en Google Sheets
4. Revisa los logs del Apps Script (Extensiones > Apps Script > Ejecuciones)

### Error de CORS

Si ves errores de CORS en la consola:
1. Verifica que la URL del API sea la URL de la **implementación**, no la del editor
2. La URL debe terminar en `/exec`, no en `/edit`
3. Re-despliega el Apps Script como nueva versión

### Los precios no se formatean correctamente

Verifica que en Google Sheets la columna "Precio" esté formateada como **Número** (sin símbolo de moneda).

## 💡 Tips y Mejores Prácticas

1. **Backup Regular**: Descarga una copia del Google Sheet periódicamente
2. **Historial de Versiones**: Google Sheets guarda automáticamente el historial
3. **Testing**: Prueba los cambios en una hoja de prueba primero
4. **Validación**: Asegúrate de que los precios sean números, no texto
5. **Nombres Únicos**: Usa IDs únicos para evitar duplicados

## 🎓 Próximos Pasos

Ideas para expandir el sistema:

- [ ] Panel de administración web para editar sin entrar a Google Sheets
- [ ] Imágenes de los platos
- [ ] Sistema de ofertas especiales
- [ ] Menú del día
- [ ] Filtros por alérgenos
- [ ] Versión para impresión
- [ ] Códigos QR para las mesas
- [ ] Analytics de platos más vistos
- [ ] Notificaciones de cambios

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs en Google Apps Script
3. Revisa la consola del navegador (F12)

## 📄 Licencia

Este proyecto es de código abierto. Puedes modificarlo y adaptarlo a tus necesidades.

---

**Desarrollado para Chez Manu Restaurant - Ushuaia, Tierra del Fuego**

¡Bon appétit! 🍷
#   M e n u - C h e z - M a n u  
 #   M e n u - C h e z - M a n u  
 #   M e n u - C h e z _ M a n u  
 