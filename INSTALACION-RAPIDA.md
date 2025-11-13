# ⚡ Instalación Rápida - Chez Manu

## Resumen en 7 Pasos

### 1️⃣ Crear Google Sheet
- Ve a [sheets.google.com](https://sheets.google.com)
- Nueva hoja → Nómbrala "Chez Manu - Menu"

### 2️⃣ Abrir Apps Script
- En tu Sheet: **Extensiones > Apps Script**

### 3️⃣ Copiar el código
- Copia todo el contenido de `google-apps-script.js`
- Pégalo en el editor (reemplaza el código existente)
- Guarda (Ctrl+S)

### 4️⃣ Inicializar
En el editor de Apps Script:
```
1. Selecciona función: inicializarHojas
2. Click en Ejecutar ▶️
3. Autoriza cuando te lo pida
4. Selecciona función: poblarDatosIniciales
5. Click en Ejecutar ▶️
```

### 5️⃣ Desplegar
```
1. Click en "Implementar" > "Nueva implementación"
2. Icono engranaje ⚙️ > "Aplicación web"
3. Ejecutar como: "Yo"
4. Acceso: "Cualquier persona"
5. Click "Implementar"
6. 📋 COPIA LA URL (termina en /exec)
```

### 6️⃣ Configurar Frontend
Abre `index.html` y busca:
```javascript
const API_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
```

Reemplaza con tu URL:
```javascript
const API_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```

### 7️⃣ Probar
- Abre `index.html` en tu navegador
- Deberías ver el menú completo
- Cambia un precio en Google Sheets
- Espera 30 seg o recarga → ¡Debería actualizarse!

---

## ✅ Checklist de Verificación

- [ ] Google Sheet creado con 3 hojas (Entrées, Plats Principaux, Desserts)
- [ ] Datos iniciales cargados en las hojas
- [ ] Apps Script desplegado como Web App
- [ ] URL copiada y pegada en index.html
- [ ] index.html abre sin errores en el navegador
- [ ] El menú se visualiza correctamente
- [ ] Los cambios en Sheets se reflejan en el frontend

---

## 🚨 Problemas Comunes

**No carga el menú**
- Verifica que la URL en index.html sea la correcta
- La URL debe terminar en `/exec`
- Abre F12 y mira la consola

**No se actualizan los cambios**
- Espera 30 segundos
- Recarga con Ctrl+F5
- Verifica que "Activo" = TRUE en Google Sheets

**Error "Script no autorizado"**
- En Apps Script: Implementar > Administrar implementaciones
- Verifica que "Acceso" = "Cualquier persona"

---

## 📞 ¿Necesitas Ayuda?

1. Lee el [README.md](README.md) completo
2. Revisa la sección "Solución de Problemas"
3. Verifica los logs en Google Apps Script (Ejecuciones)

---

**¡Listo para usar!** 🎉
