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

    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
            await cargarMovimientos();
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Actualizar fecha
    actualizarFecha();

    // Cargar tipos de movimiento en el select
    await cargarTiposMovimiento();

    console.log('Inicialización completa');
});

// Cargar tipos de movimiento
async function cargarTiposMovimiento() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('tipos_movimiento')
            .select('*')
            .eq('activo', true)
            .order('clave', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('tipoMovimiento');
        if (select && data && data.length > 0) {
            // Mantener la opción "Seleccione..." y agregar las opciones desde BD
            select.innerHTML = '<option value="">Seleccione...</option>';
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.clave;
                option.textContent = `${tipo.clave} - ${tipo.descripcion}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando tipos de movimiento:', error);
        // Si la tabla no existe, usar los valores hardcodeados del HTML
    }
}

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
                    id,
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

        // Actualizar total de registros
        const totalRegistrosEl = document.getElementById('totalRegistros');
        if (totalRegistrosEl) totalRegistrosEl.textContent = movimientos.length;

        // Mostrar primer registro si hay movimientos
        if (movimientos.length > 0) {
            await mostrarMovimiento(0);
        } else {
            // Limpiar si no hay movimientos
            limpiarMovimiento();
        }
    } catch (error) {
        console.error('Error cargando movimientos:', error);
        // No mostrar alert si la tabla no existe aún
        if (!error.message.includes('does not exist')) {
            alert('Error al cargar movimientos: ' + error.message);
        }
    }
}

// Limpiar movimiento
function limpiarMovimiento() {
    const numeroMovimientoEl = document.getElementById('numeroMovimiento');
    const fechaMovimientoEl = document.getElementById('fechaMovimiento');
    const tipoMovimientoEl = document.getElementById('tipoMovimiento');

    if (numeroMovimientoEl) numeroMovimientoEl.value = '';
    if (fechaMovimientoEl) fechaMovimientoEl.value = new Date().toISOString().split('T')[0];
    if (tipoMovimientoEl) tipoMovimientoEl.value = '';

    limpiarDetalle();
    detallesActuales = [];
    movimientoSeleccionado = null;
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
    const numeroMovimientoEl = document.getElementById('numeroMovimiento');
    const fechaMovimientoEl = document.getElementById('fechaMovimiento');
    const tipoMovimientoEl = document.getElementById('tipoMovimiento');

    if (numeroMovimientoEl) numeroMovimientoEl.value = movimientoSeleccionado.numero || '';
    if (fechaMovimientoEl) fechaMovimientoEl.value = movimientoSeleccionado.fecha || '';

    // Obtener clave del tipo de movimiento
    let tipoTexto = '';
    if (movimientoSeleccionado.tipos_movimiento) {
        tipoTexto = movimientoSeleccionado.tipos_movimiento.clave || '';
    } else if (movimientoSeleccionado.tipo_movimiento_id) {
        // Si tenemos el ID, buscar la clave correspondiente
        try {
            const { data: tipoData, error: tipoError } = await supabase
                .from('tipos_movimiento')
                .select('clave')
                .eq('id', movimientoSeleccionado.tipo_movimiento_id)
                .single();

            if (!tipoError && tipoData) {
                tipoTexto = tipoData.clave;
            }
        } catch (e) {
            console.error('Error obteniendo tipo de movimiento:', e);
        }
    }

    if (tipoMovimientoEl) tipoMovimientoEl.value = tipoTexto;

    // Cargar detalles
    detallesActuales = await cargarDetalles(movimientoSeleccionado.id);

    // Actualizar tabla de detalles
    actualizarTablaDetalles();

    // Mostrar primer detalle si existe
    if (detallesActuales.length > 0) {
        detalleActual = 0;
        mostrarDetalle(0);
    } else {
        limpiarDetalle();
    }

    // Actualizar navegación
    const registroActualEl = document.getElementById('registroActual');
    const totalRegistrosEl = document.getElementById('totalRegistros');
    if (registroActualEl) registroActualEl.textContent = index + 1;
    if (totalRegistrosEl) totalRegistrosEl.textContent = movimientos.length;

    // Actualizar tabla de detalles
    actualizarTablaDetalles();
}

// Actualizar tabla de detalles
function actualizarTablaDetalles() {
    const tbody = document.getElementById('tablaDetalles');
    if (!tbody) return;

    // Limpiar tabla
    tbody.innerHTML = '';

    if (detallesActuales.length === 0) {
        // Agregar filas vacías
        for (let i = 0; i < 3; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i === 0 ? '►' : ''}</td>
                <td><input type="text" class="input-clave" placeholder="Clave" readonly></td>
                <td><input type="number" class="input-cantidad" value="0" readonly></td>
            `;
            tbody.appendChild(tr);
        }

        // Actualizar total
        const totalDetallesEl = document.getElementById('totalDetalles');
        if (totalDetallesEl) totalDetallesEl.textContent = '0';
        return;
    }

    // Mostrar detalles
    detallesActuales.forEach((detalle, index) => {
        const tr = document.createElement('tr');
        const esSeleccionado = index === detalleActual;
        tr.innerHTML = `
            <td>${esSeleccionado ? '►' : ''}</td>
            <td><input type="text" class="input-clave" value="${detalle.articulos?.clave || ''}" readonly></td>
            <td><input type="number" class="input-cantidad" value="${detalle.cantidad || 0}" readonly></td>
        `;

        // Resaltar fila seleccionada
        if (esSeleccionado) {
            tr.style.backgroundColor = '#E6F2FF';
        }

        tbody.appendChild(tr);
    });

    // Agregar fila de totales si hay detalles
    if (detallesActuales.length > 0) {
        const tr = document.createElement('tr');
        const total = detallesActuales.reduce((sum, d) => sum + (d.cantidad || 0), 0);
        tr.innerHTML = `
            <td>*</td>
            <td></td>
            <td><strong>${total}</strong></td>
        `;
        tr.style.fontWeight = 'bold';
        tbody.appendChild(tr);
    }

    // Actualizar total
    const totalDetallesEl = document.getElementById('totalDetalles');
    if (totalDetallesEl) totalDetallesEl.textContent = detallesActuales.length;
}

