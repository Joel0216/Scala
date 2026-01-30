// Inicializar Supabase
let supabase = null;
let tiposMovimiento = [];
let articulos = [];
let detalleMovimiento = [];
let contadorFilas = 0;

// Esperar a que se cargue la librería de Supabase
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando nuevo movimiento de inventario...');

    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Inicializar fecha y hora actuales
    const ahora = new Date();
    document.getElementById('fecha').valueAsDate = ahora;
    document.getElementById('hora').value = ahora.toTimeString().substring(0, 5);

    // Cargar datos necesarios
    await cargarTiposMovimiento();
    await cargarArticulos();
    await obtenerSiguienteNumero();

    console.log('Inicialización completa');
});

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    let horas = ahora.getHours();
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12 || 12;
    const horasStr = String(horas).padStart(2, '0');

    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = `${dia}/${mes}/${anio} ${horasStr}:${minutos}:${segundos} ${ampm}`;
    }
}

// Obtener el siguiente número de movimiento
async function obtenerSiguienteNumero() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('movimientos_inventario_maestro')
            .select('numero')
            .order('numero', { ascending: false })
            .limit(1);

        if (error) throw error;

        const siguienteNumero = data && data.length > 0 ? data[0].numero + 1 : 1;
        document.getElementById('numeroMovimiento').value = siguienteNumero;

        console.log(`✓ Siguiente número de movimiento: ${siguienteNumero}`);
    } catch (error) {
        console.error('Error obteniendo siguiente número:', error);
        document.getElementById('numeroMovimiento').value = '1';
    }
}

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

        tiposMovimiento = data || [];
        console.log(`✓ ${tiposMovimiento.length} tipos de movimiento cargados`);

        // Llenar el dropdown
        const select = document.getElementById('tipoMovimiento');
        select.innerHTML = '<option value="">-- Seleccione tipo --</option>';

        tiposMovimiento.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = `${tipo.clave} - ${tipo.descripcion}`;
            option.dataset.afecta = tipo.afecta_inventario;
            select.appendChild(option);
        });

        // Event listener para mostrar info del tipo
        select.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const afecta = selectedOption.dataset.afecta;
            const infoTipo = document.getElementById('infoTipo');

            if (afecta === 'SUMA') {
                infoTipo.textContent = '📈 Este tipo AUMENTA el inventario';
                infoTipo.style.color = '#27ae60';
            } else if (afecta === 'RESTA') {
                infoTipo.textContent = '📉 Este tipo DISMINUYE el inventario';
                infoTipo.style.color = '#e74c3c';
            } else {
                infoTipo.textContent = '➖ Este tipo NO afecta el inventario';
                infoTipo.style.color = '#95a5a6';
            }
        });
    } catch (error) {
        console.error('Error cargando tipos de movimiento:', error);
        alert('Error al cargar tipos de movimiento: ' + error.message);
    }
}

// Cargar artículos
async function cargarArticulos() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('articulos')
            .select(`
                *,
                grupos_articulos (nombre)
            `)
            .eq('activo', true)
            .order('clave', { ascending: true });

        if (error) throw error;

        articulos = data || [];
        console.log(`✓ ${articulos.length} artículos cargados`);
    } catch (error) {
        console.error('Error cargando artículos:', error);
        alert('Error al cargar artículos: ' + error.message);
    }
}

// Agregar nueva fila al detalle
function agregarFila() {
    contadorFilas++;
    const tbody = document.getElementById('bodyDetalle');

    const tr = document.createElement('tr');
    tr.id = `fila-${contadorFilas}`;
    tr.dataset.filaId = contadorFilas;

    tr.innerHTML = `
        <td>${contadorFilas}</td>
        <td>
            <input type="text" 
                   id="clave-${contadorFilas}" 
                   class="input-clave" 
                   placeholder="Buscar..."
                   onfocus="mostrarBusquedaArticulo(${contadorFilas})"
                   readonly>
        </td>
        <td id="desc-${contadorFilas}"></td>
        <td>
            <input type="number" 
                   id="cantidad-${contadorFilas}" 
                   min="1" 
                   value="1"
                   onchange="calcularTotalFila(${contadorFilas})">
        </td>
        <td>
            <input type="number" 
                   id="precio-${contadorFilas}" 
                   step="0.01" 
                   min="0"
                   value="0.00"
                   onchange="calcularTotalFila(${contadorFilas})">
        </td>
        <td id="total-${contadorFilas}" style="font-weight: bold;">$0.00</td>
        <td>
            <button class="btn-eliminar-fila" onclick="eliminarFila(${contadorFilas})">
                ❌
            </button>
        </td>
    `;

    tbody.appendChild(tr);

    // Agregar al array de detalle
    detalleMovimiento.push({
        filaId: contadorFilas,
        articulo_id: null,
        clave: '',
        descripcion: '',
        cantidad: 1,
        precio_unitario: 0,
        total: 0
    });
}

