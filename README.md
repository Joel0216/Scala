# 🎵 SCALA - Sistema de Gestión para Academia de Música

Sistema de gestión integral para academias de música, desarrollado con tecnologías web modernas.

## 📊 ESTADO DEL PROYECTO

**Progreso:** 40% Completado  
**Base de Datos:** ✅ Configurada (Supabase)  
**Módulos Críticos:** ⚠️ En desarrollo  
**Tiempo Estimado:** 8-10 semanas para completar

---

## 🚀 INICIO RÁPIDO

### 1. Configurar Base de Datos

**Tu configuración de Supabase ya está lista:**
- **URL:** https://vqsduyfkgdqnigzkxazk.supabase.co
- **Archivo:** `supabase-config.js` ✅

**Sigue estos pasos:**
1. 📖 Lee `EJECUTAR-SCHEMA-SUPABASE.md`
2. ▶️ Ejecuta `SUPABASE-SCHEMA.sql` en Supabase Dashboard
3. 🧪 Verifica con `test-supabase-connection.html`

### 2. Probar la Aplicación

```bash
# Abre en tu navegador:
index.html                      # Menú principal
test-supabase-connection.html   # Verificar conexión a BD
alumnos-lista.html             # Gestión de alumnos
```

---

## 📚 DOCUMENTACIÓN COMPLETA

### 🎯 Empieza Aquí
1. **EJECUTAR-SCHEMA-SUPABASE.md** - Configurar base de datos (PASO 1)
2. **test-supabase-connection.html** - Verificar que todo funciona
3. **RESUMEN-EJECUTIVO.md** - Visión general del proyecto

### 📖 Análisis y Arquitectura
- **ANALISIS-ARQUITECTURA-SCALA.md** - Análisis técnico completo
- **SUPABASE-SCHEMA.sql** - Script de base de datos (21 tablas)
- **EJEMPLOS-CODIGO.md** - Código listo para usar

### 🛠️ Guías de Implementación
- **INSTRUCCIONES-IMPLEMENTACION.md** - Guía paso a paso
- **CORRECCION-NAVEGACION.md** - Correcciones de navegación

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales (21 tablas)

**Maestros:**
- `alumnos` - Datos de estudiantes
- `maestros` - Profesores
- `cursos` - Programas académicos
- `grupos` - Horarios y clases
- `salones` - Espacios físicos

**Transaccionales:**
- `recibos` - Cabecera de pagos
- `operaciones` - Detalle de pagos
- `colegiaturas` - Pagos mensuales

**Catálogos:**
- `motivos_baja` - Razones de baja
- `instrumentos` - Instrumentos musicales
- `medios_contacto` - Canales de contacto

**Otros:**
- `prospectos` - Interesados
- `usuarios` - Sistema de seguridad
- `programacion_examenes` - Exámenes
- `articulos` - Inventario
- Y más...

---


## ✅ MÓDULOS COMPLETADOS (40%)

- ✅ Estructura HTML/CSS base
- ✅ Navegación entre módulos
- ✅ Catálogos simples (Motivos, Instrumentos, Medios, Salones)
- ✅ Formularios básicos de alumnos
- ✅ Conexión a Supabase configurada
- ✅ Sistema de fecha/hora en tiempo real

## ⚠️ MÓDULOS EN DESARROLLO (30%)

- ⚠️ Gestión completa de alumnos
- ⚠️ Gestión de grupos y horarios
- ⚠️ Catálogos de maestros y cursos

## ❌ MÓDULOS PENDIENTES (30%)

- ❌ **CRÍTICO:** Módulo de Caja/Pagos
- ❌ **CRÍTICO:** Cortes de caja
- ❌ **CRÍTICO:** Sistema de reportes
- ❌ Programación de exámenes
- ❌ Inventario de artículos
- ❌ Gestión de prospectos
- ❌ Sistema de seguridad y permisos

---

## 🔧 CONFIGURACIÓN DE SUPABASE

### Credenciales (Ya configuradas en supabase-config.js)

- **URL del Proyecto**: https://vqsduyfkgdqnigzkxazk.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIyOTMsImV4cCI6MjA4NDYwODI5M30.l5bZubjb3PIvcFG43JTfoeguldEwwIK7wlnOnl-Ec5o


### Instalación y Uso

