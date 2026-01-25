# ✅ INSTRUCCIONES FINALES - SCALA ELECTRON

## 🎯 ESTADO ACTUAL

He corregido los siguientes módulos para que funcionen correctamente con Electron:

### ✅ Módulos Corregidos:
1. **FACTORES** - Completamente funcional
2. **GRUPOS** - Completamente funcional

### ⚠️ Módulos que aún necesitan corrección:
3. GRUPOS DE ARTÍCULOS
4. RFC CLIENTES
5. HORARIOS
6. PROSPECTOS
7. SALONES
8. CONSULTA DE ALUMNOS (BAJAS)

---

## 🚀 CÓMO EJECUTAR Y PROBAR

### Paso 1: Ejecutar la aplicación
```bash
cd C:\Users\PC05\Downloads\Scala
npm start
```

### Paso 2: Abrir DevTools
- Presiona **F12**
- Ve a la pestaña **Console**

### Paso 3: Verificar inicialización
Debes ver estos mensajes:
```
✓ Supabase inicializado correctamente (Electron/npm)
DOM cargado, inicializando...
Cargando maestros...
X maestros cargados
Cargando cursos...
X cursos cargados
Inicialización completa
```

---

## 🧪 PROBAR MÓDULOS FUNCIONALES

### Probar FACTORES:
1. Haz clic en **"ARCHIVOS"**
2. Haz clic en **"FACTORES"**
3. Verifica en consola: "Inicialización completa"
4. Selecciona un maestro
5. Selecciona un curso
6. Escribe un factor (ej: 50)
7. Haz clic en **"Nuevo"**
8. Debe decir: "Factor guardado correctamente"

### Probar GRUPOS:
1. Haz clic en **"ARCHIVOS"**
2. Haz clic en **"GRUPOS"**
3. Verifica en consola: "Inicialización de grupos completa"
4. Selecciona curso, maestro, día, hora
5. La clave debe generarse automáticamente
6. Los botones deben funcionar

---

## 📊 DATOS DE PRUEBA

Si los dropdowns están vacíos, necesitas agregar datos a Supabase:

### 1. Ir a Supabase
```
https://supabase.com/dashboard/project/vqsduyfkgdqnigzkxazk
```

### 2. Ir a SQL Editor

### 3. Ejecutar estos comandos:

```sql
-- Agregar maestros de prueba
INSERT INTO maestros (nombre, apellido_paterno, grado, fecha_ingreso, status) VALUES
('Juan', 'Pérez', 'Licenciatura en Música', '2020-01-15', 'activo'),
('María', 'García', 'Maestría en Piano', '2019-06-20', 'activo'),
('Carlos', 'López', 'Licenciatura en Guitarra', '2021-03-10', 'activo');

-- Agregar cursos de prueba
INSERT INTO cursos (curso, descripcion, duracion, precio, nivel) VALUES
('Piano Básico', 'Curso de piano nivel básico', 12, 1500.00, 'Básico'),
('Guitarra Intermedio', 'Curso de guitarra nivel intermedio', 12, 1800.00, 'Intermedio'),
('Violín Avanzado', 'Curso de violín nivel avanzado', 12, 2000.00, 'Avanzado');

-- Agregar salones de prueba
INSERT INTO salones (numero, ubicacion, cupo, instrumentos) VALUES
('101', 'Planta Baja', 10, 'Piano'),
('102', 'Planta Baja', 8, 'Guitarra'),
('201', 'Primer Piso', 6, 'Violín');
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: Los dropdowns están vacíos
**Causa:** No hay datos en la base de datos  
**Solución:** Ejecuta los comandos SQL de arriba

### Problema: Error "Cannot read property 'addEventListener' of null"
**Causa:** Los elementos HTML no existen  
**Solución:** Ya está corregido en factores.js y grupos.js

### Problema: Los botones no hacen nada
**Causa:** Event listeners no están registrados  
**Solución:** Verifica en consola que diga "Inicialización completa"

### Problema: "Supabase no inicializado"
**Causa:** Error de conexión  
**Solución:** Verifica tu conexión a Internet

---

## 📝 PRÓXIMOS PASOS

Necesito corregir los 6 módulos restantes siguiendo el mismo patrón:

1. Mover todos los event listeners dentro de `setupEventListeners()`
2. Llamar `setupEventListeners()` después de cargar datos
3. Verificar que los elementos existan antes de usarlos
4. Agregar mensajes de log en consola

¿Quieres que corrija todos los módulos restantes ahora?

---

## ✅ CHECKLIST

- [x] Supabase configurado para Electron
- [x] CDN eliminado de HTML
- [x] factores.js corregido
- [x] grupos.js corregido
- [ ] grupos-articulos.js
- [ ] rfc-clientes.js
- [ ] horarios.js
- [ ] prospectos.js
- [ ] salones.js
- [ ] alumnos-bajas.js

---

## 🎯 RESULTADO ESPERADO

Cuando todos los módulos estén corregidos:
- ✅ Todos los campos serán editables
- ✅ Todos los botones funcionarán
- ✅ Los datos se guardarán en Supabase
- ✅ La navegación funcionará correctamente
- ✅ La aplicación será completamente funcional

---

**Fecha:** 24 de enero de 2026  
**Estado:** 2 de 8 módulos corregidos  
**Progreso:** 25%

---

## 🚀 EJECUTAR AHORA

```bash
cd C:\Users\PC05\Downloads\Scala
npm start
```

Prueba los módulos **FACTORES** y **GRUPOS** que ya están funcionando.
