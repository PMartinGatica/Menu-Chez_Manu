# 📄 Generar PDF de la Carta - Instrucciones

## 🎯 Objetivo

Genera un PDF completo de toda la carta (Entrées, Plats, Desserts y Vinos) para imprimir en papel y entregar a los clientes.

---

## 🚀 Cómo Generar el PDF

### Método 1: Desde el Menú de Google Sheets (Recomendado)

1. **Abre tu Google Sheet** con los datos del menú

2. **Busca el menú "📄 Chez Manu"** en la barra superior
   - Si no aparece, recarga la página (F5)
   - El menú aparece automáticamente gracias a la función `onOpen()`

3. **Selecciona qué PDF quieres generar:**

   **PDFs Individuales (para imprimir por separado):**
   - 🖨️ **PDF: Nos Entrées** - Solo la carta de entrantes
   - 🖨️ **PDF: Nos Assiettes Principales** - Solo la carta de platos principales (La Mer y La Terre)
   - 🖨️ **PDF: Nos desserts** - Solo la carta de postres
   - 🍷 **PDF: Carta de Vinos** - Solo la carta de vinos completa

   **PDF Completo:**
   - 📄 **PDF: Carta Completa** - Todo el menú en un solo PDF

4. **Espera el mensaje** "Generando PDF..."

5. **Cuando termine**, verás un mensaje con:
   - ✅ Confirmación de éxito
   - 📁 Nombre del archivo
   - 🔗 Enlace directo al PDF

6. **Descarga el PDF** desde:
   - El enlace que te dio el mensaje
   - Tu Google Drive

### Método 2: Desde el Editor de Apps Script

1. Ve a **Extensiones > Apps Script**

2. En el menú desplegable de funciones, selecciona la función que necesites:
   - `generarPDFEntrees` - PDF de Entrées
   - `generarPDFPlats` - PDF de Plats Principaux
   - `generarPDFDesserts` - PDF de Desserts
   - `generarPDFVinos` - PDF de Vinos
   - `generarCartaCompletaPDF` - PDF Completo

3. Haz clic en **Ejecutar** (▶️)

4. Ve a tu Google Drive y busca el PDF generado

---

## 📋 Qué Incluye Cada PDF

### PDFs Individuales:

**1. Nos Entrées (Nos_Entrees_[fecha].pdf)**
- Logo de Chez Manu
- Título: "Nos Entrées"
- 4 platos de entrada con nombre en español/inglés y precio
- Diseño: Centrado, elegante, igual al PDF original

**2. Nos Assiettes Principales (Nos_Assiettes_Principales_[fecha].pdf)**
- Logo de Chez Manu
- Título: "Nos Assiettes Principales"
- Subsección "La Mer" (3 platos)
- Subsección "La Terre" (3 platos)
- Diseño: Centrado, elegante, igual al PDF original

**3. Nos desserts (Nos_desserts_[fecha].pdf)**
- Logo de Chez Manu
- Título: "Nos desserts"
- 6 postres con descripción y precio
- Diseño: Centrado, elegante, igual al PDF original

**4. Carta de Vinos (Carta_de_Vinos_[fecha].pdf)**
- Logo de Chez Manu
- Título: "Carta de Vinos"
- 35 vinos organizados por:
  - BLANCOS ARGENTINOS
    - Chardonnay (4 vinos)
    - Sauvignon Blanc (4 vinos)
    - Torrontés (2 vinos)
    - Gewürztraminer (1 vino)
  - ESPUMANTE ARGENTINO (2 vinos)
  - CHAMPAGNE (2 vinos)
  - TINTOS ARGENTINOS
    - Malbec (4 vinos)
    - Pinot Noir (4 vinos)
    - Cabernet Sauvignon (3 vinos)
    - Syrah (3 vinos)
    - Merlot (2 vinos)
    - Petit Verdot (1 vino)
    - Blends (3 vinos)
- Formato tabla: Nombre a la izquierda, precio a la derecha

### PDF Completo:

**Carta_Chez_Manu_[fecha].pdf**
- Incluye TODAS las secciones anteriores en un solo documento
- Página 1-2: Entrées, Plats, Desserts
- Página 3+: Carta de Vinos completa

### Formato del PDF:

