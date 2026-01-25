# ⚡ GUÍA RÁPIDA - EJECUTAR SCALA CON ELECTRON

## 🚀 PASO 1: EJECUTAR LA APLICACIÓN

```bash
cd C:\Users\PC05\Downloads\Scala
npm start
```

## ✅ PASO 2: VERIFICAR QUE FUNCIONA

1. **Presiona F12** para abrir DevTools
2. Ve a la pestaña **Console**
3. Debe decir:
   ```
   ✓ Supabase inicializado correctamente (Electron/npm)
   DOM cargado, inicializando...
   Cargando maestros...
   X maestros cargados
   Cargando cursos...
   X cursos cargados
   Inicialización completa
   ```

## 🧪 PASO 3: PROBAR UN MÓDULO

### Probar FACTORES:
1. Haz clic en **"ARCHIVOS"**
2. Haz clic en **"FACTORES"**
3. Abre la consola (F12)
4. Verifica que diga "Inicialización completa"
5. Selecciona un maestro del dropdown
6. Selecciona un curso del dropdown
7. Escribe un número en "Factor" (ej: 50)
8. Haz clic en **"Nuevo"**
9. Debe decir: **"Factor guardado correctamente"**

## 🐛 SI NO FUNCIONA

### Problema: Los dropdowns están vacíos
**Causa:** No hay datos en la base de datos

**Solución:**
1. Abre Supabase: https://supabase.com/dashboard
2. Ve a tu proyecto
3. Ejecuta el script `SUPABASE-SCHEMA.sql`
4. Agrega datos de prueba:

```sql
-- Agregar maestros de prueba
INSERT INTO maestros (nombre, grado, fecha_ingreso) VALUES
('Juan Pérez', 'Licenciatura', '2020-01-15'),
('María García', 'Maestría', '2019-06-20'),
('Carlos López', 'Licenciatura', '2021-03-10');

-- Agregar cursos de prueba
INSERT INTO cursos (curso, descripcion, duracion) VALUES
('Piano Básico', 'Curso de piano nivel básico', 12),
('Guitarra Intermedio', 'Curso de guitarra nivel intermedio', 12),
('Violín Avanzado', 'Curso de violín nivel avanzado', 12);
```

### Problema: Error "Cannot read property 'addEventListener' of null"
**Causa:** Los elementos HTML no existen cuando se ejecuta el JS

**Solución:** Ya está corregido en `factores.js`. Los otros archivos necesitan la misma corrección.

### Problema: Los botones no hacen nada
**Causa:** Event listeners no están registrados

**Solución:** Verifica en la consola (F12) que diga "Inicialización completa"

## 📊 ESTADO ACTUAL

### ✅ Archivos corregidos:
- `factores.js` - Event listeners dentro de DOMContentLoaded

### ⚠️ Archivos que necesitan corrección:
- `grupos.js`
- `grupos-articulos.js`
- `rfc-clientes.js`
- `horarios.js`
- `prospectos.js`
- `salones.js`
- `alumnos-bajas.js`

## 🔧 PRÓXIMOS PASOS

Voy a corregir TODOS los archivos JS para que:
1. Los event listeners estén dentro de DOMContentLoaded
2. Verifiquen que los elementos existan antes de usarlos
3. Muestren mensajes de log en consola
4. Manejen errores correctamente

## 📝 MIENTRAS TANTO

Puedes probar el módulo **FACTORES** que ya está corregido:
1. `npm start`
2. ARCHIVOS > FACTORES
3. Selecciona maestro y curso
4. Escribe factor
5. Clic en "Nuevo"

---

**Fecha:** 24 de enero de 2026  
**Estado:** En corrección  
**Módulo funcional:** FACTORES ✅
