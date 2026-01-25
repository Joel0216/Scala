// Inicializar Supabase
let supabase = null;
let movimientos = [];
let registroActual = 0;
let detalleActual = 0;
let movimientoSeleccionado = null;
let detallesActuales = [];

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de movimientos de inventario...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
            
            // Cargar movimientos desde la base de datos
            await cargarMovimientos();
        } else {
            console.error('✗ Error al conectar con Supabase');
            alert('Error: No se pudo conectar a la base de datos');
        }
    } else {
        console.error('✗ initSupabase no está disponible');
        alert('Error: initSupabase no está disponible');
    }
    
    // Actualizar fecha
    actualizarFecha();
    
    console.log('Inicialización completa');
});

// Actualizar fecha
function actualizarFecha() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    document.getElementById('fecha').textContent = `${dia}/${mes}/${anio}`;
}

// Cargar movimientos desde Supabase
async function cargarMovimientos() {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('movimientos_inventario_maestro')
            .select(`
                *,
                tipos_movimiento (
                    clave,
                    descripcion,
                    afecta_inventario
                )
            `)
            .order('numero', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        movimientos = data || [];
        console.log(`✓ ${movimientos.length} movimientos cargados`);
        
        // Mostrar primer registro si hay movimientos
        if (movimientos.length > 0) {
            await mostrarMovimiento(0);
        }
    } catch (error) {
        console.error('Error cargando movimientos:', error);
        alert('Error al cargar movimientos: ' + error.message);
    }
}

// Cargar detalles de un movimiento
async function cargarDetalles(movimientoId) {
    if (!supabase) return [];
    
    try {
        const { data, error } = await supabase
            .from('movimientos_inventario_detalle')
            .select(`
                *,
                articulos (
                    clave,
                    descripcion,
                    precio,
                    existencia,
                    grupos_articulos (nombre)
                )
            `)
            .eq('movimiento_id', movimientoId)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error cargando detalles:', error);
        return [];
    }
}

// Mostrar movimiento
async function mostrarMovimiento(index) {
    if (index < 0 || index >= movimientos.length) return;
    
    registroActual = index;
    movimientoSeleccionado = movimientos[index];
    
    // Actualizar cabecera
    document.getElementById('numeroMovimiento').value = movimientoSeleccionado.numero;
    document.getElementById('fechaMovimiento').value = movimientoSeleccionado.fecha;
    
    const tipoTexto = movimientoSeleccionado.tipos_movimiento 
        ? movimientoSeleccionado.tipos_movimiento.clave 
        : '';
    document.getElementById('tipoMovimiento').value = tipoTexto;
    
    // Cargar detalles
    detallesActuales = await cargarDetalles(movimientoSeleccionado.id);
    
    // Mostrar primer detalle si existe
    if (detallesActuales.length > 0) {
        mostrarDetalle(0);
    } else {
        limpiarDetalle();
    }
    
    // Actualizar navegación
    document.getElementById('registroActual').textContent = index + 1;
    document.getElementById('totalRegistros').textContent = movimientos.length;
}

// Mostrar detalle
function mostrarDetalle(index) {
    if (index < 0 || index >= detallesActuales.length) return;
    
    detalleActual = index;
    const detalle = detallesActuales[index];
    
    // Actualizar campos del detalle
    document.getElementById('clave').textContent = detalle.articulos?.clave || '';
    document.getElementById('descripcion').textContent = detalle.articulos?.descripcion || '';
    document.getElementById('precio').value = detalle.precio_unitario ? detalle.precio_unitario.toFixed(2) : '0.00';
    document.getElementById('iva').value = '15.00'; // IVA fijo
    document.getElementById('stock').value = detalle.articulos?.existencia || 0;
    document.getElementById('grupo').value = detalle.articulos?.grupos_articulos?.nombre || '';
    
    // Actualizar navegación del detalle
    document.getElementById('registroDetalleActual').textContent = index + 1;
    document.getElementById('totalDetalles').textContent = detallesActuales.length;
}

// Limpiar detalle
function limpiarDetalle() {
    document.getElementById('clave').textContent = '';
    document.getElementById('descripcion').textContent = '';
    document.getElementById('precio').value = '';
    document.getElementById('iva').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('registroDetalleActual').textContent = '0';
    document.getElementById('totalDetalles').textContent = '0';
}

// Botón Nuevo - Redirigir a página de nuevo movimiento
function nuevoMovimiento() {
    window.location.href = 'movimientos-inventario-new.html';
}

// Botón Buscar
function buscarMovimiento() {
    const numero = prompt('Ingrese el número de movimiento a buscar:');
    
    if (!numero) return;
    
    const index = movimientos.findIndex(m => m.numero === parseInt(numero));
    
    if (index !== -1) {
        mostrarMovimiento(index);
    } else {
        alert(`No se encontró el movimiento número ${numero}`);
    }
}

// Borrar movimiento
async function borrarMovimiento() {
    if (!movimientoSeleccionado) {
        alert('Primero debe seleccionar un movimiento');
        return;
    }
    
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el movimiento ${movimientoSeleccionado.numero}?\n\nEsta acción eliminará también todos los detalles y revertirá los cambios en el inventario.\n\nEsta acción no se puede deshacer.`)) {
        try {
            const { error } = await supabase
                .from('movimientos_inventario_maestro')
                .delete()
                .eq('id', movimientoSeleccionado.id);
            
            if (error) throw error;
            
            alert('Movimiento eliminado correctamente');
            
            // Recargar movimientos
            await cargarMovimientos();
        } catch (error) {
            console.error('Error eliminando movimiento:', error);
            alert('Error al eliminar movimiento: ' + error.message);
        }
    }
}

// Borrar operación (detalle individual)
async function borrarOperacion() {
    if (!movimientoSeleccionado || detallesActuales.length === 0) {
        alert('No hay operación seleccionada');
        return;
    }
    
    const detalleSeleccionado = detallesActuales[detalleActual];
    
    if (confirm(`¿Está seguro de eliminar esta operación?\n\nArtículo: ${detalleSeleccionado.articulos?.descripcion}\nCantidad: ${detalleSeleccionado.cantidad}\n\nEsta acción revertirá el cambio en el inventario.`)) {
        try {
            const { error } = await supabase
                .from('movimientos_inventario_detalle')
                .delete()
                .eq('id', detalleSeleccionado.id);
            
            if (error) throw error;
            
            alert('Operación eliminada correctamente');
            
            // Recargar el movimiento actual
            await mostrarMovimiento(registroActual);
        } catch (error) {
            console.error('Error eliminando operación:', error);
            alert('Error al eliminar operación: ' + error.message);
        }
    }
}

// Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de movimientos de inventario?')) {
        window.location.href = 'archivos.html';
    }
}

// Navegación de movimientos (maestro)
function navegarPrimero() {
    if (movimientos.length > 0) mostrarMovimiento(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarMovimiento(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < movimientos.length - 1) mostrarMovimiento(registroActual + 1);
}

function navegarUltimo() {
    if (movimientos.length > 0) mostrarMovimiento(movimientos.length - 1);
}

// Navegación de detalles
function navegarDetalleAnterior() {
    if (detalleActual > 0) mostrarDetalle(detalleActual - 1);
}

function navegarDetalleSiguiente() {
    if (detalleActual < detallesActuales.length - 1) mostrarDetalle(detalleActual + 1);
}
