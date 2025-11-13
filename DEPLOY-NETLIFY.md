# 🚀 Desplegar en Netlify

## Método 1: Arrastra y Suelta (Más Fácil)

1. **Ve a Netlify:**
   - Abre https://app.netlify.com/drop

2. **Arrastra la carpeta:**
   - Arrastra toda la carpeta del proyecto a la zona de drop
   - Netlify subirá automáticamente todos los archivos

3. **Espera el deploy:**
   - En unos segundos tendrás tu URL (ej: `https://random-name-123.netlify.app`)

4. **Configura un dominio personalizado (Opcional):**
   - En el dashboard de Netlify: Site settings → Domain management
   - Cambia el nombre a algo como `carta-chez-manu.netlify.app`

## Método 2: Desde GitHub (Recomendado para actualizaciones automáticas)

### Paso 1: Subir a GitHub

1. **Inicializa Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Chez Manu Menu"
   ```

2. **Crea el repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre: `Menu-Chez-Manu`
   - NO agregues README, .gitignore ni license

3. **Sube el código:**
   ```bash
   git remote add origin https://github.com/TU-USUARIO/Menu-Chez-Manu.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Conectar con Netlify

1. **Login en Netlify:**
   - Ve a https://app.netlify.com

2. **Import from Git:**
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "GitHub"
   - Autoriza Netlify si es necesario

3. **Selecciona el repositorio:**
   - Busca `Menu-Chez-Manu`
   - Click en el repositorio

4. **Configuración del build:**
   - Build command: (dejar vacío)
   - Publish directory: `.` (punto)
   - Click en "Deploy site"

5. **Espera el deploy:**
   - En 1-2 minutos tu sitio estará en línea

## Configuración del Proxy

El archivo `netlify.toml` ya está configurado con:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://script.google.com/.../exec:splat"
  status = 200
  force = true
```

Esto evita problemas de CORS redirigiendo las peticiones a través del servidor de Netlify.

## Verificación del Deploy

Después del deploy, verifica que todo funcione:

1. **Abre tu sitio:**
   - Ve a la URL que te dio Netlify

2. **Abre la consola del navegador (F12):**
   - No deberías ver errores de CORS
   - Deberías ver el mensaje: "Menú cargado correctamente"

3. **Verifica el menú:**
   - Deberías ver todas las categorías
   - Los platos deberían aparecer correctamente
   - Los precios formateados

## Actualizaciones Automáticas (Solo Método 2)

Si usaste GitHub, cada vez que hagas push el sitio se actualizará automáticamente:

```bash
# Hacer cambios en los archivos
git add .
git commit -m "Actualización del menú"
git push
```

Netlify detectará el push y redesplegará automáticamente en 1-2 minutos.

## Cambiar el Nombre del Sitio

1. Ve a tu sitio en Netlify
2. Site settings → General → Site details
3. Click en "Change site name"
4. Ingresa: `carta-chez-manu` (o el que prefieras)
5. Tu URL será: `https://carta-chez-manu.netlify.app`

## Dominio Personalizado (Opcional)

Si tienes un dominio propio (ej: `menu.chezmanu.com`):

1. **En Netlify:**
   - Site settings → Domain management
   - Add custom domain
   - Ingresa tu dominio

2. **En tu proveedor de DNS:**
   - Agrega un registro CNAME:
     - Name: `menu` (o el subdominio que quieras)
     - Value: `carta-chez-manu.netlify.app`

3. **Espera la propagación:**
   - Puede tomar de minutos a horas

## Variables de Entorno (Avanzado)

Si quieres ocultar la URL del Google Apps Script:

1. **En Netlify:**
   - Site settings → Environment variables
   - Add variable:
     - Key: `API_URL`
     - Value: `https://script.google.com/macros/s/...`

2. **Modifica index.html:**
   ```javascript
   // En lugar de la URL hardcodeada
   const API_URL = window.ENV?.API_URL || 'URL_FALLBACK';
   ```

## Troubleshooting

### El menú no carga

1. Abre F12 y mira la consola
2. Verifica que la URL del API sea correcta
3. Verifica que el Google Apps Script esté desplegado como "Web App"

### Error 404 en /api/

1. Verifica que `netlify.toml` esté en la raíz del proyecto
2. Re-deploya el sitio
3. Verifica que el archivo `_redirects` también esté presente

### El proxy no funciona

1. En modo local, usa `demo-local.html` que no necesita proxy
2. Verifica la URL del Google Apps Script
3. Re-despliega el Apps Script si hiciste cambios

## Monitoreo

Netlify te envía notificaciones por email de:
- ✅ Deploy exitoso
- ❌ Deploy fallido
- 🔄 Build en progreso

## Costos

- **Plan Free de Netlify:**
  - 100GB bandwidth/mes
  - 300 build minutes/mes
  - Más que suficiente para un menú de restaurante

---

**¡Listo!** Tu menú digital estará disponible 24/7 con actualizaciones automáticas desde Google Sheets.

📱 Comparte el link con códigos QR en las mesas del restaurante.
