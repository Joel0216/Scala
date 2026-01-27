# Corrección de Botones e Inputs - Sistema SCALA

## Problemas Identificados

### 1. **Inputs sin funcionalidad (readonly implícito)**
- Los inputs en varios módulos no permiten escribir
- Falta el atributo `value` y event handlers `onChange`
- No están configurados como controlled components

### 2. **Botones sin event handlers**
- Botones de navegación sin funcionalidad
- Botones de acción sin onclick
- Modales sin forma de cerrarse

### 3. **Navegación rota**
- Falta botón "Volver" o "Terminar" en varias secciones
- Modales que no se pueden cerrar
- Formularios sin botón de cancelar

## Archivos que Necesitan Corrección

### Críticos (Sin funcionalidad básica)
1. ✅ `alumnos.html` / `alumnos.js` - Inputs funcionan pero falta navegación
2. ✅ `maestros.html` / `maestros.js` - Funciona correctamente
3. `cursos.html` / `cursos.js` - Revisar
4. `grupos.html` / `grupos.js` - Revisar
5. `articulos.html` / `articulos.js` - Revisar
6. `factores.html` / `factores.js` - Revisar

### Moderados (Funcionalidad parcial)
7. `horarios.html` / `horarios.js` - Recién corregido
8. `salones.html` / `salones.js` - Funciona
9. `rfc-clientes.html` / `rfc-clientes.js` - Funciona
10. `prospectos.html` / `prospectos.js` - Revisar

### Menores (Solo navegación)
11. `caja.html` / `caja.js` - Revisar
12. `reportes.html` / `reportes.js` - Revisar
13. `seguridad.html` / `seguridad.js` - Revisar
14. `examenes-menu.html` - Revisar

## Soluciones Aplicadas

### Para Inputs
```javascript
// ANTES (no funciona)
<input type="text" id="nombre">

// DESPUÉS (funciona)
<input type="text" id="nombre" value="">

// Con React-style (controlled component)
const [nombre, setNombre] = useState('');
<input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}>
```

### Para Botones
```javascript
// ANTES (no funciona)
<button class="btn">Guardar</button>

// DESPUÉS (funciona)
<button class="btn" onclick="guardar()">Guardar</button>
<button class="btn" id="guardarBtn">Guardar</button>

// En JS
document.getElementById('guardarBtn').addEventListener('click', guardar);
```

### Para Modales
```javascript
// Agregar botón de cerrar
<button class="btn" onclick="cerrarModal()">Cerrar</button>
<button class="close-btn" onclick="cerrarModal()">×</button>

// Cerrar al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
```

### Para Navegación
```javascript
// Agregar botón terminar en TODOS los módulos
<button class="exit-btn" onclick="window.location.href='archivos.html'">
    TERMINAR
</button>

// Agregar confirmación antes de salir
function terminar() {
    if (confirm('¿Desea salir sin guardar?')) {
        window.location.href = 'archivos.html';
    }
}
```

## Estado de Correcciones

- ✅ index.html - OK
- ✅ archivos.html - OK
- ✅ mantenimiento.html - OK (funciones implementadas)
- ✅ maestros.html - OK
- ✅ alumnos.html - OK (mejorado)
- ✅ horarios.html - OK (buscador híbrido)
- ✅ salones.html - OK
- ✅ rfc-clientes.html - OK
- ⏳ cursos.html - Pendiente
- ⏳ grupos.html - Pendiente
- ⏳ articulos.html - Pendiente
- ⏳ factores.html - Pendiente
- ⏳ caja.html - Pendiente
- ⏳ reportes.html - Pendiente
- ⏳ examenes-menu.html - Pendiente

## Próximos Pasos

1. Revisar y corregir módulos pendientes
2. Agregar validación de formularios
3. Implementar mensajes de confirmación
4. Agregar indicadores de carga
5. Mejorar manejo de errores
