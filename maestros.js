// Datos de ejemplo de maestros
let maestros = [
    {
        nombre: 'AARON GONZALEZ',
        direccion1: 'CALLE 51 #246 X 44 Y 46 ALTOS',
        direccion2: 'MERIDA, YUCATAN',
        telefono: '9 19 40 39',
        clave: 'AG',
        rfc: '',
        grado: '',
        detallesGrado: 'GUITARRA ELETRICA',
        fechaIngreso: '26-oct-2015'
    },
    {
        nombre: 'ARLETTE MARIA SIERRA ALCOCER',
        direccion1: 'CALLE 30 #200 X 25',
        direccion2: 'MERIDA, YUCATAN',
        telefono: '9 99 12 34 56',
        clave: 'AS',
        rfc: '',
        grado: '',
        detallesGrado: 'CANTO',
        fechaIngreso: '15-ene-2010'
    },
    {
        nombre: 'JESUS PEDROZA',
        direccion1: 'CALLE 40 #150 X 15',
        direccion2: 'MERIDA, YUCATAN',
        telefono: '9 99 87 65 43',
        clave: 'JP',
        rfc: '',
        grado: '',
        detallesGrado: 'PIANO',
        fechaIngreso: '10-mar-2012'
    }
];

let maestroSeleccionado = null;

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

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('direccion1').value = '';
    document.getElementById('direccion2').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('clave').value = '';
    document.getElementById('rfc').value = '';
    document.getElementById('grado').value = '';
    document.getElementById('detallesGrado').value = '';
    document.getElementById('fechaIngreso').value = '';
    maestroSeleccionado = null;
}

// Función para cargar datos del maestro
function cargarDatosMaestro(maestro) {
    maestroSeleccionado = maestro;
    document.getElementById('nombre').value = maestro.nombre;
    document.getElementById('direccion1').value = maestro.direccion1;
    document.getElementById('direccion2').value = maestro.direccion2;
    document.getElementById('telefono').value = maestro.telefono;
    document.getElementById('clave').value = maestro.clave;
    document.getElementById('rfc').value = maestro.rfc;
    document.getElementById('grado').value = maestro.grado;
    document.getElementById('detallesGrado').value = maestro.detallesGrado;
    document.getElementById('fechaIngreso').value = maestro.fechaIngreso;
}

// Botón Nuevo
function nuevoMaestro() {
    const nombre = document.getElementById('nombre').value.trim();
    
    if (!nombre) {
        alert('Por favor ingrese el nombre del maestro');
        return;
    }
    
    const nuevoMaestro = {
        nombre: nombre.toUpperCase(),
        direccion1: document.getElementById('direccion1').value.toUpperCase(),
        direccion2: document.getElementById('direccion2').value.toUpperCase(),
        telefono: document.getElementById('telefono').value,
        clave: document.getElementById('clave').value.toUpperCase(),
        rfc: document.getElementById('rfc').value.toUpperCase(),
        grado: document.getElementById('grado').value,
        detallesGrado: document.getElementById('detallesGrado').value.toUpperCase(),
        fechaIngreso: document.getElementById('fechaIngreso').value
    };
    
    if (maestroSeleccionado) {
        // Actualizar maestro existente
        const index = maestros.findIndex(m => m.nombre === maestroSeleccionado.nombre);
        if (index !== -1) {
            maestros[index] = nuevoMaestro;
            alert('Maestro actualizado correctamente');
        }
    } else {
        // Agregar nuevo maestro
        maestros.push(nuevoMaestro);
        alert('Maestro agregado correctamente');
    }
    
    limpiarFormulario();
}

// Botón Buscar
function buscarMaestro() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        alert('Por favor ingrese un nombre');
        return;
    }
    
    const resultados = maestros.filter(m => 
        m.nombre.toUpperCase().includes(termino) ||
        m.nombre.toUpperCase().startsWith(termino)
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        alert('No se encontraron maestros con ese nombre');
    } else if (resultados.length === 1) {
        cargarDatosMaestro(resultados[0]);
    } else {
        mostrarListaMaestros(resultados);
    }
}

// Mostrar lista de maestros
function mostrarListaMaestros(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    resultados.forEach((maestro, index) => {
        const tr = document.createElement('tr');
        tr.onclick = function() {
            cargarDatosMaestro(maestro);
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${maestro.nombre}</td>
            <td>${maestro.clave}</td>
            <td>${maestro.telefono}</td>
            <td>${maestro.detallesGrado}</td>
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
function borrarMaestro() {
    if (!maestroSeleccionado) {
        alert('Primero debe seleccionar un maestro');
        return;
    }
    
    if (confirm('¿Está seguro de eliminar este maestro?')) {
        const index = maestros.findIndex(m => m.nombre === maestroSeleccionado.nombre);
        if (index !== -1) {
            maestros.splice(index, 1);
            alert('Maestro eliminado correctamente');
            limpiarFormulario();
        }
    }
}

// Botón Terminar
function terminar() {
    window.location.href = 'archivos.html';
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modalBusqueda = document.getElementById('modalBusqueda');
    const modalLista = document.getElementById('modalLista');
    
    if (event.target === modalBusqueda) {
        modalBusqueda.style.display = 'none';
    }
    if (event.target === modalLista) {
        modalLista.style.display = 'none';
    }
}