1. **Incluir la librería de Supabase en tu HTML:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script type="module" src="supabase-config.js"></script>
```

2. **Inicializar Supabase al cargar la página:**
```javascript
window.addEventListener('load', () => {
    initSupabase();
});
```

3. **Usar las funciones de base de datos:**
```javascript
// Obtener todos los alumnos
const alumnos = await getAlumnos();

// Insertar un nuevo alumno
const nuevoAlumno = await insertAlumno({
    credencial1: '100001',
    nombre: 'Juan Pérez',
    status: 'activo'
});

// Actualizar un alumno
const actualizado = await updateAlumno(id, { 
    telefono: '999-123-4567' 
});
```

---

## 📁 ESTRUCTURA DEL PROYECTO

### Páginas Principales
- `index.html` - Menú principal del sistema
- `archivos.html` - Gestión de archivos (alumnos, maestros, cursos)
- `caja.html` - Procesos de cobros y pagos
- `reportes.html` - Generación de reportes
- `examenes-menu.html` - Gestión de exámenes
- `mantenimiento.html` - Mantenimiento del sistema
- `seguridad.html` - Gestión de usuarios y permisos

### Módulos de Alumnos
- `alumnos-lista.html` - Listado de alumnos
- `alumnos-alta.html` - Alta de nuevos alumnos
- `alumnos-edicion.html` - Edición de datos
- `alumnos-bajas.html` - Gestión de bajas
- `alumnos-reingreso.html` - Reingresos

### Módulos de Catálogos
- `maestros.html` - Gestión de maestros
- `cursos.html` - Gestión de cursos
- `grupos.html` - Gestión de grupos
- `salones.html` - Gestión de salones
- `otros-catalogos.html` - Catálogos varios

### Archivos de Configuración
- `supabase-config.js` - Configuración y funciones de Supabase
- `common.js` - Funciones comunes
- `styles.css` - Estilos globales

### Documentación
- `EJECUTAR-SCHEMA-SUPABASE.md` - Guía de instalación de BD
- `RESUMEN-EJECUTIVO.md` - Resumen del proyecto
- `ANALISIS-ARQUITECTURA-SCALA.md` - Análisis técnico
- `INSTRUCCIONES-IMPLEMENTACION.md` - Guía de desarrollo

---

## 🧪 PRUEBAS Y VERIFICACIÓN

### Verificar Conexión a Base de Datos
```bash
# Abre en tu navegador:
test-supabase-connection.html
```

**Pruebas disponibles:**
1. ✅ Probar Conexión Básica
2. ✅ Verificar Tablas (21 tablas)
3. ✅ Probar Inserción
4. ✅ Probar Consulta
5. ✅ Listar Todas las Tablas
6. ✅ Insertar Datos de Prueba

---

## 🚦 PRÓXIMOS PASOS

### Inmediatos (Esta Semana)
1. ✅ Ejecutar `SUPABASE-SCHEMA.sql` en Supabase
2. ✅ Verificar conexión con `test-supabase-connection.html`
3. 🔄 Implementar módulo de Caja (CRÍTICO)

### Corto Plazo (Mes 1)
1. Completar gestión de alumnos
2. Implementar cortes de caja
3. Sistema básico de reportes

### Mediano Plazo (Mes 2)
1. Programación de exámenes
2. Inventario de artículos
3. Sistema de seguridad completo

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial
- [Supabase Docs](https://supabase.com/docs)
- [JavaScript MDN](https://developer.mozilla.org/es/docs/Web/JavaScript)

### Archivos de Ayuda
- `EJECUTAR-SCHEMA-SUPABASE.md` - Problemas con base de datos
- `INSTRUCCIONES-IMPLEMENTACION.md` - Guía de desarrollo
- `EJEMPLOS-CODIGO.md` - Ejemplos de código

---

## 🎯 CREDENCIALES POR DEFECTO

**Usuario Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE:** Cambiar en producción

---

## 📊 TECNOLOGÍAS UTILIZADAS

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL + API REST)
- **Librerías:** 
  - @supabase/supabase-js
  - jsPDF (para reportes)
  - SweetAlert2 (alertas)

---

## 📝 LICENCIA

Sistema desarrollado para uso interno de academias de música.

---

## 🎉 ¡LISTO PARA EMPEZAR!

1. Lee `EJECUTAR-SCHEMA-SUPABASE.md`
2. Ejecuta el schema SQL
3. Abre `test-supabase-connection.html`
4. Comienza a usar el sistema

**¿Necesitas ayuda?** Revisa la documentación en la carpeta del proyecto.


