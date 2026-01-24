# Solución a Problemas de Navegación y Campos de Entrada

## DIAGNÓSTICO

He revisado todos los archivos y la navegación está correctamente implementada:

### ✅ Navegación Correcta Implementada:
- **archivos.html** → Todos los botones tienen `onclick="window.location.href='[archivo].html'"`
- **maestros.js** → `terminar()` navega a `archivos.html`
- **cursos.js** → `terminar()` navega a `archivos.html`
- **articulos.js** → `terminar()` navega a `archivos.html`
- **movimientos-inventario.js** → `terminar()` navega a `archivos.html`
- **programacion-examenes.js** → `terminar()` navega a `examenes-menu.html`
- **relacion-examenes.js** → `terminar()` navega a `examenes-menu.html`
- **reasignacion-examenes.js** → `terminar()` navega a `examenes-menu.html`
- **examenes-menu.html** → Botón Terminar navega a `archivos.html`

### ✅ Campos de Entrada Correctos:
- Campos con `readonly`: Solo los que deben ser de solo lectura (claves auto-generadas, información calculada)
- Campos editables: Todos los demás campos permiten entrada de datos

## POSIBLES CAUSAS DEL PROBLEMA

### 1. **Caché del Navegador** (MÁS PROBABLE)
El navegador está cargando versiones antiguas de los archivos JavaScript.

**SOLUCIÓN:**
```
1. Presiona Ctrl + Shift + Delete (Chrome/Edge)
2. Selecciona "Imágenes y archivos en caché"
3. Selecciona "Desde siempre"
4. Haz clic en "Borrar datos"
5. Cierra y vuelve a abrir el navegador
6. Recarga la página con Ctrl + F5
```

### 2. **Archivos JavaScript No Se Cargan**
Los archivos .js no están siendo cargados correctamente.

**VERIFICACIÓN:**
1. Abre la página en el navegador
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console" (Consola)
4. Busca errores en rojo que digan "Failed to load" o "404"

### 3. **Electron No Está Actualizado**
Si estás usando Electron, necesitas reconstruir la aplicación.

**SOLUCIÓN:**
```cmd
npm install
npm run build
```

## PRUEBAS A REALIZAR

### Prueba 1: Verificar Navegación desde Archivos
1. Abre `archivos.html` en el navegador
2. Haz clic en "MAESTROS"
3. Verifica que se abre `maestros.html`
4. Haz clic en "Terminar"
5. Verifica que regresa a `archivos.html`

### Prueba 2: Verificar Campos de Entrada en Maestros
1. Abre `maestros.html`
2. Intenta escribir en el campo "Nombre"
3. Intenta escribir en el campo "Dirección"
4. Verifica que puedes escribir sin problemas

### Prueba 3: Verificar Navegación de Exámenes
1. Abre `archivos.html`
2. Haz clic en "EXAMENES"
3. Verifica que se abre `examenes-menu.html`
4. Haz clic en "PROGRAMACION EXAMENES"
5. Verifica que se abre `programacion-examenes.html`
6. Haz clic en "Terminar"
7. Verifica que regresa a `examenes-menu.html`
8. Haz clic en "TERMINAR"
9. Verifica que regresa a `archivos.html`

### Prueba 4: Verificar Campos en Programación de Exámenes
1. Abre `programacion-examenes.html`
2. Intenta escribir en "Clave de examen"
3. Intenta seleccionar en "Maestro Base"
4. Intenta escribir en "Fecha de examen"
5. Verifica que todos los campos responden

## SOLUCIÓN RÁPIDA: FORZAR RECARGA

Si el problema persiste, crea este archivo HTML de prueba:

**test-navegacion.html:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Test de Navegación</title>
</head>
<body>
    <h1>Test de Navegación</h1>
    
    <h2>Prueba 1: Navegación Simple</h2>
    <button onclick="window.location.href='archivos.html'">Ir a Archivos</button>
    
    <h2>Prueba 2: Navegación con Función</h2>
    <button onclick="irAMaestros()">Ir a Maestros</button>
    
    <h2>Prueba 3: Campo de Entrada</h2>
    <input type="text" id="test" placeholder="Escribe aquí">
    <button onclick="alert(document.getElementById('test').value)">Mostrar Valor</button>
    
    <script>
        function irAMaestros() {
            window.location.href = 'maestros.html';
        }
    </script>
</body>
</html>
```

Abre este archivo y prueba:
1. Si el botón "Ir a Archivos" funciona → El problema es de caché
2. Si el campo de entrada funciona → Los campos están bien
3. Si nada funciona → Hay un problema con el navegador o Electron

## COMANDOS PARA ELECTRON

Si estás usando Electron y los cambios no se reflejan:

```cmd
# Limpiar caché de node_modules
rmdir /s /q node_modules
rmdir /s /q dist

# Reinstalar dependencias
npm install

# Reconstruir
npm run build

# Ejecutar en modo desarrollo
npm start
```

## VERIFICACIÓN FINAL

Después de limpiar el caché, verifica que estos archivos existen:
- ✅ archivos.html
- ✅ archivos.js
- ✅ maestros.html
- ✅ maestros.js
- ✅ cursos.html
- ✅ cursos.js
- ✅ articulos.html
- ✅ articulos.js
- ✅ movimientos-inventario.html
- ✅ movimientos-inventario.js
- ✅ examenes-menu.html
- ✅ examenes-menu.js
- ✅ programacion-examenes.html
- ✅ programacion-examenes.js
- ✅ relacion-examenes.html
- ✅ relacion-examenes.js
- ✅ reasignacion-examenes.html
- ✅ reasignacion-examenes.js

## CONTACTO

Si después de seguir todos estos pasos el problema persiste:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Copia todos los errores que aparezcan en rojo
4. Comparte esos errores para diagnóstico adicional
