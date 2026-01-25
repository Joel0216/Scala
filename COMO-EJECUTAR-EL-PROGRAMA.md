# 🚀 CÓMO EJECUTAR EL PROGRAMA SCALA

## ⚡ INICIO RÁPIDO - ELECTRON (RECOMENDADO)

### 🎯 Aplicación de Escritorio Nativa

1. **Instalar Node.js** (solo la primera vez)
   - Ve a: https://nodejs.org/
   - Descarga la versión LTS
   - Instala con opciones por defecto
   - Reinicia tu computadora

2. **Instalar dependencias** (solo la primera vez)
   - Abre PowerShell en la carpeta del proyecto
   - Ejecuta: `npm install`
   - Espera 5-10 minutos

3. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

4. **Compilar a .exe** (opcional)
   ```bash
   npm run build:portable
   ```
   El archivo estará en: `dist/Scala-Portable-1.0.0.exe`

📖 **Guía completa de Electron:** Ver `INSTRUCCIONES-ELECTRON.md`

---

## 🌐 MODO NAVEGADOR (ALTERNATIVO)

## ✅ PASO 1: PREPARAR LA BASE DE DATOS (5 MINUTOS)

### 1.1 Ir a Supabase
```
https://supabase.com/dashboard/project/vqsduyfkgdqnigzkxazk
```

### 1.2 Ejecutar el Schema
1. Click en "SQL Editor" (menú lateral)
2. Click en "New query"
3. Abre el archivo `SUPABASE-SCHEMA.sql`
4. Copia TODO el contenido (Ctrl+A, Ctrl+C)
5. Pega en el editor de Supabase (Ctrl+V)
6. Click en "Run" (botón verde abajo a la derecha)
7. Espera 10-30 segundos
8. Deberías ver: "Success. No rows returned" ✅

### 1.3 Verificar
1. Click en "Table Editor" (menú lateral)
2. Deberías ver 21 tablas:
   - alumnos ✅
   - maestros ✅
   - cursos ✅
   - grupos ✅
   - salones ✅
   - recibos ✅
   - operaciones ✅
   - colegiaturas ✅
   - Y 13 más...

---

## 🖥️ PASO 2: ABRIR EL PROGRAMA (1 MINUTO)

### Opción A: Doble Click (Más Fácil)
1. Ve a la carpeta: `C:\Users\PC05\Downloads\Scala`
2. Busca el archivo: `index.html`
3. Haz **doble click** en `index.html`
4. Se abrirá en tu navegador predeterminado
5. ¡Listo! Ya puedes usar el programa

### Opción B: Servidor Local (Recomendado)
Si tienes Python instalado:
```bash
cd C:\Users\PC05\Downloads\Scala
python -m http.server 8000
```
Luego abre: `http://localhost:8000`

---

## 🧪 PASO 3: VERIFICAR QUE FUNCIONA (2 MINUTOS)

### 3.1 Probar Conexión
1. Abre en tu navegador: `test-supabase-connection.html`
2. Click en "1. Probar Conexión Básica"
3. Deberías ver: ✅ Conexión exitosa
4. Click en "2. Verificar Tablas"
5. Todas deberían estar con ✅

### 3.2 Probar el Menú Principal
1. Abre `index.html`
2. Deberías ver el menú con 6 opciones:
   - ARCHIVOS
   - CAJA
   - REPORTES
   - EXÁMENES
   - MANTENIMIENTO
   - SEGURIDAD

---

## 🎯 PASO 4: USAR EL PROGRAMA

### 4.1 Agregar un Alumno
1. Click en **"ARCHIVOS"**
2. Click en **"Alumnos"**
3. Click en **"Alta"**
4. Llena el formulario:
   - Nombre: "Juan Pérez"
   - Teléfono: "999-123-4567"
   - (La credencial se genera automática)
5. Click en **"Guardar"**
6. ¡Listo! Alumno guardado

### 4.2 Buscar un Alumno
1. En "Alumnos" → Click en **"Lista"**
2. Click en **"Buscar por Nombre"**
3. Escribe: "Juan"
4. Deberías ver el alumno que agregaste

### 4.3 Agregar un Maestro
1. Click en **"ARCHIVOS"**
2. Click en **"Maestros"**
3. Llena los datos
4. Click en **"Guardar"**

### 4.4 Agregar un Curso
1. Click en **"ARCHIVOS"**
2. Click en **"Cursos"**
3. Llena los datos
4. Click en **"Guardar"**

