// Estructura de datos: Cabecera (1) -> Detalles (N)
let movimientos = [
    {
        numeroMovimiento: 1002,
        tipo: 'AD',
        fecha: '2024-01-15',
        detalles: [
            { clave: 'RMPI', cantidad: 4 },
            { clave: 'MTGA', cantidad: 2 },
            { clave: 'CPGE', cantidad: 3 }
        ]
    },
    {
        numeroMovimiento: 1074,
        tipo: 'S',
        fecha: '2024-01-20',
        detalles: [
            { clave: 'IMI', cantidad: 1 },
            { clave: 'CPGA', cantidad: 2 },
            { clave: 'MTBA2', cantidad: 2 },
            { clave: 'CPGE', cantidad: 2 }
        ]
    }
];

// Catálogo de artículos (simulado)
let articulos = [
    { clave: 'RMPI', descripcion: 'METODO PIANO BASICO 1', precio: 120.00, iva: 0.00, stock: 15, grupo: 'Métodos' },
    { clave: 'MTGA', descripcion: 'METODO GUITARRA ACUSTICA 1', precio: 80.00, iva: 0.00, stock: 10, grupo: 'Métodos' },
    { clave: 'CPGE', descripcion: 'CUERDAS GUITARRA ELECTRICA', precio: 180.00, iva: 0.16, stock: 45, grupo: 'Cuerdas' },
    { clave: 'IMI', descripcion: 'AFINADOR DIGITAL', precio: 250.00, iva: 0.16, stock: 25, grupo: 'Accesorios' },
    { clave: 'CPGA', descripcion: 'CUERDAS GUITARRA ACUSTICA', precio: 150.00, iva: 0.16, stock: 50, grupo: 'Cuerdas' },
    { clave: 'MTBA2', descripcion: 'METODO BATERIA NIVEL 2', precio: 95.00, iva: 0.00, stock: 8, grupo: 'Métodos' }
];

let registroActual = 0;
let detalleActual = 0;
let movimientoSeleccionado = null;

// Actualizar fecha
function actualizarFecha() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    document.getElementById('fecha').textContent = `${dia}/${mes}/${anio}`;
}

actualizarFecha();

// Generar siguiente número de movimiento
function generarNumeroMovimiento() {
    if (movimientos.length === 0) return 1;
    const maxNum = Math.max(...movimientos.map(m => m.numeroMovimiento));
    return maxNum + 1;
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('numeroMovimiento').value = '';
    document.getElementById('fechaMovimiento').value = '';
    document.getElementById('tipoMovimiento').value = '';
    limpiarTablaDetalles();
    limpiarInfoArticulo();
    movimientoSeleccionado = null;
}

// Limpiar tabla de detalles
function limpiarTablaDetalles() {
    const tbody = document.getElementById('tablaDetalles');
    tbody.innerHTML = `
        <tr>
            <td>►</td>
            <td><input type="text" class="input-clave" placeholder="Clave" onchange="buscarArticuloPorClave(this.value)"></td>
            <td><input type="number" class="input-cantidad" value="0"></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>*</td>
            <td></td>
            <td>0</td>
        </tr>
    `;
}

// Limpiar información del artículo
function limpiarInfoArticulo() {
    document.getElementById('descripcionArticulo').value = '';
    document.getElementById('precioArticulo').value = '';
    document.getElementById('ivaArticulo').value = '';
    document.getElementById('stockArticulo').value = '';
    document.getElementById('grupoArticulo').value = '';
}

// Buscar artículo por clave
function buscarArticuloPorClave(clave) {
    if (!clave) return;
    
    const articulo = articulos.find(a => a.clave.toUpperCase() === clave.toUpperCase());
    if (articulo) {
        document.getElementById('descripcionArticulo').value = articulo.descripcion;
        document.getElementById('precioArticulo').value = articulo.precio.toFixed(2);
        document.getElementById('ivaArticulo').value = articulo.iva.toFixed(2);
        document.getElementById('stockArticulo').value = articulo.stock.toFixed(2);
        document.getElementById('grupoArticulo').value = articulo.grupo;
    } else {
        alert('Artículo no encontrado');
        limpiarInfoArticulo();
    }
}

// Cargar movimiento en el formulario
function cargarMovimiento(movimiento) {
    movimientoSeleccionado = movimiento;
    document.getElementById('numeroMovimiento').value = movimiento.numeroMovimiento;
    document.getElementById('fechaMovimiento').value = movimiento.fecha;
    document.getElementById('tipoMovimiento').value = movimiento.tipo;
    
    // Cargar detalles en la tabla
    const tbody = document.getElementById('tablaDetalles');
    tbody.innerHTML = '';
    
    movimiento.detalles.forEach((detalle, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index === 0 ? '►' : ''}</td>
            <td><input type="text" class="input-clave" value="${detalle.clave}" onchange="buscarArticuloPorClave(this.value)"></td>
            <td><input type="number" class="input-cantidad" value="${detalle.cantidad}"></td>
        `;
        tbody.appendChild(tr);
    });
    
    // Agregar fila vacía
    tbody.innerHTML += `
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
    
    // Agregar fila de total
    const total = movimiento.detalles.reduce((sum, d) => sum + d.cantidad, 0);
    tbody.innerHTML += `
        <tr>
            <td>*</td>
            <td></td>
            <td>${total}</td>
        </tr>
    `;
    
    document.getElementById('totalDetalles').textContent = movimiento.detalles.length;
    
    // Cargar primer artículo
    if (movimiento.detalles.length > 0) {
        buscarArticuloPorClave(movimiento.detalles[0].clave);
    }
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < movimientos.length) {
        registroActual = index;
        cargarMovimiento(movimientos[index]);
        document.getElementById('registroActual').textContent = index + 1;
        document.getElementById('inputRegistro').value = index + 1;
        document.getElementById('inputRegistro').max = movimientos.length;
        document.getElementById('totalRegistros').textContent = movimientos.length;
    }
}

