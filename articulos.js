// Datos de ejemplo de artículos
let articulos = [
    { clave: '001', descripcion: 'METODO PIANO BASICO 1', grupo: 'Métodos', precio: 120.00, iva: 0.00, stock: 15 },
    { clave: '002', descripcion: 'METODO PIANO BASICO 2', grupo: 'Métodos', precio: 120.00, iva: 0.00, stock: 12 },
    { clave: '003', descripcion: 'METODO GUITARRA CLASICA 1', grupo: 'Métodos', precio: 80.00, iva: 0.00, stock: 20 },
    { clave: '004', descripcion: 'METODO GUITARRA ACUSTICA 1 ARTE', grupo: 'Métodos', precio: 80.00, iva: 0.00, stock: 10 },
    { clave: '005', descripcion: 'METODO BATERIA NIVEL 1', grupo: 'Métodos', precio: 95.00, iva: 0.00, stock: 8 },
    { clave: '006', descripcion: 'CUERDAS GUITARRA ACUSTICA', grupo: 'Cuerdas', precio: 150.00, iva: 0.16, stock: 50 },
    { clave: '007', descripcion: 'CUERDAS GUITARRA ELECTRICA', grupo: 'Cuerdas', precio: 180.00, iva: 0.16, stock: 45 },
    { clave: '008', descripcion: 'AFINADOR DIGITAL', grupo: 'Accesorios', precio: 250.00, iva: 0.16, stock: 25 },
    { clave: '009', descripcion: 'METRONOMO DIGITAL', grupo: 'Accesorios', precio: 300.00, iva: 0.16, stock: 18 },
    { clave: '010', descripcion: 'ATRIL METALICO', grupo: 'Accesorios', precio: 350.00, iva: 0.16, stock: 30 }
];

let registroActual = 0;
let articuloSeleccionado = null;
let datosOriginales = null;
let modoEdicion = false;

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

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// Generar clave automáticamente basada en la descripción
function generarClave(descripcion) {
    if (!descripcion) return '';
    
    const desc = descripcion.trim().toUpperCase();
    const palabras = desc.split(' ');
    
    // Si tiene número al final
    const ultimaPalabra = palabras[palabras.length - 1];
    if (!isNaN(ultimaPalabra)) {
        return palabras[0].charAt(0) + ultimaPalabra;
    }
    
    // Si es una sola palabra, tomar las dos primeras letras
    if (palabras.length === 1) {
        return desc.substring(0, 2);
    }
    
    // Si son dos o más palabras, tomar iniciales
    let clave = '';
    for (let i = 0; i < Math.min(2, palabras.length); i++) {
        clave += palabras[i].charAt(0);
    }
    
    return clave;
}

// Generar clave numérica secuencial
function generarClaveNumerica() {
    if (articulos.length === 0) return '001';
    
    // Encontrar el número más alto
    let maxNum = 0;
    articulos.forEach(art => {
        const num = parseInt(art.clave);
        if (!isNaN(num) && num > maxNum) {
            maxNum = num;
        }
    });
    
    return String(maxNum + 1).padStart(3, '0');
}

// Detectar cambios en los campos
function detectarCambios() {
    if (!datosOriginales || !articuloSeleccionado) return false;
    
    const datosActuales = {
        descripcion: document.getElementById('descripcion').value,
        grupo: document.getElementById('grupo').value,
        precio: parseFloat(document.getElementById('precio').value),
        iva: parseFloat(document.getElementById('iva').value),
        stock: parseInt(document.getElementById('stock').value)
    };
    
    return JSON.stringify(datosOriginales) !== JSON.stringify(datosActuales);
}

// Mostrar/ocultar botón guardar
function actualizarBotonGuardar() {
    const btnGuardar = document.getElementById('btnGuardar');
    if (detectarCambios()) {
        btnGuardar.style.display = 'inline-block';
        modoEdicion = true;
    } else {
        btnGuardar.style.display = 'none';
        modoEdicion = false;
    }
}

// Agregar listeners a los campos para detectar cambios
document.getElementById('descripcion').addEventListener('input', actualizarBotonGuardar);
document.getElementById('grupo').addEventListener('change', actualizarBotonGuardar);
document.getElementById('precio').addEventListener('input', actualizarBotonGuardar);
document.getElementById('iva').addEventListener('input', actualizarBotonGuardar);
document.getElementById('stock').addEventListener('input', actualizarBotonGuardar);

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('clave').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('precio').value = '80';
    document.getElementById('iva').value = '0.00';
    document.getElementById('stock').value = '10';
    articuloSeleccionado = null;
    datosOriginales = null;
    document.getElementById('btnGuardar').style.display = 'none';
    modoEdicion = false;
}

