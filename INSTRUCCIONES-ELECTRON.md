# 📦 Guía Completa: Convertir Scala a Aplicación de Escritorio

## ✅ Archivos Creados

Ya he creado los siguientes archivos en tu proyecto:
- `package.json` - Configuración del proyecto y scripts
- `main.js` - Archivo principal de Electron
- `.gitignore` - Archivos a ignorar
- `supabase-config.js` - Actualizado para funcionar con Electron

## 🚀 Paso 1: Instalar Dependencias

Abre tu terminal (CMD o PowerShell) en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará:
- `electron` - Framework para crear la app de escritorio
- `electron-builder` - Para empaquetar la aplicación
- `@supabase/supabase-js` - Cliente de Supabase para npm

**Tiempo estimado:** 2-5 minutos dependiendo de tu conexión.

## 🎯 Paso 2: Probar la Aplicación en Modo Desarrollo

Antes de empaquetar, prueba que todo funcione:

```bash
npm start
```

Esto abrirá tu aplicación Scala en una ventana de Electron.

**Verifica:**
- ✅ La ventana se abre en 1280x800
- ✅ No hay barra de menú visible
- ✅ Puedes navegar por todas las secciones
- ✅ Supabase se conecta correctamente

## 📦 Paso 3: Empaquetar la Aplicación

### Opción A: Crear TODOS los formatos (Instalador + Portable + ZIP)

```bash
npm run build:win
```

Esto generará en la carpeta `dist/`:
- `Scala Setup 1.0.0.exe` - Instalador completo
- `Scala-Portable-1.0.0.exe` - Versión portable (no requiere instalación)
- `Scala-1.0.0-win.zip` - Archivo ZIP con la aplicación

### Opción B: Solo Versión Portable (Recomendado para USB)

```bash
npm run build:portable
```

Genera solo: `Scala-Portable-1.0.0.exe`

**Tiempo estimado:** 3-10 minutos

## 📤 Paso 4: Distribuir la Aplicación

### Para USB o Correo:
1. Ve a la carpeta `dist/`
2. Copia `Scala-Portable-1.0.0.exe`
3. Envía este archivo (aproximadamente 100-150 MB)

### Para Instalación:
1. Usa `Scala Setup 1.0.0.exe`
2. Los usuarios hacen doble clic y siguen el asistente
3. Se crea acceso directo en el escritorio

## 🔧 Configuración de Supabase

### ✅ Opción Recomendada: Usar CDN (Ya configurado)

Tu proyecto ya está configurado para usar Supabase vía CDN. **No necesitas cambiar nada.**

El archivo `supabase-config.js` ahora detecta automáticamente:
- Si está en navegador → usa CDN
- Si está en Electron → usa npm

### Ventajas del CDN:
- ✅ Más simple
- ✅ Menos tamaño de la app
- ✅ Ya funciona en tu proyecto actual

### Si prefieres usar npm (Opcional):

1. En tus archivos HTML, **elimina** esta línea:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

2. El `supabase-config.js` automáticamente usará la versión npm

## 🎨 Personalización

### Cambiar el Icono:
1. Reemplaza `Scala logo.png` con tu icono (formato PNG, 256x256 o 512x512)
2. O convierte a `.ico` y actualiza en `package.json`:
```json
"icon": "icon.ico"
```

### Cambiar el Tamaño de Ventana:
Edita `main.js`, líneas 10-11:
```javascript
width: 1280,  // Ancho
height: 800,  // Alto
```

### Cambiar el Nombre de la App:
Edita `package.json`, línea 2:
```json
"name": "tu-nombre-app",
```

## 🐛 Solución de Problemas

### Error: "npm no reconocido"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "electron-builder failed"
**Solución:** 
```bash
npm install --save-dev electron-builder
npm run build:win
```

### La app no se conecta a Supabase
**Solución:**
1. Abre DevTools (descomenta línea 30 en `main.js`)
2. Verifica errores en la consola
3. Confirma que `supabase-config.js` se carga correctamente

### Ventana muy pequeña/grande
**Solución:** Ajusta `width` y `height` en `main.js`

## 📋 Scripts Disponibles

```bash
npm start              # Ejecutar en modo desarrollo
npm run build          # Empaquetar (todos los formatos)
npm run build:win      # Empaquetar para Windows
npm run build:portable # Solo versión portable
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE: Protege tus Credenciales

Tu `SUPABASE_ANON_KEY` está visible en el código. Para producción:

1. **Configura Row Level Security (RLS)** en Supabase
2. **Limita permisos** de la Anon Key
3. **Considera usar variables de entorno** para keys sensibles

### Configurar Variables de Entorno (Opcional):

1. Crea archivo `.env`:
```
SUPABASE_URL=tu_url
SUPABASE_KEY=tu_key
```

2. Instala dotenv:
```bash
npm install dotenv
```

3. En `main.js`, agrega al inicio:
```javascript
require('dotenv').config();
```

## 📊 Tamaños Aproximados

- **Instalador:** ~120 MB
- **Portable:** ~150 MB
- **ZIP:** ~100 MB (comprimido)

## ✅ Checklist Final

Antes de distribuir, verifica:

- [ ] La app abre correctamente
- [ ] Todas las secciones funcionan
- [ ] Supabase se conecta
- [ ] No hay errores en consola
- [ ] El icono se ve bien
- [ ] La versión portable funciona sin instalación
- [ ] Probaste en otra computadora

## 🎉 ¡Listo!

Tu aplicación Scala ahora es una app de escritorio profesional para Windows.

**Próximos pasos:**
- Comparte el `.exe` portable por USB o correo
- O distribuye el instalador para instalación completa
- Considera crear un sitio web para descargas

---

**¿Necesitas ayuda?** Revisa la sección de Solución de Problemas o consulta la documentación de Electron: https://www.electronjs.org/
