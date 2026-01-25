# 🚀 GUÍA RÁPIDA: Ejecutar Schema en Supabase

## ✅ TU CONFIGURACIÓN ACTUAL

**URL del Proyecto:** `https://vqsduyfkgdqnigzkxazk.supabase.co`  
**Estado:** ✅ Configuración correcta en `supabase-config.js`

---

## 📋 PASO 1: ABRIR SUPABASE DASHBOARD

1. Ve a: https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **vqsduyfkgdqnigzkxazk**

---

## 📝 PASO 2: ABRIR SQL EDITOR

1. En el menú lateral izquierdo, busca **"SQL Editor"**
2. Haz clic en **"SQL Editor"**
3. Verás un editor de código SQL

---

## 📄 PASO 3: COPIAR EL SCHEMA

1. Abre el archivo `SUPABASE-SCHEMA.sql` en tu proyecto
2. **Selecciona TODO el contenido** (Ctrl+A o Cmd+A)
3. **Copia** (Ctrl+C o Cmd+C)

---

## ▶️ PASO 4: EJECUTAR EL SCHEMA

1. En el SQL Editor de Supabase, **pega** el contenido (Ctrl+V o Cmd+V)
2. Haz clic en el botón **"Run"** (esquina inferior derecha)
3. Espera a que termine la ejecución (puede tardar 10-30 segundos)
4. Deberías ver: **"Success. No rows returned"** ✅

---

## 🧪 PASO 5: VERIFICAR LA INSTALACIÓN

### Opción A: Desde Supabase Dashboard

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver 21 tablas creadas:
   - alumnos
   - maestros
   - cursos
   - grupos
   - salones
   - recibos
   - operaciones
   - colegiaturas
   - motivos_baja
   - instrumentos
   - medios_contacto
   - grupos_articulos
   - articulos
   - movimientos_inventario
   - programacion_examenes
   - prospectos
   - usuarios
   - login_history
   - rfc_clientes
   - factores
   - cambios_alumnos
   - operaciones_canceladas

### Opción B: Desde tu Proyecto

1. Abre el archivo `test-supabase-connection.html` en tu navegador
2. Haz clic en **"2. Verificar Tablas"**
3. Deberías ver todas las tablas con ✅

---

## 📊 PASO 6: VERIFICAR DATOS INICIALES

Las siguientes tablas deben tener datos iniciales:

### Motivos de Baja (7 registros)
```sql
SELECT * FROM motivos_baja;
```
Deberías ver: CAC, ECO, SAL, TRA, TIE, INT, OTR

### Instrumentos (10 registros)
```sql
SELECT * FROM instrumentos;
```
Deberías ver: BAAY, GUEL, GUAC, PIAN, etc.

### Medios de Contacto (12 registros)
```sql
SELECT * FROM medios_contacto;
```
Deberías ver: REC, FACE, INT, ANUN, etc.

### Usuario Administrador (1 registro)
```sql
SELECT user_id, nombre, rol FROM usuarios;
```
Deberías ver: admin | Administrador del Sistema | admin

---

## 🔐 PASO 7: CREDENCIALES DEL ADMINISTRADOR

**Usuario:** `admin`  
**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia esta contraseña en producción

Para cambiar la contraseña:
```sql
UPDATE usuarios 
SET password = 'TU_NUEVO_HASH_BCRYPT'
WHERE user_id = 'admin';
```

---

## 🧪 PASO 8: PROBAR LA CONEXIÓN

### Desde el navegador:

1. Abre `test-supabase-connection.html`
2. Ejecuta todas las pruebas:
   - ✅ Probar Conexión Básica
   - ✅ Verificar Tablas
   - ✅ Probar Inserción
   - ✅ Probar Consulta
   - ✅ Listar Todas las Tablas

### Desde tu aplicación:

1. Abre cualquier módulo (ej: `alumnos-lista.html`)
2. Abre la consola del navegador (F12)
3. No deberías ver errores de conexión

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "relation does not exist"
**Causa:** Las tablas no se crearon  
**Solución:** Ejecuta el schema SQL nuevamente

### Error: "permission denied"
**Causa:** Problemas con RLS (Row Level Security)  
**Solución:** 
```sql
-- Deshabilitar RLS temporalmente para pruebas
ALTER TABLE alumnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE maestros DISABLE ROW LEVEL SECURITY;
-- ... para todas las tablas
```

### Error: "duplicate key value"
**Causa:** Intentaste ejecutar el schema dos veces  
**Solución:** 
```sql
-- Eliminar todas las tablas y volver a crear
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Luego ejecuta el schema nuevamente
```

### Error de conexión desde la aplicación
**Causa:** Credenciales incorrectas  
**Solución:** Verifica que `supabase-config.js` tenga:
```javascript
const SUPABASE_URL = 'https://vqsduyfkgdqnigzkxazk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 📈 PASO 9: INSERTAR DATOS DE PRUEBA (OPCIONAL)

Si quieres probar con datos de ejemplo:

```sql
-- Insertar un curso de prueba
INSERT INTO cursos (curso, precio_mensual, precio_inscripcion, nivel) VALUES
('PIANO BASICO', 800.00, 200.00, 'Básico');

-- Insertar un maestro de prueba
INSERT INTO maestros (nombre, telefono, status) VALUES
('Juan Pérez', '999-123-4567', 'activo');

-- Insertar un salón de prueba
INSERT INTO salones (numero, ubicacion, cupo) VALUES
('S-101', 'Planta Baja', 10);

-- Insertar un alumno de prueba
INSERT INTO alumnos (credencial1, nombre, status) VALUES
('100001', 'Alumno de Prueba', 'activo');
```

O usa el botón **"Insertar Datos de Prueba"** en `test-supabase-connection.html`

---

## ✅ CHECKLIST FINAL

- [ ] Schema SQL ejecutado sin errores
- [ ] 21 tablas creadas y visibles
- [ ] Catálogos con datos iniciales (motivos, instrumentos, medios)
- [ ] Usuario admin creado
- [ ] Prueba de conexión exitosa desde test-supabase-connection.html
- [ ] Prueba de inserción exitosa
- [ ] Prueba de consulta exitosa

---

## 🎉 ¡LISTO!

Tu base de datos está configurada y lista para usar. Ahora puedes:

1. **Probar los módulos existentes** (alumnos, maestros, cursos, etc.)
2. **Implementar los módulos faltantes** (caja, reportes, exámenes)
3. **Migrar datos** desde Access si los tienes

---

## 📞 PRÓXIMOS PASOS

1. Revisa `INSTRUCCIONES-IMPLEMENTACION.md` para continuar
2. Implementa el módulo de Caja (prioridad crítica)
3. Completa la gestión de alumnos
4. Implementa el sistema de reportes

¡Éxito con tu proyecto! 🚀

