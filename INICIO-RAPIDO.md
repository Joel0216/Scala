# ⚡ INICIO RÁPIDO - SCALA ELECTRON

## 🎯 3 PASOS PARA EJECUTAR LA APLICACIÓN

### PASO 1: Instalar Node.js (Solo la primera vez)

1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS**
3. Instala con las opciones por defecto
4. Reinicia tu computadora

---

### PASO 2: Instalar Dependencias (Solo la primera vez)

1. Abre **PowerShell** en la carpeta del proyecto:
   - Abre la carpeta `C:\Users\PC05\Downloads\Scala`
   - Haz clic en la barra de direcciones
   - Escribe `powershell` y presiona Enter

2. Copia y pega este comando:
```bash
npm install
```

3. Espera 5-10 minutos a que termine

---

### PASO 3: Ejecutar la Aplicación

```bash
npm start
```

¡Listo! La aplicación se abrirá en una ventana.

---

## 🔨 COMPILAR A .EXE

Para crear un archivo .exe que puedas distribuir:

```bash
npm run build:portable
```

El archivo estará en: `dist/Scala-Portable-1.0.0.exe`

---

## 📚 DOCUMENTACIÓN COMPLETA

- **INSTRUCCIONES-ELECTRON.md** - Guía paso a paso detallada
- **RESUMEN-FINAL-ELECTRON.md** - Resumen completo del proyecto
- **COMO-EJECUTAR-EL-PROGRAMA.md** - Guía de uso de la aplicación

---

## ❓ PROBLEMAS COMUNES

### "npm no se reconoce"
→ Instala Node.js y reinicia PowerShell

### "Cannot find module"
→ Ejecuta: `npm install`

### La aplicación no abre
→ Verifica que estés en la carpeta correcta:
```bash
cd C:\Users\PC05\Downloads\Scala
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

1. Ejecuta `npm start`
2. La ventana debe abrir
3. Haz clic en "ARCHIVOS"
4. Haz clic en "Alumnos"
5. Presiona F12 para ver la consola
6. Debe decir: "Supabase inicializado correctamente"

---

## 🎉 ¡ESO ES TODO!

Tu aplicación SCALA está lista para usar.

**Comandos importantes:**
- `npm start` - Ejecutar aplicación
- `npm run build:portable` - Crear .exe
- `F12` - Abrir DevTools
- `Ctrl + R` - Recargar aplicación