### 4.5 Crear un Grupo
1. Click en **"ARCHIVOS"**
2. Click en **"Grupos"** → **"Altas"**
3. Selecciona:
   - Curso
   - Maestro
   - Día
   - Hora
   - Salón
4. La clave se genera automática
5. Click en **"Guardar"**

---

## ✅ MÓDULOS QUE YA FUNCIONAN

### 100% Funcionales:
- ✅ **Alumnos** (Alta, Baja, Edición, Reingreso, Lista)
- ✅ **Maestros** (CRUD completo)
- ✅ **Cursos** (CRUD completo)
- ✅ **Salones** (CRUD completo)
- ✅ **Grupos** (Alta, Edición, Eliminación)
- ✅ **Prospectos** (CRUD completo)
- ✅ **Catálogos** (Motivos, Instrumentos, Medios)
- ✅ **RFC Clientes** (CRUD completo)

### Parcialmente Funcionales:
- ⚠️ **Factores** (Básico)
- ⚠️ **Horarios** (Solo consulta)
- ⚠️ **Exámenes** (Programación básica)

### No Implementados (Próximamente):
- ❌ **Caja** (Pagos y recibos)
- ❌ **Reportes** (Generación de PDFs)
- ❌ **Cortes de Caja**
- ❌ **Inventario** (Movimientos)
- ❌ **Seguridad** (Usuarios y permisos)

---

## 🔧 FUNCIONALIDADES IMPLEMENTADAS

### Basado en SCALA_Export:

#### 1. Sistema de Credenciales
- ✅ Generación automática de credenciales
- ✅ Dígito verificador implementado
- ✅ Validación de credenciales

#### 2. Gestión de Alumnos
- ✅ Alta con todos los campos
- ✅ Búsqueda por credencial y nombre
- ✅ Edición completa
- ✅ Bajas con motivo y fecha
- ✅ Reingresos
- ✅ Historial de cambios

#### 3. Gestión de Grupos
- ✅ Generación automática de clave
- ✅ Asignación de maestro, curso, salón
- ✅ Control de horarios
- ✅ Cupo y alumnos inscritos
- ✅ Progreso académico (lección, fecha)

#### 4. Catálogos
- ✅ Motivos de baja (7 predefinidos)
- ✅ Instrumentos (10 predefinidos)
- ✅ Medios de contacto (12 predefinidos)
- ✅ Navegación con botones ◀ ▶
- ✅ Búsqueda y edición

#### 5. Prospectos
- ✅ Registro completo
- ✅ Seguimiento
- ✅ Preferencias de horario
- ✅ Estado (inscrito, interesado)

---

## 🐛 SI ALGO NO FUNCIONA

### Error: "relation does not exist"
**Solución:** No ejecutaste el schema SQL
→ Ve al Paso 1

### Error: "Failed to fetch"
**Solución:** Problema de conexión
→ Verifica tu internet
→ Revisa `supabase-config.js`

### Los botones no hacen nada
**Solución:** Abre la consola (F12)
→ Busca errores en rojo
→ Verifica que los archivos .js existan

### No se guardan los datos
**Solución:** Verifica la consola (F12)
→ Puede ser un error de validación
→ Revisa que todos los campos requeridos estén llenos

---

## 📊 DATOS DE PRUEBA

Si quieres probar con datos de ejemplo:

1. Abre `test-supabase-connection.html`
2. Click en **"Insertar Datos de Prueba"**
3. Se crearán:
   - 1 Curso de prueba
   - 1 Maestro de prueba
   - 1 Salón de prueba

---

## 🎓 CREDENCIALES DEL SISTEMA

**Usuario Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE:** Cambiar en producción

---

## 📞 AYUDA ADICIONAL

- **Guía completa:** `GUIA-EJECUCION.md`
- **Problemas de BD:** `EJECUTAR-SCHEMA-SUPABASE.md`
- **Implementar módulos:** `INSTRUCCIONES-IMPLEMENTACION.md`
- **Código de ejemplo:** `EJEMPLOS-CODIGO.md`

---

## ✅ CHECKLIST RÁPIDO

- [ ] Ejecuté el schema SQL en Supabase
- [ ] Verifiqué que las 21 tablas existen
- [ ] Abrí `index.html` en mi navegador
- [ ] Puedo ver el menú principal
- [ ] Probé agregar un alumno
- [ ] El alumno se guardó correctamente
- [ ] No hay errores en la consola (F12)

¡Listo! Ya puedes usar el sistema SCALA 🎵

