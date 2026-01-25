# ⚡ EJECUTAR SCALA CON ELECTRON

## 🚀 INICIO RÁPIDO

### Paso 1: Abrir PowerShell en la carpeta del proyecto

1. Abre la carpeta: `C:\Users\PC05\Downloads\Scala`
2. Haz clic en la barra de direcciones
3. Escribe `powershell` y presiona Enter

### Paso 2: Ejecutar la aplicación

```bash
npm start
```

¡Listo! La aplicación se abrirá en una ventana de Electron.

---

## ✅ VERIFICAR QUE FUNCIONA

### 1. La ventana debe abrirse
- Debe mostrar el menú principal de SCALA
- Logo visible
- Fecha y hora actualizándose

### 2. Abrir DevTools (F12)
- Presiona `F12` para abrir la consola
- Debe decir: **"✓ Supabase inicializado correctamente (Electron/npm)"**
- NO debe haber errores en rojo

### 3. Probar un módulo
1. Haz clic en "ARCHIVOS"
2. Haz clic en "FACTORES"
3. Los dropdowns deben mostrar opciones
4. Los campos deben permitir escribir
5. Los botones deben funcionar

---

## 🐛 SI NO FUNCIONA

### Error: "npm no se reconoce"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module '@supabase/supabase-js'"
**Solución:**
```bash
npm install
```

### Error: "La aplicación no abre"
**Solución:**
```bash
npm install electron --save-dev
npm start
```

### Los campos no se pueden editar
**Solución:** Verifica en la consola (F12) que diga:
```
✓ Supabase inicializado correctamente (Electron/npm)
```

Si dice "CDN" en lugar de "npm", ejecuta:
```bash
powershell -ExecutionPolicy Bypass -File fix-html-for-electron.ps1
```

---

## 📊 ESTADO DE LA APLICACIÓN

### ✅ Configurado para Electron:
- ✅ `main.js` - Proceso principal
- ✅ `preload.js` - Script de precarga
- ✅ `package.json` - Configuración
- ✅ `supabase-config.js` - Usa npm en Electron
- ✅ Archivos HTML - Sin CDN, usan npm

### ✅ Módulos funcionando:
- ✅ ARCHIVOS (8 submódulos)
- ✅ SEGURIDAD
- ✅ REPORTES
- ✅ MANTENIMIENTO
- ✅ CAJA (básico)

---

## 🎯 PROBAR MÓDULOS

### ARCHIVOS > FACTORES
```
1. npm start
2. Clic en "ARCHIVOS"
3. Clic en "FACTORES"
4. Selecciona un maestro
5. Selecciona un curso
6. Escribe un factor (ej: 50)
7. Clic en "Nuevo"
8. Debe decir "Factor guardado correctamente"
```

### ARCHIVOS > PROSPECTOS
```
1. npm start
2. Clic en "ARCHIVOS"
3. Clic en "Reg Prospectos"
4. Debe generar ID automáticamente
5. Llena nombre y datos
6. Clic en "Nuevo"
7. Debe guardar correctamente
```

### ARCHIVOS > SALONES
```
1. npm start
2. Clic en "ARCHIVOS"
3. Clic en "SALONES"
4. Escribe número de salón
5. Escribe ubicación
6. Clic en "Nuevo"
7. Debe guardar correctamente
```

---

## 🔧 COMANDOS ÚTILES

```bash
# Ejecutar aplicación
npm start

# Reinstalar dependencias
npm install

# Compilar a .exe
npm run build:portable

# Ver versión de Node
node --version

# Ver versión de npm
npm --version

# Limpiar y reinstalar
rmdir /s /q node_modules
npm install
```

---

## 📝 NOTAS IMPORTANTES

1. **Conexión a Internet:** Necesaria para conectar a Supabase
2. **Base de datos:** Debe estar creada en Supabase
3. **Credenciales:** Verificadas en `supabase-config.js`
4. **DevTools:** Presiona F12 para ver la consola y errores

---

## ✅ CHECKLIST

Antes de usar la aplicación:

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos creada en Supabase
- [ ] Aplicación ejecutada (`npm start`)
- [ ] Consola muestra "Supabase inicializado (Electron/npm)"
- [ ] Campos permiten escribir
- [ ] Botones funcionan

---

## 🎉 ¡LISTO!

Tu aplicación SCALA ahora funciona como aplicación de escritorio con Electron.

**Ventajas:**
- ✅ No necesita navegador
- ✅ Ventana nativa de Windows
- ✅ Menú de aplicación
- ✅ Atajos de teclado (F12, F5, F11)
- ✅ Icono personalizado
- ✅ Puede compilarse a .exe

---

**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para usar