// Limpiar detalle
function limpiarDetalle() {
    const descripcionEl = document.getElementById('descripcionArticulo');
    const precioEl = document.getElementById('precioArticulo');
    const ivaEl = document.getElementById('ivaArticulo');
    const stockEl = document.getElementById('stockArticulo');
    const grupoEl = document.getElementById('grupoArticulo');
    const totalDetallesEl = document.getElementById('totalDetalles');

    if (descripcionEl) descripcionEl.value = '';
    if (precioEl) precioEl.value = '';
    if (ivaEl) ivaEl.value = '';
    if (stockEl) stockEl.value = '';
    if (grupoEl) grupoEl.value = '';
    if (totalDetallesEl) totalDetallesEl.textContent = '0';

    // Limpiar tabla
    actualizarTablaDetalles();
}

// Botón Nuevo - Redirigir a página de nuevo movimiento
function nuevoMovimiento() {
    window.location.href = 'movimientos-inventario-new.html';
}

// Botón Buscar
function buscarMovimiento() {
    const modal = document.getElementById('modalBusqueda');
    if (modal) {
        modal.style.display = 'block';
        const inputBusqueda = document.getElementById('inputBusqueda');
        if (inputBusqueda) {
            inputBusqueda.value = '';
            inputBusqueda.focus();
        }
    }
}

// Aceptar búsqueda
async function aceptarBusqueda() {
    const inputBusqueda = document.getElementById('inputBusqueda');
    if (!inputBusqueda) return;

    const numero = inputBusqueda.value.trim();
    cerrarModal();

    if (!numero) {
        alert('Debe ingresar un número de movimiento');
        return;
    }

    const index = movimientos.findIndex(m => m.numero === parseInt(numero));

    if (index !== -1) {
        await mostrarMovimiento(index);
    } else {
        alert(`No se encontró el movimiento número ${numero}`);
    }
}

