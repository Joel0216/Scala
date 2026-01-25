# 🚀 GUÍA COMPLETA: CONVERTIR SCALA A APLICACIÓN ELECTRON

## 📋 ÍNDICE
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de Node.js](#instalación-de-nodejs)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Probar la Aplicación](#probar-la-aplicación)
5. [Compilar a .EXE](#compilar-a-exe)
6. [Distribución](#distribución)
7. [Solución de Problemas](#solución-de-problemas)

---

## 1. REQUISITOS PREVIOS

### ✅ Lo que necesitas:
- Windows 10 o superior
- Conexión a Internet (para instalación)
- 500 MB de espacio libre en disco
- Permisos de administrador (para instalación)

### ✅ Archivos ya creados:
- ✅ `main.js` - Proceso principal de Electron
- ✅ `preload.js` - Script de precarga
- ✅ `package.json` - Configuración del proyecto
- ✅ `supabase-config.js` - Configuración de base de datos

---

## 2. INSTALACIÓN DE NODE.JS

### Paso 1: Descargar Node.js

1. Abre tu navegador
2. Ve a: **https://nodejs.org/**
3. Descarga la versión **LTS** (Long Term Support)
   - Ejemplo: Node.js 20.x.x LTS
4. Ejecuta el instalador descargado

### Paso 2: Instalar Node.js

1. Haz doble clic en el instalador
2. Acepta los términos de licencia
3. Deja las opciones por defecto
4. Asegúrate de marcar: **"Automatically install the necessary tools"**
5. Haz clic en **"Install"**
6. Espera a que termine (puede tomar 5-10 minutos)

### Paso 3: Verificar Instalación

1. Abre **PowerShell** o **CMD**
   - Presiona `Windows + R`
   - Escribe `powershell` o `cmd`
   - Presiona Enter

2. Escribe estos comandos:
```bash
node --version
```
Debe mostrar algo como: `v20.11.0`

```bash
npm --version
```
Debe mostrar algo como: `10.2.4`

Si ves los números de versión, ¡Node.js está instalado correctamente! ✅

---

## 3. CONFIGURACIÓN DEL PROYECTO

### Paso 1: Abrir PowerShell en la carpeta del proyecto

1. Abre el Explorador de Windows
2. Navega a: `C:\Users\PC05\Downloads\Scala`
3. Haz clic en la barra de direcciones
4. Escribe `powershell` y presiona Enter

### Paso 2: Instalar Dependencias

Copia y pega estos comandos uno por uno:

```bash
npm install electron --save-dev
```
Espera a que termine (puede tomar 2-3 minutos)

```bash
npm install electron-builder --save-dev
```
Espera a que termine (puede tomar 2-3 minutos)

```bash
npm install @supabase/supabase-js --save
```
Espera a que termine (puede tomar 1 minuto)

### Paso 3: Verificar Instalación

```bash
npm list --depth=0
```

Debes ver algo como:
```
scala-app@1.0.0
├── @supabase/supabase-js@2.39.0
├── electron@28.0.0
└── electron-builder@24.9.1
```

---

## 4. PROBAR LA APLICACIÓN

### Ejecutar en Modo Desarrollo

```bash
npm start
```

Esto abrirá la aplicación SCALA en una ventana de Electron.

### ✅ Verificar que funciona:

1. **Ventana se abre correctamente**
   - Debe mostrar el menú principal de SCALA
   - Logo visible
   - Fecha y hora actualizándose

2. **Navegación funciona**
   - Haz clic en "ARCHIVOS"
   - Debe abrir el menú de archivos
   - Botón "TERMINAR" debe regresar al inicio

3. **Conexión a Supabase**
   - Abre DevTools (presiona F12)
   - Ve a la pestaña "Console"
   - Debe decir: "Supabase inicializado correctamente"

4. **Módulos funcionan**
   - Prueba abrir "Alumnos"
   - Prueba abrir "Maestros"
   - Prueba abrir "Reportes"

### 🐛 Si algo no funciona:

- Presiona `Ctrl + R` para recargar
- Presiona `F12` para ver errores en la consola
- Cierra y vuelve a ejecutar `npm start`

---

## 5. COMPILAR A .EXE

### Opción A: Instalador Completo

```bash
npm run build
```

Esto creará:
- `dist/Scala Setup 1.0.0.exe` - Instalador completo
- Tamaño: ~150-200 MB
- El usuario lo ejecuta y se instala en su PC

### Opción B: Versión Portable (Recomendado)

```bash
npm run build:portable
```

Esto creará:
- `dist/Scala-Portable-1.0.0.exe` - Ejecutable portable
- Tamaño: ~150-200 MB
- El usuario lo ejecuta directamente, sin instalación

### Opción C: Archivo ZIP

```bash
npm run build:win
```

Esto creará:
- `dist/Scala-1.0.0-win.zip` - Archivo comprimido
- Tamaño: ~50-70 MB comprimido
- El usuario descomprime y ejecuta `Scala.exe`

### ⏱️ Tiempo de Compilación

- Primera vez: 10-15 minutos
- Compilaciones siguientes: 3-5 minutos

### 📁 Ubicación de Archivos

Todos los archivos compilados estarán en:
```
C:\Users\PC05\Downloads\Scala\dist\
```

---

## 6. DISTRIBUCIÓN

### Opción 1: Versión Portable (Más Fácil)

1. Compila la versión portable:
```bash
npm run build:portable
```

2. Encuentra el archivo:
```
dist/Scala-Portable-1.0.0.exe
```

3. Comparte este archivo:
   - Súbelo a Google Drive / Dropbox / OneDrive
   - Envíalo por correo (si es menor a 25 MB)
   - Usa WeTransfer para archivos grandes

4. El usuario:
   - Descarga el archivo
   - Lo ejecuta directamente
   - ¡Listo! No necesita instalación

### Opción 2: Instalador

1. Compila el instalador:
```bash
npm run build
```

2. Encuentra el archivo:
```
dist/Scala Setup 1.0.0.exe
```

3. El usuario:
   - Descarga el instalador
   - Lo ejecuta
   - Sigue el asistente de instalación
   - Se crea acceso directo en el escritorio

### Opción 3: Archivo ZIP

1. Compila y comprime:
```bash
npm run build:win
```

2. Encuentra el archivo:
```
dist/Scala-1.0.0-win.zip
```

3. El usuario:
   - Descarga el ZIP
   - Lo descomprime
   - Ejecuta `Scala.exe`

---

## 7. SOLUCIÓN DE PROBLEMAS

### ❌ Error: "npm no se reconoce"

**Causa:** Node.js no está instalado o no está en el PATH

**Solución:**
1. Reinstala Node.js desde https://nodejs.org/
2. Reinicia PowerShell
3. Verifica con `node --version`

---

### ❌ Error: "Cannot find module 'electron'"

**Causa:** Las dependencias no están instaladas

**Solución:**
```bash
npm install
```

---

### ❌ Error: "ENOENT: no such file or directory"

**Causa:** Estás en la carpeta incorrecta

**Solución:**
```bash
cd C:\Users\PC05\Downloads\Scala
```

---

### ❌ La aplicación no se conecta a Supabase

**Causa:** Credenciales incorrectas o sin internet

**Solución:**
1. Verifica `supabase-config.js`
2. Verifica tu conexión a Internet
3. Abre DevTools (F12) y revisa errores

---

### ❌ Error al compilar: "electron-builder not found"

**Causa:** electron-builder no está instalado

**Solución:**
```bash
npm install electron-builder --save-dev
```

---

### ❌ El .exe no se genera

**Causa:** Puede haber errores en el código

**Solución:**
1. Primero prueba con `npm start`
2. Si funciona, intenta compilar de nuevo
3. Revisa los logs de error

---

### ❌ El .exe es muy grande (>300 MB)

**Causa:** Electron incluye Chromium completo

**Solución:**
- Es normal, Electron pesa ~150-200 MB
- Usa la versión ZIP para reducir tamaño
- Considera usar compresión adicional (7-Zip)

---

### ❌ Windows Defender bloquea el .exe

**Causa:** Archivos sin firma digital son marcados como sospechosos

**Solución:**
1. Haz clic en "Más información"
2. Haz clic en "Ejecutar de todas formas"
3. Para distribución profesional, considera firmar el código

---

## 📊 RESUMEN DE COMANDOS

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar instalador
npm run build

# Compilar versión portable
npm run build:portable

# Compilar todas las versiones
npm run build:win

# Limpiar compilaciones anteriores
rmdir /s /q dist
```

---

## 🎯 CHECKLIST FINAL

Antes de distribuir, verifica:

- [ ] La aplicación se ejecuta con `npm start`
- [ ] Todos los módulos funcionan correctamente
- [ ] La conexión a Supabase funciona
- [ ] Los botones responden correctamente
- [ ] La navegación funciona
- [ ] El .exe se compila sin errores
- [ ] El .exe se ejecuta en otra PC
- [ ] El tamaño del archivo es razonable
- [ ] Tienes un método de distribución (Drive, etc.)

---

## 📞 SOPORTE ADICIONAL

### Recursos Útiles:

- **Documentación de Electron:** https://www.electronjs.org/docs
- **Documentación de electron-builder:** https://www.electron.build/
- **Supabase Docs:** https://supabase.com/docs

### Logs de Error:

Si encuentras errores, revisa:
1. Console de DevTools (F12)
2. Terminal donde ejecutaste `npm start`
3. Archivo de logs en `%APPDATA%\Scala\logs\`

---

## ✅ ¡LISTO!

Ahora tienes una aplicación de escritorio profesional que puedes distribuir a tus usuarios.

**Ventajas de tu aplicación Electron:**
- ✅ No necesita navegador
- ✅ Icono personalizado
- ✅ Menú de aplicación
- ✅ Atajos de teclado
- ✅ Funciona offline (excepto Supabase)
- ✅ Fácil de distribuir
- ✅ Profesional y nativa

---

**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0  
**Sistema:** SCALA - Academia de Música