- ✅ Márgenes profesionales (50px arriba/abajo, 70px izquierda/derecha)
- ✅ Fuente Georgia (elegante y legible)
- ✅ Colores del restaurante (borgoña #8B0000)
- ✅ Organizado por categorías y subcategorías
- ✅ Precios formateados en pesos argentinos
- ✅ Diseño listo para imprimir

---

## 🖨️ Cómo Imprimir

### Desde Google Drive:

1. **Abre el PDF** en Google Drive

2. **Haz clic en el ícono de impresora** (⎙)

3. **Configura la impresión:**
   - Tamaño: A4 o Carta
   - Orientación: Vertical
   - Márgenes: Predeterminados
   - Calidad: Alta (300dpi o superior)

4. **Imprime** o guarda como PDF local

### Recomendaciones de Impresión:

- **Papel:** Papel de alta calidad (120-160 g/m²)
- **Color:** Impresión a color (para resaltar títulos en borgoña)
- **Acabado:** Mate o brillante según preferencia
- **Protección:** Laminar o usar porta-menús

---

## 🔄 Actualizar el PDF

### Cuándo regenerar:

- ✅ Cambios de precios
- ✅ Nuevos platos o vinos
- ✅ Eliminación de items del menú
- ✅ Actualización estacional

### Proceso:

1. **Modifica los datos** en Google Sheets
2. **Genera nuevo PDF** (Menú "📄 Chez Manu" → "🖨️ Generar PDF")
3. **Descarga e imprime** la nueva versión
4. **Reemplaza** las cartas en papel del restaurante

---

## 📁 Organización de PDFs

### Nombre del archivo:

```
Carta_Chez_Manu_2025-01-14.pdf
```

- `Carta_Chez_Manu_`: Prefijo fijo
- `2025-01-14`: Fecha de generación (YYYY-MM-DD)
- `.pdf`: Extensión

### Donde se guarda:

- **Google Drive** - Carpeta raíz
- Puedes moverlo a una carpeta específica después

### Gestión de versiones:

1. Crea una carpeta en Drive: "Cartas Chez Manu - Historial"
2. Mueve los PDFs antiguos ahí
3. Mantén solo la versión actual en la raíz

---

## 🎨 Personalización del PDF

Si quieres modificar el diseño del PDF, edita estas funciones en el Apps Script:

### Cambiar márgenes:

```javascript
// En la función generarCartaCompletaPDF()
body.setMarginTop(50);    // Cambiar a 30, 40, etc.
body.setMarginBottom(50);
body.setMarginLeft(70);
body.setMarginRight(70);
```

### Cambiar tamaño de fuente:

```javascript
// Para títulos principales
header.setFontSize(24);  // Cambiar a 20, 22, 26, etc.

// Para títulos de sección
sectionTitle.setFontSize(18);  // Cambiar según preferencia

// Para items del menú
itemName.setFontSize(11);  // Cambiar según preferencia
```

### Cambiar colores:

```javascript
// Color principal (borgoña)
sectionTitle.setForegroundColor('#8B0000');

// Puedes cambiar a:
// '#003366' - Azul marino
// '#2C5F2D' - Verde elegante
// '#D4AF37' - Dorado
```

---

## ⚠️ Solución de Problemas

### "Error al generar PDF"

**Causa:** Permisos insuficientes
**Solución:**
1. Ve a Extensiones > Apps Script
2. Ejecuta manualmente `generarCartaCompletaPDF`
3. Autoriza los permisos cuando te lo pida

### "No veo el menú '📄 Chez Manu'"

**Causa:** El script no se cargó
**Solución:**
1. Recarga la página (F5)
2. Si no aparece, ve a Extensiones > Apps Script
3. Verifica que la función `onOpen()` existe
4. Ejecuta manualmente `onOpen`

### "El PDF se ve cortado al imprimir"

**Causa:** Configuración de impresora
**Solución:**
1. Ajusta los márgenes de impresión
2. Selecciona "Ajustar a la página"
3. Usa tamaño A4 o Carta según tu impresora

### "Faltan vinos en el PDF"

**Causa:** Vinos marcados como "Activo = FALSE"
**Solución:**
1. Ve a la hoja "Vinos" en Google Sheets
2. Verifica que la columna "Activo" = TRUE
3. Regenera el PDF

---

## 📊 Diferencias: Digital vs Papel

| Aspecto | Carta Digital (Web) | Carta PDF (Papel) |
|---------|---------------------|-------------------|
| **Actualización** | Instantánea (auto-refresh) | Manual (reimprimir) |
| **Acceso** | Móvil/Tablet | Papel físico |
| **Costo** | Gratis | Costo de impresión |
| **Interactividad** | Navegación por categorías | Hojear páginas |
| **Ideal para** | Meseros, cliente tech-savvy | Clientes tradicionales |

### Recomendación:

**Usar ambas:**
- 📱 **Digital:** Para meseros y clientes que prefieren dispositivos
- 📄 **Papel:** Para clientes tradicionales y ambiente del restaurante

---

## 🎯 Tips de Uso

### Para el Personal:

1. **Regenera el PDF semanalmente** aunque no haya cambios (para tener versión fresca)
2. **Mantén 2-3 copias impresas** de respaldo
3. **Protege las cartas** con porta-menús o laminación
4. **Archiva versiones anteriores** para referencia

### Para Cambios de Precios:

1. Actualiza en Google Sheets
2. Espera 5 minutos (para que se actualice el digital)
3. Genera nuevo PDF
4. Imprime y reemplaza

### Para Menú Estacional:

1. Desactiva items antiguos (Activo = FALSE)
2. Agrega nuevos items
3. Genera PDF con el nombre: `Carta_Chez_Manu_Verano_2025.pdf`

---

## 📞 Soporte

Si tienes problemas para generar el PDF:

1. Verifica que todas las hojas tengan datos
2. Revisa que no haya errores en el Apps Script (Ejecuciones)
3. Intenta regenerar después de 5 minutos

---

**¡Tu carta está lista para imprimir!** 📄🍷

Recuerda: El PDF se genera automáticamente con los datos actuales de Google Sheets, así que siempre tendrás la información más reciente.