// Función para cargar datos del artículo
function cargarDatosArticulo(articulo) {
    articuloSeleccionado = articulo;
    document.getElementById('clave').value = articulo.clave;
    document.getElementById('descripcion').value = articulo.descripcion;
    document.getElementById('grupo').value = articulo.grupo;
    document.getElementById('precio').value = articulo.precio.toFixed(2);
    document.getElementById('iva').value = articulo.iva.toFixed(2);
    document.getElementById('stock').value = articulo.stock;
    
    // Guardar datos originales para detectar cambios
    datosOriginales = {
        descripcion: articulo.descripcion,
        grupo: articulo.grupo,
        precio: articulo.precio,
        iva: articulo.iva,
        stock: articulo.stock
    };
    
    document.getElementById('btnGuardar').style.display = 'none';
    modoEdicion = false;
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < articulos.length) {
        registroActual = index;
        cargarDatosArticulo(articulos[index]);
        document.getElementById('registroActual').textContent = index + 1;
        document.getElementById('inputRegistro').value = index + 1;
        document.getElementById('inputRegistro').max = articulos.length;
        document.getElementById('totalRegistros').textContent = articulos.length;
    }
}

// Botón Nuevo
function nuevoArticulo() {
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!descripcion) {
        alert('Por favor ingrese la descripción del artículo');
        return;
    }
    
    const nuevoArticulo = {
        clave: generarClaveNumerica(),
        descripcion: descripcion.toUpperCase(),
        grupo: document.getElementById('grupo').value,
        precio: parseFloat(document.getElementById('precio').value) || 0,
        iva: parseFloat(document.getElementById('iva').value) || 0,
        stock: parseInt(document.getElementById('stock').value) || 0
    };
    
    articulos.push(nuevoArticulo);
    alert('Artículo agregado correctamente');
    mostrarRegistro(articulos.length - 1);
}

// Botón Guardar (para edición)
function guardarCambios() {
    if (!articuloSeleccionado) {
        alert('No hay artículo seleccionado');
        return;
    }
    
    const index = articulos.findIndex(a => a.clave === articuloSeleccionado.clave);
    if (index !== -1) {
        articulos[index].descripcion = document.getElementById('descripcion').value.toUpperCase();
        articulos[index].grupo = document.getElementById('grupo').value;
        articulos[index].precio = parseFloat(document.getElementById('precio').value) || 0;
        articulos[index].iva = parseFloat(document.getElementById('iva').value) || 0;
        articulos[index].stock = parseInt(document.getElementById('stock').value) || 0;
        
        alert('Artículo actualizado correctamente');
        mostrarRegistro(index);
    }
}

// Botón Buscar
function buscarArticulo() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        alert('Por favor ingrese una clave o grupo');
        return;
    }
    
    const resultados = articulos.filter(a => 
        a.clave.toUpperCase().includes(termino) ||
        a.grupo.toUpperCase().includes(termino) ||
        a.descripcion.toUpperCase().includes(termino) ||
        a.clave.toUpperCase().startsWith(termino) ||
        a.grupo.toUpperCase().startsWith(termino)
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        alert('No se encontraron artículos');
    } else if (resultados.length === 1) {
        const index = articulos.findIndex(a => a.clave === resultados[0].clave);
        mostrarRegistro(index);
    } else {
        mostrarListaArticulos(resultados);
    }
}

// Mostrar lista de artículos
function mostrarListaArticulos(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    resultados.forEach((articulo) => {
        const tr = document.createElement('tr');
        tr.onclick = function() {
            const index = articulos.findIndex(a => a.clave === articulo.clave);
            mostrarRegistro(index);
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${articulo.clave}</td>
            <td>${articulo.descripcion}</td>
            <td>${articulo.grupo}</td>
            <td>$${articulo.precio.toFixed(2)}</td>
            <td>${articulo.stock}</td>
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

// Botón Borrar
function borrarArticulo() {
    if (!articuloSeleccionado) {
        alert('Primero debe seleccionar un artículo');
        return;
    }
    
    if (confirm('¿Está seguro de eliminar este artículo?')) {
        const index = articulos.findIndex(a => a.clave === articuloSeleccionado.clave);
        if (index !== -1) {
            articulos.splice(index, 1);
            alert('Artículo eliminado correctamente');
            if (articulos.length > 0) {
                mostrarRegistro(Math.min(index, articulos.length - 1));
            } else {
                limpiarFormulario();
                document.getElementById('totalRegistros').textContent = '0';
            }
        }
    }
}

// Botón Terminar
function terminar() {
    if (modoEdicion) {
        if (confirm('Hay cambios sin guardar. ¿Desea salir sin guardar?')) {
            window.location.href = 'archivos.html';
        }
    } else {
        window.location.href = 'archivos.html';
    }
}

// Navegación
function navegarPrimero() {
    if (articulos.length > 0) mostrarRegistro(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < articulos.length - 1) mostrarRegistro(registroActual + 1);
}

function navegarUltimo() {
    if (articulos.length > 0) mostrarRegistro(articulos.length - 1);
}

function navegarRegistro() {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= articulos.length) {
        mostrarRegistro(num - 1);
    }
}

// Inicializar
if (articulos.length > 0) {
    mostrarRegistro(0);
}
