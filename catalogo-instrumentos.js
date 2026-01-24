// Simulación de datos (en producción, esto vendría de una base de datos)
let instrumentos = [
    { clave: 'BAAY', descripcion: 'BATER. ACUST. YAMAHA' },
    { clave: 'GUEL', descripcion: 'GUITARRA ELECTRICA' },
    { clave: 'PIAN', descripcion: 'PIANO ACUSTICO' },
    { clave: 'VIOC', descripcion: 'VIOLIN CLASICO' }
];

let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const claveInput = document.getElementById('claveInstrumento');
const descripcionInput = document.getElementById('descripcionInstrumento');
const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const inputBusqueda = document.getElementById('inputBusqueda');
const bodyResultados = document.getElementById('bodyResultados');

// Inicializar
function init() {
    if (instrumentos.length > 0) {
        mostrarRegistro(0);
    }
    actualizarContador();
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < instrumentos.length) {
        registroActual = index;
        claveInput.value = instrumentos[index].clave;
        descripcionInput.value = instrumentos[index].descripcion;
        actualizarContador();
    }
}

// Actualizar contador
function actualizarContador() {
    registroSpan.textContent = instrumentos.length > 0 ? registroActual + 1 : 0;
    totalSpan.textContent = instrumentos.length;
    document.getElementById('inputRegistro').max = instrumentos.length;
}

// Botón Nuevo
document.getElementById('btnNuevo').addEventListener('click', () => {
    claveInput.value = '';
    descripcionInput.value = '';
    claveInput.focus();
});

// Botón Buscar
document.getElementById('btnBuscar').addEventListener('click', () => {
    inputBusqueda.value = '';
    modalBusqueda.style.display = 'block';
    inputBusqueda.focus();
});

// Aceptar búsqueda
document.getElementById('btnAceptarBusqueda').addEventListener('click', () => {
    const termino = inputBusqueda.value.trim().toLowerCase();
    
    if (!termino) {
        alert('Por favor ingrese un término de búsqueda');
        return;
    }
    
    const resultados = instrumentos.filter(i => 
        i.clave.toLowerCase().includes(termino) || 
        i.descripcion.toLowerCase().includes(termino)
    );
    
    modalBusqueda.style.display = 'none';
    
    if (resultados.length === 0) {
        alert('No se encontraron resultados');
    } else if (resultados.length === 1) {
        const index = instrumentos.findIndex(i => i.clave === resultados[0].clave);
        mostrarRegistro(index);
    } else {
        mostrarListaResultados(resultados);
    }
});

// Cancelar búsqueda
document.getElementById('btnCancelarBusqueda').addEventListener('click', () => {
    modalBusqueda.style.display = 'none';
});

// Mostrar lista de resultados
function mostrarListaResultados(resultados) {
    bodyResultados.innerHTML = '';
    filaSeleccionada = null;
    
    resultados.forEach((instrumento, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${instrumento.clave}</td>
            <td>${instrumento.descripcion}</td>
        `;
        tr.addEventListener('click', () => {
            if (filaSeleccionada) {
                filaSeleccionada.classList.remove('selected');
            }
            tr.classList.add('selected');
            filaSeleccionada = tr;
        });
        tr.addEventListener('dblclick', () => {
            seleccionarInstrumento(instrumento);
        });
        bodyResultados.appendChild(tr);
    });
    
    modalLista.style.display = 'block';
}

// Seleccionar instrumento
function seleccionarInstrumento(instrumento) {
    const index = instrumentos.findIndex(i => i.clave === instrumento.clave);
    mostrarRegistro(index);
    modalLista.style.display = 'none';
}

// Botón Seleccionar en modal lista
document.getElementById('btnSeleccionar').addEventListener('click', () => {
    if (!filaSeleccionada) {
        alert('Por favor seleccione un instrumento');
        return;
    }
    
    const clave = filaSeleccionada.cells[0].textContent;
    const instrumento = instrumentos.find(i => i.clave === clave);
    seleccionarInstrumento(instrumento);
});

// Cancelar lista
document.getElementById('btnCancelarLista').addEventListener('click', () => {
    modalLista.style.display = 'none';
});

// Botón Borrar
document.getElementById('btnBorrar').addEventListener('click', () => {
    if (instrumentos.length === 0) return;
    
    if (confirm('¿Está seguro de eliminar este registro?')) {
        instrumentos.splice(registroActual, 1);
        if (registroActual >= instrumentos.length) {
            registroActual = instrumentos.length - 1;
        }
        if (instrumentos.length > 0) {
            mostrarRegistro(registroActual);
        } else {
            claveInput.value = '';
            descripcionInput.value = '';
            actualizarContador();
        }
    }
});

// Botón Guardar
document.getElementById('btnGuardar')?.addEventListener('click', () => {
    const clave = claveInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    
    if (clave && descripcion) {
        const existe = instrumentos.find(i => i.clave === clave);
        if (existe) {
            existe.descripcion = descripcion;
            alert('Registro actualizado');
        } else {
            instrumentos.push({ clave, descripcion });
            alert('Registro agregado');
        }
        mostrarRegistro(instrumentos.length - 1);
    }
});

// Botón Terminar
document.getElementById('btnTerminar').addEventListener('click', () => {
    if (confirm('¿Desea salir del catálogo de Instrumentos?')) {
        window.location.href = 'otros-catalogos.html';
    }
});

// Navegación
document.getElementById('btnPrimero').addEventListener('click', () => {
    mostrarRegistro(0);
});

document.getElementById('btnAnterior').addEventListener('click', () => {
    if (registroActual > 0) {
        mostrarRegistro(registroActual - 1);
    }
});

document.getElementById('btnSiguiente').addEventListener('click', () => {
    if (registroActual < instrumentos.length - 1) {
        mostrarRegistro(registroActual + 1);
    }
});

document.getElementById('btnUltimo').addEventListener('click', () => {
    mostrarRegistro(instrumentos.length - 1);
});

document.getElementById('btnBuscarRegistro').addEventListener('click', () => {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= instrumentos.length) {
        mostrarRegistro(num - 1);
    }
});

// Inicializar al cargar
init();