// Mostrar búsqueda de artículo
function mostrarBusquedaArticulo(filaId) {
    const modal = document.getElementById('modalBuscarArticulo');
    modal.style.display = 'block';
    modal.dataset.filaActual = filaId;

    const input = document.getElementById('inputBuscarArticulo');
    input.value = '';
    input.focus();

    // Setup búsqueda en tiempo real
    input.oninput = function () {
        buscarArticulosEnTiempoReal(this.value, filaId);
    };
}

// Buscar artículos en tiempo real
function buscarArticulosEnTiempoReal(termino, filaId) {
    const contenedor = document.getElementById('sugerenciasArticulo');

    if (!termino || termino.length < 1) {
        contenedor.innerHTML = '';
        return;
    }

    const terminoUpper = termino.toUpperCase();
    const resultados = articulos.filter(art =>
        art.clave.toUpperCase().includes(terminoUpper) ||
        art.descripcion.toUpperCase().includes(terminoUpper)
    ).slice(0, 10);

    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = '<div class="sugerencia-item">No se encontraron artículos</div>';
        return;
    }

    resultados.forEach(articulo => {
        const div = document.createElement('div');
        div.className = 'sugerencia-item';
        div.innerHTML = `
            <div class="sugerencia-clave">${articulo.clave}</div>
            <div class="sugerencia-desc">${articulo.descripcion}</div>
            <div class="sugerencia-precio">$${articulo.precio.toFixed(2)}</div>
        `;

        div.onclick = function () {
            seleccionarArticulo(articulo, filaId);
        };

        contenedor.appendChild(div);
    });
}

// Seleccionar artículo para una fila
function seleccionarArticulo(articulo, filaId) {
    // Actualizar campos de la fila
    document.getElementById(`clave-${filaId}`).value = articulo.clave;
    document.getElementById(`desc-${filaId}`).textContent = articulo.descripcion;
    document.getElementById(`precio-${filaId}`).value = articulo.precio.toFixed(2);

    // Actualizar array de detalle
    const index = detalleMovimiento.findIndex(d => d.filaId === filaId);
    if (index !== -1) {
        detalleMovimiento[index].articulo_id = articulo.id;
        detalleMovimiento[index].clave = articulo.clave;
        detalleMovimiento[index].descripcion = articulo.descripcion;
        detalleMovimiento[index].precio_unitario = articulo.precio;
    }

    // Calcular total de la fila
    calcularTotalFila(filaId);

    // Cerrar modal
    cerrarModalArticulo();
}

// Calcular total de una fila
function calcularTotalFila(filaId) {
    const cantidad = parseFloat(document.getElementById(`cantidad-${filaId}`).value) || 0;
    const precio = parseFloat(document.getElementById(`precio-${filaId}`).value) || 0;
    const total = cantidad * precio;

    document.getElementById(`total-${filaId}`).textContent = `$${total.toFixed(2)}`;

    // Actualizar array de detalle
    const index = detalleMovimiento.findIndex(d => d.filaId === filaId);
    if (index !== -1) {
        detalleMovimiento[index].cantidad = cantidad;
        detalleMovimiento[index].precio_unitario = precio;
        detalleMovimiento[index].total = total;
    }

    // Actualizar total general
    calcularTotalGeneral();
}

// Calcular total general
function calcularTotalGeneral() {
    const totalGeneral = detalleMovimiento.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
}

