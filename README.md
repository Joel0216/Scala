# Scala - Academias de Música

Sistema de gestión para academias de música.

## Configuración de Supabase

### Credenciales

- **URL del Proyecto**: https://vqsduyfkgdqnigzkxazk.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIyOTMsImV4cCI6MjA4NDYwODI5M30.l5bZubjb3PIvcFG43JTfoeguldEwwIK7wlnOnl-Ec5o

### Instalación

1. Incluir la librería de Supabase en tu HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
```

2. Inicializar Supabase al cargar la página:
```javascript
window.addEventListener('load', () => {
    initSupabase();
});
```

### Tablas de la Base de Datos

El sistema incluye 44 tablas principales:
- alumnos
- maestros
- cursos
- grupos
- colegiaturas
- recibos
- reportes
- Y más...

### Uso de las Funciones

```javascript
// Obtener todos los alumnos
const alumnos = await getAlumnos();

// Insertar un nuevo alumno
const nuevoAlumno = await insertAlumno({
    nombre: 'Juan Pérez',
    telefono: '1234567890',
    curso: 'Piano'
});

// Actualizar un alumno
const actualizado = await updateAlumno(1, { telefono: '0987654321' });

// Eliminar un alumno
const eliminado = await deleteAlumno(1);
```

## Estructura del Proyecto

- `index.html` - Menú principal
- `archivos.html` - Gestión de archivos (alumnos, maestros, cursos, etc.)
- `seguridad.html` - Gestión de usuarios y permisos
- `caja.html` - Procesos de cobros
- `mantenimiento.html` - Mantenimiento del sistema
- `reportes.html` - Generación de reportes
- `supabase-config.js` - Configuración y funciones de Supabase

## Ejecución

Abrir `index.html` en un navegador web.