// Botón Nuevo
function nuevoMovimiento() {
    const tipo = document.getElementById('tipoMovimiento').value;
    const fecha = document.getElementById('fechaMovimiento').value;
    
    if (!tipo || !fecha) {
        alert('Por favor complete el tipo y fecha del movimiento');
        return;
    }
    
    // Obtener detalles de la tabla
    const tbody = document.getElementById('tablaDetalles');
    const filas = tbody.querySelectorAll('tr');
    const detalles = [];
    
    filas.forEach((fila, index) => {
        const inputs = fila.querySelectorAll('input');
        if (inputs.length === 2) {
            const clave = inputs[0].value.trim();
            const cantidad = parseInt(inputs[1].value) || 0;
            
            if (clave && cantidad > 0) {
                detalles.push({ clave: clave.toUpperCase(), cantidad });
            }
        }
    });
    
    if (detalles.length === 0) {
        alert('Debe agregar al menos un artículo');
        return;
    }
    
    const nuevoMov = {
        numeroMovimiento: generarNumeroMovimiento(),
        tipo,
        fecha,
        detalles
    };
    
    movimientos.push(nuevoMov);
    alert(`Movimiento #${nuevoMov.numeroMovimiento} guardado correctamente`);
    mostrarRegistro(movimientos.length - 1);
}

// Botón Buscar
function buscarMovimiento() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim();
    
    if (!termino) {
        alert('Por favor ingrese un número de movimiento');
        return;
    }
    
    const resultados = movimientos.filter(m => 
        m.numeroMovimiento.toString().includes(termino)
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        alert('No se encontraron movimientos');
    } else if (resultados.length === 1) {
        const index = movimientos.findIndex(m => m.numeroMovimiento === resultados[0].numeroMovimiento);
        mostrarRegistro(index);
    } else {
        mostrarListaMovimientos(resultados);
    }
}

// Mostrar lista de movimientos
function mostrarListaMovimientos(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    resultados.forEach((mov) => {
        const tr = document.createElement('tr');
        tr.onclick = function() {
            const index = movimientos.findIndex(m => m.numeroMovimiento === mov.numeroMovimiento);
            mostrarRegistro(index);
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${mov.numeroMovimiento}</td>
            <td>${mov.tipo}</td>
            <td>${mov.fecha}</td>
            <td>${mov.detalles.length} artículos</td>
        `;
        tbody.appendChild(tr);
    });
    
    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalBusqueda').style.display = 'none';
    document.getElementById('modalLista').style.display = 'none';
}

// Botón Borra Todo
function borrarTodo() {
    if (!movimientoSeleccionado) {
        alert('Primero debe seleccionar un movimiento');
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el movimiento #${movimientoSeleccionado.numeroMovimiento} y todos sus detalles?`)) {
        const index = movimientos.findIndex(m => m.numeroMovimiento === movimientoSeleccionado.numeroMovimiento);
        if (index !== -1) {
            movimientos.splice(index, 1);
            alert('Movimiento eliminado correctamente');
            if (movimientos.length > 0) {
                mostrarRegistro(Math.min(index, movimientos.length - 1));
            } else {
                limpiarFormulario();
                document.getElementById('totalRegistros').textContent = '0';
            }
        }
    }
}

// Botón Borra Operación (borra solo la cabecera, mantiene detalles huérfanos - no recomendado)
function borrarOperacion() {
    alert('Esta función borrará solo la cabecera. Use "Borra Todo" para eliminar el movimiento completo.');
}

// Botón Terminar
function terminar() {
    window.location.href = 'archivos.html';
}

// Navegación principal
function navegarPrimero() {
    if (movimientos.length > 0) mostrarRegistro(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < movimientos.length - 1) mostrarRegistro(registroActual + 1);
}

function navegarUltimo() {
    if (movimientos.length > 0) mostrarRegistro(movimientos.length - 1);
}

function navegarRegistro() {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= movimientos.length) {
        mostrarRegistro(num - 1);
    }
}

// Navegación de detalles (placeholder)
function navegarDetallesPrimero() {}
function navegarDetallesAnterior() {}
function navegarDetallesSiguiente() {}
function navegarDetallesUltimo() {}
function navegarDetallesRegistro() {}

// Inicializar
if (movimientos.length > 0) {
    mostrarRegistro(0);
}