// Eliminar fila
function eliminarFila(filaId) {
    if (confirm('¿Está seguro de eliminar esta fila?')) {
        // Eliminar del DOM
        const fila = document.getElementById(`fila-${filaId}`);
        if (fila) {
            fila.remove();
        }

        // Eliminar del array
        const index = detalleMovimiento.findIndex(d => d.filaId === filaId);
        if (index !== -1) {
            detalleMovimiento.splice(index, 1);
        }

        // Recalcular total
        calcularTotalGeneral();
    }
}

// Limpiar detalle
function limpiarDetalle() {
    if (confirm('¿Está seguro de limpiar todos los artículos?')) {
        document.getElementById('bodyDetalle').innerHTML = '';
        detalleMovimiento = [];
        contadorFilas = 0;
        calcularTotalGeneral();
    }
}

// Cerrar modal de artículo
function cerrarModalArticulo() {
    document.getElementById('modalBuscarArticulo').style.display = 'none';
    document.getElementById('sugerenciasArticulo').innerHTML = '';
}

// Validar antes de guardar
function validarMovimiento() {
    const tipoMovimiento = document.getElementById('tipoMovimiento').value;
    const fecha = document.getElementById('fecha').value;

    const errores = [];

    if (!tipoMovimiento) {
        errores.push('- Tipo de Movimiento');
    }

    if (!fecha) {
        errores.push('- Fecha');
    }

    if (detalleMovimiento.length === 0) {
        errores.push('- Debe agregar al menos un artículo');
    }

    // Validar que todos los artículos tengan datos completos
    const articulosIncompletos = detalleMovimiento.filter(d => !d.articulo_id || d.cantidad <= 0);
    if (articulosIncompletos.length > 0) {
        errores.push('- Todos los artículos deben tener clave y cantidad mayor a 0');
    }

    if (errores.length > 0) {
        alert('Por favor complete los siguientes campos:\n\n' + errores.join('\n'));
        return false;
    }

    return true;
}

// Guardar movimiento
async function guardarMovimiento() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    // Validar
    if (!validarMovimiento()) {
        return;
    }

    try {
        console.log('Guardando movimiento de inventario...');

        // 1. Guardar MAESTRO (Cabecera)
        const maestroData = {
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            tipo_movimiento_id: document.getElementById('tipoMovimiento').value,
            observaciones: document.getElementById('observaciones').value.trim() || null
        };

        const { data: maestro, error: errorMaestro } = await supabase
            .from('movimientos_inventario_maestro')
            .insert([maestroData])
            .select();

        if (errorMaestro) throw errorMaestro;

        const movimientoId = maestro[0].id;
        const numeroMovimiento = maestro[0].numero;

        console.log(`✓ Maestro guardado con ID: ${movimientoId}, Número: ${numeroMovimiento}`);

        // 2. Guardar DETALLE (Artículos)
        const detalleData = detalleMovimiento.map(item => ({
            movimiento_id: movimientoId,
            articulo_id: item.articulo_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            total: item.total
        }));

        const { error: errorDetalle } = await supabase
            .from('movimientos_inventario_detalle')
            .insert(detalleData);

        if (errorDetalle) throw errorDetalle;

        console.log(`✓ ${detalleData.length} artículos guardados en el detalle`);

        // Obtener tipo de movimiento para el mensaje
        const tipoSeleccionado = tiposMovimiento.find(t => t.id === maestroData.tipo_movimiento_id);
        const tipoNombre = tipoSeleccionado ? `${tipoSeleccionado.clave} - ${tipoSeleccionado.descripcion}` : '';

        alert(`Movimiento de inventario guardado correctamente\n\nNúmero: ${numeroMovimiento}\nTipo: ${tipoNombre}\nArtículos: ${detalleData.length}\n\nEl inventario se ha actualizado automáticamente.`);

        // Preguntar si desea crear otro movimiento
        if (confirm('¿Desea crear otro movimiento de inventario?')) {
            window.location.reload();
        } else {
            window.location.href = 'movimientos-inventario.html';
        }
    } catch (error) {
        console.error('Error guardando movimiento:', error);
        alert('Error al guardar movimiento: ' + error.message);
    }
}

// Cancelar
function cancelar() {
    if (confirm('¿Está seguro de cancelar?\n\nSe perderán todos los datos ingresados.')) {
        window.location.href = 'movimientos-inventario.html';
    }
}