// Cerrar modal
function cerrarModal() {
    const modalBusqueda = document.getElementById('modalBusqueda');
    const modalLista = document.getElementById('modalLista');
    if (modalBusqueda) modalBusqueda.style.display = 'none';
    if (modalLista) modalLista.style.display = 'none';
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

// Borrar todo el movimiento
async function borrarTodo() {
    if (!movimientoSeleccionado) {
        alert('Primero debe seleccionar un movimiento');
        return;
    }

    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    if (confirm(`¿Está seguro de eliminar TODO el movimiento ${movimientoSeleccionado.numero}?\n\nEsta acción eliminará:\n- El movimiento completo\n- Todos los detalles asociados\n- Revertirá todos los cambios en el inventario\n\nEsta acción NO se puede deshacer.`)) {
        try {
            // Primero eliminar los detalles
            const { error: errorDetalles } = await supabase
                .from('movimientos_inventario_detalle')
                .delete()
                .eq('movimiento_id', movimientoSeleccionado.id);

            if (errorDetalles) throw errorDetalles;

            // Luego eliminar el movimiento maestro
            const { error: errorMaestro } = await supabase
                .from('movimientos_inventario_maestro')
                .delete()
                .eq('id', movimientoSeleccionado.id);

            if (errorMaestro) throw errorMaestro;

            alert('Movimiento eliminado completamente');

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
function terminarMovimientos() {
    if (confirm('¿Desea salir del módulo de movimientos de inventario?')) {
        window.location.href = 'archivos.html';
    }
}

// Navegación de movimientos (maestro)
async function navegarPrimero() {
    if (movimientos.length > 0) await mostrarMovimiento(0);
}

async function navegarAnterior() {
    if (registroActual > 0) await mostrarMovimiento(registroActual - 1);
}

async function navegarSiguiente() {
    if (registroActual < movimientos.length - 1) await mostrarMovimiento(registroActual + 1);
}

async function navegarUltimo() {
    if (movimientos.length > 0) await mostrarMovimiento(movimientos.length - 1);
}

async function navegarRegistro() {
    const input = document.getElementById('inputRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= movimientos.length) {
            await mostrarMovimiento(num - 1);
        }
    }
}

// Navegación de detalles
function navegarDetalleAnterior() {
    if (detalleActual > 0) mostrarDetalle(detalleActual - 1);
}

function navegarDetalleSiguiente() {
    if (detalleActual < detallesActuales.length - 1) mostrarDetalle(detalleActual + 1);
}

function navegarRegistro() {
    const input = document.getElementById('inputRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= movimientos.length) {
            mostrarMovimiento(num - 1);
        }
    }
}

// Navegación de detalles
function navegarDetallesPrimero() {
    if (detallesActuales.length > 0) mostrarDetalle(0);
}

function navegarDetallesAnterior() {
    if (detalleActual > 0) mostrarDetalle(detalleActual - 1);
}

function navegarDetallesSiguiente() {
    if (detalleActual < detallesActuales.length - 1) mostrarDetalle(detalleActual + 1);
}

function navegarDetallesUltimo() {
    if (detallesActuales.length > 0) mostrarDetalle(detallesActuales.length - 1);
}

function navegarDetallesRegistro() {
    const input = document.getElementById('inputDetalleRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= detallesActuales.length) {
            mostrarDetalle(num - 1);
        }
    }
}

// Mostrar detalle
function mostrarDetalle(index) {
    if (index < 0 || index >= detallesActuales.length) return;

    detalleActual = index;
    const detalle = detallesActuales[index];

    // Actualizar información del artículo
    document.getElementById('descripcionArticulo').value = detalle.articulos?.descripcion || '';
    document.getElementById('precioArticulo').value = detalle.precio_unitario ? detalle.precio_unitario.toFixed(2) : '0.00';
    document.getElementById('ivaArticulo').value = '15.00';
    document.getElementById('stockArticulo').value = detalle.articulos?.existencia || 0;
    document.getElementById('grupoArticulo').value = detalle.articulos?.grupos_articulos?.nombre || '';

    // Actualizar navegación del detalle
    const inputDetalle = document.getElementById('inputDetalleRegistro');
    const totalDetalles = document.getElementById('totalDetalles');
    if (inputDetalle) inputDetalle.value = index + 1;
    if (totalDetalles) totalDetalles.textContent = detallesActuales.length;

    // Actualizar tabla para resaltar el detalle seleccionado
    actualizarTablaDetalles();
}
