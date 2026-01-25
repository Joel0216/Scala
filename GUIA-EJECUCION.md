# 🚀 GUÍA DE EJECUCIÓN - SISTEMA SCALA

## 📋 REQUISITOS PREVIOS

### 1. Software Necesario
- ✅ Navegador web moderno (Chrome, Firefox, Edge)
- ✅ Conexión a Internet (para Supabase)
- ✅ Editor de código (VS Code recomendado)

### 2. Base de Datos
- ✅ Cuenta de Supabase activa
- ✅ Proyecto creado: vqsduyfkgdqnigzkxazk
- ⚠️ Schema SQL ejecutado (si no lo has hecho, ve al Paso 1)

---

## 🎯 PASO 1: CONFIGURAR BASE DE DATOS (SOLO UNA VEZ)

### A. Ejecutar Schema SQL

1. **Abre Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/vqsduyfkgdqnigzkxazk
   ```

2. **Ve a SQL Editor:**
   - Menú lateral → "SQL Editor"
   - Click en "New query"

3. **Copia y pega el contenido completo de:**
   ```
   SUPABASE-SCHEMA.sql
   ```

4. **Ejecuta el script:**
   - Click en botón "Run" (esquina inferior derecha)
   - Espera 10-30 segundos
   - Deberías ver: "Success. No rows returned" ✅

5. **Verifica las tablas:**
   - Ve a "Table Editor"
   - Deberías ver 21 tablas creadas

### B. Verificar Conexión

1. **Abre en tu navegador:**
   ```
   test-supabase-connection.html
   ```

2. **Ejecuta las pruebas:**
   - Click en "1. Probar Conexión Básica" → ✅
   - Click en "2. Verificar Tablas" → Todas con ✅
   - Click en "5. Insertar Datos de Prueba" → ✅

---

## 🖥️ PASO 2: EJECUTAR EL PROGRAMA

### Opción A: Abrir Directamente en Navegador

1. **Navega a la carpeta del proyecto:**
   ```
   C:\Users\PC05\Downloads\Scala
   ```

2. **Haz doble click en:**
   ```
   index.html
   ```

3. **El menú principal se abrirá en tu navegador**

### Opción B: Usar un Servidor Local (Recomendado)

Si tienes Python instalado:

```bash
# En la carpeta del proyecto
python -m http.server 8000
```

Luego abre en tu navegador:
```
http://localhost:8000
```

### Opción C: Usar VS Code Live Server

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

---

## 🧭 PASO 3: NAVEGAR POR EL SISTEMA

### Menú Principal (index.html)

Desde aquí puedes acceder a:

1. **ARCHIVOS** → Gestión de datos maestros
   - Alumnos (alta, baja, edición, reingreso)
   - Maestros
   - Cursos
   - Grupos
   - Salones
   - Prospectos
   - RFC Clientes
   - Factores
   - Otros Catálogos

2. **CAJA** → Procesos de cobros
   - ⚠️ En desarrollo (ver Paso 4)

3. **REPORTES** → Generación de reportes
   - ⚠️ En desarrollo (ver Paso 4)

4. **EXÁMENES** → Gestión de exámenes
   - Programación
   - Reasignación
   - Relación

5. **MANTENIMIENTO** → Mantenimiento del sistema
   - Cambios de alumnos
   - Inventario

6. **SEGURIDAD** → Usuarios y permisos
   - ⚠️ En desarrollo (ver Paso 4)

---

## ✅ PASO 4: MÓDULOS FUNCIONALES

### Módulos que YA FUNCIONAN:

#### 1. Gestión de Alumnos
```
archivos.html → Alumnos
```
- ✅ Alta de alumnos
- ✅ Búsqueda por credencial/nombre
- ✅ Edición de datos
- ✅ Bajas
- ✅ Reingresos
- ✅ Listado

**Cómo usar:**
1. Click en "ARCHIVOS"
2. Click en "Alumnos"
3. Selecciona la opción deseada

#### 2. Catálogos
```
archivos.html → Otros Catálogos
```
- ✅ Motivos de baja
- ✅ Instrumentos
- ✅ Medios de contacto

**Cómo usar:**
1. Click en "ARCHIVOS"
2. Click en "Otros Catálogos"
3. Selecciona el catálogo
4. Usa los botones de navegación

#### 3. Maestros
```
archivos.html → Maestros
```
- ✅ Alta de maestros
- ✅ Edición
- ✅ Búsqueda
- ✅ Navegación

#### 4. Cursos
```
archivos.html → Cursos
```
- ✅ Alta de cursos
- ✅ Edición
- ✅ Navegación

#### 5. Salones
```
archivos.html → Salones
```
- ✅ Alta de salones
- ✅ Edición
- ✅ Eliminación
- ✅ Navegación

#### 6. Prospectos
```
archivos.html → Prospectos
```
- ✅ Registro de prospectos
- ✅ Búsqueda
- ✅ Edición
- ✅ Eliminación

---

## ⚠️ PASO 5: MÓDULOS EN DESARROLLO

### Módulos que NECESITAN IMPLEMENTACIÓN:

#### 1. CAJA (CRÍTICO)
**Estado:** 🔴 No implementado
**Archivos:** `caja.html`, `caja.js`

**Funcionalidad actual:**
- Botones muestran alertas temporales
- No genera recibos reales

**Para implementar:**
Ver `INSTRUCCIONES-IMPLEMENTACION.md` → Sección "Módulo de Caja"

#### 2. REPORTES (CRÍTICO)
**Estado:** 🔴 No implementado
**Archivos:** `reportes.html`, `reportes.js`

**Funcionalidad actual:**
- Lista de reportes disponible
- No genera PDFs reales

**Para implementar:**
Ver `INSTRUCCIONES-IMPLEMENTACION.md` → Sección "Reportes"

#### 3. GRUPOS (PARCIAL)
**Estado:** 🟡 Parcialmente implementado
**Archivos:** `grupos.html`, `grupos.js`

**Funcionalidad actual:**
- Listado básico
- Falta: Alta, edición, control de cupo

**Para implementar:**
Ver `INSTRUCCIONES-IMPLEMENTACION.md` → Sección "Grupos"

---

## 🧪 PASO 6: PROBAR FUNCIONALIDADES

### Prueba 1: Alta de Alumno

1. Abre `index.html`
2. Click en "ARCHIVOS"
3. Click en "Alumnos" → "Alta"
4. Llena el formulario:
   - Nombre: "Juan Pérez"
   - Credencial: Se genera automática
   - Teléfono: "999-123-4567"
5. Click en "Guardar"
6. Verifica en la consola (F12) que no haya errores

### Prueba 2: Búsqueda de Alumno

1. En "Alumnos" → "Lista"
2. Click en "Buscar por Nombre"
3. Escribe "Juan"
4. Deberías ver el alumno creado

### Prueba 3: Catálogos

1. Ve a "Otros Catálogos"
2. Selecciona "Motivos"
3. Usa los botones de navegación (◀ ▶)
4. Deberías ver los motivos predefinidos

### Prueba 4: Maestros

1. Ve a "Maestros"
2. Click en "Nuevo"
3. Llena los datos
4. Click en "Guardar"
5. Verifica que se guardó

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "relation does not exist"
**Causa:** No ejecutaste el schema SQL
**Solución:** Ve al Paso 1

### Error: "Failed to fetch"
**Causa:** Problema de conexión a Supabase
**Solución:** 
1. Verifica tu conexión a internet
2. Revisa `supabase-config.js`
3. Verifica las credenciales

### Los botones no hacen nada
**Causa:** JavaScript no se cargó
**Solución:**
1. Abre la consola (F12)
2. Busca errores en rojo
3. Verifica que los archivos .js existan

### "Cannot read property of undefined"
**Causa:** Elemento HTML no encontrado
**Solución:**
1. Verifica que el HTML tenga los IDs correctos
2. Revisa la consola para ver qué elemento falta

---

## 📊 ESTADO DE FUNCIONALIDADES

### ✅ FUNCIONANDO (40%)
- [x] Navegación entre módulos
- [x] Alta de alumnos
- [x] Búsqueda de alumnos
- [x] Edición de alumnos
- [x] Bajas y reingresos
- [x] Catálogos (motivos, instrumentos, medios)
- [x] Maestros (CRUD completo)
- [x] Cursos (CRUD completo)
- [x] Salones (CRUD completo)
- [x] Prospectos (CRUD completo)

### 🟡 PARCIAL (30%)
- [ ] Grupos (solo listado)
- [ ] RFC Clientes (básico)
- [ ] Factores (básico)
- [ ] Horarios (solo consulta)

### 🔴 FALTANTE (30%)
- [ ] Módulo de Caja completo
- [ ] Generación de recibos
- [ ] Cortes de caja
- [ ] Sistema de reportes
- [ ] Exámenes (programación completa)
- [ ] Inventario (movimientos)
- [ ] Sistema de seguridad

---

## 🎯 PRÓXIMOS PASOS

1. **Hoy:**
   - ✅ Ejecuta el schema SQL
   - ✅ Verifica la conexión
   - ✅ Prueba los módulos funcionales

2. **Esta semana:**
   - 🔄 Implementa el módulo de Caja
   - 🔄 Completa la gestión de grupos
   - 🔄 Implementa cortes de caja

3. **Próximas semanas:**
   - 🔄 Sistema de reportes
   - 🔄 Exámenes completo
   - 🔄 Inventario

---

## 📞 ¿NECESITAS AYUDA?

- **Problemas de BD:** `EJECUTAR-SCHEMA-SUPABASE.md`
- **Implementar módulos:** `INSTRUCCIONES-IMPLEMENTACION.md`
- **Código de ejemplo:** `EJEMPLOS-CODIGO.md`
- **Visión general:** `RESUMEN-EJECUTIVO.md`

---

## ✅ CHECKLIST DE EJECUCIÓN

- [ ] Schema SQL ejecutado en Supabase
- [ ] Prueba de conexión exitosa
- [ ] `index.html` abre correctamente
- [ ] Puedo navegar entre módulos
- [ ] Puedo agregar un alumno
- [ ] Puedo buscar alumnos
- [ ] Los catálogos funcionan
- [ ] No hay errores en la consola

¡Listo para usar! 🚀

