# 🚀 CONVERTIR SCALA A APLICACIÓN ELECTRON (.EXE)

## 📋 GUÍA COMPLETA PASO A PASO

---

## PASO 1: INSTALAR NODE.JS Y NPM

### 1.1 Descargar Node.js
1. Ve a: https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador
4. Acepta todas las opciones por defecto
5. Verifica la instalación:
```bash
node --version
npm --version
```

---

## PASO 2: PREPARAR EL PROYECTO

### 2.1 Abrir PowerShell en la carpeta del proyecto
```bash
cd C:\Users\PC05\Downloads\Scala
```

### 2.2 Inicializar proyecto Node.js
```bash
npm init -y
```

### 2.3 Instalar dependencias
```bash
npm install electron --save-dev
npm install electron-builder --save-dev
npm install @supabase/supabase-js --save
```

---

## PASO 3: CREAR ARCHIVOS DE CONFIGURACIÓN

Los archivos ya están creados en tu proyecto:
- ✅ `main.js` - Archivo principal de Electron
- ✅ `preload.js` - Script de precarga
- ✅ `package.json` - Configuración actualizada

---

## PASO 4: ACTUALIZAR SUPABASE-CONFIG.JS

El archivo ya está actualizado para funcionar con Electron.

---

## PASO 5: PROBAR LA APLICACIÓN

### 5.1 Ejecutar en modo desarrollo
```bash
npm start
```

Esto abrirá la aplicación en una ventana de Electron.

### 5.2 Verificar que funciona
- ✅ Debe abrir el menú principal
- ✅ Debe poder navegar entre módulos
- ✅ Debe conectarse a Supabase

---

## PASO 6: COMPILAR A .EXE

### 6.1 Compilar para Windows
```bash
npm run build
```

### 6.2 Ubicación del .exe
El archivo se generará en:
```
C:\Users\PC05\Downloads\Scala\dist\Scala Setup 1.0.0.exe
```

### 6.3 Crear versión portable (sin instalador)
```bash
npm run build:portable
```

Esto creará un ZIP con la aplicación lista para descomprimir y ejecutar.

---

## PASO 7: DISTRIBUIR LA APLICACIÓN

### Opción A: Instalador (.exe)
- Archivo: `dist/Scala Setup 1.0.0.exe`
- Tamaño: ~150-200 MB
- El usuario lo ejecuta y se instala en su PC

### Opción B: Versión Portable (ZIP)
- Archivo: `dist/Scala-1.0.0-win.zip`
- Tamaño: ~150-200 MB
- El usuario descomprime y ejecuta `Scala.exe`

---

## 📁 ESTRUCTURA DEL PROYECTO ELECTRON

```
Scala/
├── main.js              ← Proceso principal de Electron
├── preload.js           ← Script de precarga
├── package.json         ← Configuración del proyecto
├── supabase-config.js   ← Configuración de Supabase (actualizada)
├── index.html           ← Punto de entrada
├── *.html               ← Todas tus páginas
├── *.js                 ← Todos tus scripts
├── *.css                ← Todos tus estilos
└── dist/                ← Carpeta con el .exe compilado
```

---

## 🔧 CARACTERÍSTICAS DE LA APLICACIÓN ELECTRON

### ✅ Ventajas
- Aplicación nativa de Windows (.exe)
- No necesita navegador
- Icono personalizado
- Menú de aplicación
- Atajos de teclado
- Puede ejecutarse sin internet (excepto Supabase)

### ✅ Funcionalidades Incluidas
- Navegación entre páginas HTML
- Conexión a Supabase
- Todos los módulos funcionando
- DevTools para debugging (F12)
- Actualización automática de fecha/hora

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "npm no se reconoce"
**Solución:** Node.js no está instalado o no está en el PATH
1. Reinstala Node.js
2. Reinicia PowerShell

### Error: "Cannot find module 'electron'"
**Solución:** 
```bash
npm install
```

### Error: "ENOENT: no such file or directory"
**Solución:** Verifica que estás en la carpeta correcta
```bash
cd C:\Users\PC05\Downloads\Scala
```

### La aplicación no se conecta a Supabase
**Solución:** Verifica las credenciales en `supabase-config.js`

### El .exe no se genera
**Solución:** 
```bash
npm install electron-builder --save-dev
npm run build
```

---

## 📦 TAMAÑO DE LA APLICACIÓN

- **Desarrollo:** ~300 MB (incluye node_modules)
- **Compilado:** ~150-200 MB (solo lo necesario)
- **Comprimido (ZIP):** ~50-70 MB

---

## 🚀 COMANDOS ÚTILES

```bash
# Ejecutar en modo desarrollo
npm start

# Compilar para Windows (instalador)
npm run build

# Compilar versión portable
npm run build:portable

# Limpiar compilaciones anteriores
npm run clean

# Ver logs de compilación
npm run build -- --verbose
```

---

## 📝 PERSONALIZACIÓN

### Cambiar el icono
1. Crea un archivo `icon.ico` (256x256 px)
2. Colócalo en la carpeta raíz
3. Actualiza `package.json`:
```json
"build": {
  "win": {
    "icon": "icon.ico"
  }
}
```

### Cambiar el nombre de la aplicación
Edita `package.json`:
```json
{
  "name": "scala",
  "productName": "SCALA - Academia de Música",
  "version": "1.0.0"
}
```

### Cambiar el tamaño de la ventana
Edita `main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // ← Cambiar aquí
  height: 900,  // ← Cambiar aquí
  // ...
});
```

---

## ✅ CHECKLIST DE CONVERSIÓN

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Aplicación probada (`npm start`)
- [ ] Compilación exitosa (`npm run build`)
- [ ] .exe generado en `dist/`
- [ ] Aplicación probada en otra PC
- [ ] Conexión a Supabase funciona
- [ ] Todos los módulos funcionan

---

## 🎯 RESULTADO FINAL

Tendrás una aplicación de escritorio profesional:

```
Scala Setup 1.0.0.exe  (Instalador)
  o
Scala-1.0.0-win.zip    (Portable)
```

Que el usuario puede:
1. Descargar
2. Instalar o descomprimir
3. Ejecutar
4. Usar sin necesidad de navegador

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs de compilación
2. Verifica que todas las dependencias estén instaladas
3. Prueba primero con `npm start`
4. Revisa la consola de DevTools (F12)

---

¡Listo! Tu aplicación web ahora es una aplicación de escritorio nativa para Windows 🎉

