// Datos de medios con las reglas de nomenclatura especificadas
let medios = [
    { clave: 'ANUN', descripcion: 'ANUNCIO EXTERIOR' },
    { clave: 'CONC', descripcion: 'POR CONCIERTO' },
    { clave: 'DIR', descripcion: 'DIRECTORIO' },
    { clave: 'DY', descripcion: 'DIARIO DE YUCATAN' },
    { clave: 'EVE', descripcion: 'EVENTO' },
    { clave: 'FACE', descripcion: 'FACEBOOK' },
    { clave: 'FOLL', descripcion: 'POR FOLLETO' },
    { clave: 'INT', descripcion: 'INTERNET' },
    { clave: 'PERI', descripcion: 'PERIODICO' },
    { clave: 'POST', descripcion: 'POSTER' },
    { clave: 'PROM', descripcion: 'POR PROMOCION' },
    { clave: 'RADI', descripcion: 'RADIO' },
    { clave: 'REC', descripcion: 'RECOMENDACION' },
    { clave: 'REI', descripcion: 'REINSCRIPCION' },
    { clave: 'REVI', descripcion: 'REVISTA LOCAL' },
    { clave: 'T.V.', descripcion: 'TELEVISION' },
    { clave: 'VOLA', descripcion: 'VOLANTE' },
    { clave: 'BLIV', descripcion: 'BECA LIVERPOOL' },
    { clave: 'BOTR', descripcion: 'BECA OTROS' },
    { clave: 'BPH', descripcion: 'BECA PALACIO DE HIERRO' },
    { clave: 'BSEA', descripcion: 'BECA SEARS' },
    { clave: 'BSYR', descripcion: 'BECA SALINAS Y ROCHA' }
];

let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const claveInput = document.getElementById('claveMedio');
const descripcionInput = document.getElementById('descripcionMedio');
const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const inputBusqueda = document.getElementById('inputBusqueda');
const bodyResultados = document.getElementById('bodyResultados');

// Inicializar
function init() {
    if (medios.length > 0) {
        mostrarRegistro(0);
    }
    actualizarContador();
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < medios.length) {
        registroActual = index;
        claveInput.value = medios[index].clave;
        descripcionInput.value = medios[index].descripcion;
        actualizarContador();
    }
}

// Actualizar contador
function actualizarContador() {
    registroSpan.textContent = medios.length > 0 ? registroActual + 1 : 0;
    totalSpan.textContent = medios.length;
    document.getElementById('inputRegistro').max = medios.length;
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
    
    const resultados = medios.filter(m => 
        m.clave.toLowerCase().includes(termino) || 
        m.descripcion.toLowerCase().includes(termino)
    );
    
    modalBusqueda.style.display = 'none';
    
    if (resultados.length === 0) {
        alert('No se encontraron resultados');
    } else if (resultados.length === 1) {
        const index = medios.findIndex(m => m.clave === resultados[0].clave);
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
    
    resultados.forEach((medio) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medio.clave}</td>
            <td>${medio.descripcion}</td>
        `;
        tr.addEventListener('click', () => {
            if (filaSeleccionada) {
                filaSeleccionada.classList.remove('selected');
            }
            tr.classList.add('selected');
            filaSeleccionada = tr;
        });
        tr.addEventListener('dblclick', () => {
            seleccionarMedio(medio);
        });
        bodyResultados.appendChild(tr);
    });
    
    modalLista.style.display = 'block';
}

// Seleccionar medio
function seleccionarMedio(medio) {
    const index = medios.findIndex(m => m.clave === medio.clave);
    mostrarRegistro(index);
    modalLista.style.display = 'none';
}

// Botón Seleccionar en modal lista
document.getElementById('btnSeleccionar').addEventListener('click', () => {
    if (!filaSeleccionada) {
        alert('Por favor seleccione un medio');
        return;
    }
    
    const clave = filaSeleccionada.cells[0].textContent;
    const medio = medios.find(m => m.clave === clave);
    seleccionarMedio(medio);
});

// Cancelar lista
document.getElementById('btnCancelarLista').addEventListener('click', () => {
    modalLista.style.display = 'none';
});

// Botón Borrar
document.getElementById('btnBorrar').addEventListener('click', () => {
    if (medios.length === 0) return;
    
    if (confirm('¿Está seguro de eliminar este registro?')) {
        medios.splice(registroActual, 1);
        if (registroActual >= medios.length) {
            registroActual = medios.length - 1;
        }
        if (medios.length > 0) {
            mostrarRegistro(registroActual);
        } else {
            claveInput.value = '';
            descripcionInput.value = '';
            actualizarContador();
        }
    }
    // Habilitar inputs después de la acción
    setTimeout(() => {
        if (claveInput) claveInput.disabled = false;
        if (descripcionInput) descripcionInput.disabled = false;
    }, 100);
});

// Botón Guardar
document.getElementById('btnGuardar')?.addEventListener('click', () => {
    const clave = claveInput.value.trim().toUpperCase();
    const descripcion = descripcionInput.value.trim().toUpperCase();
    
    if (clave && descripcion) {
        const existe = medios.find(m => m.clave === clave);
        if (existe) {
            existe.descripcion = descripcion;
            alert('Registro actualizado');
        } else {
            medios.push({ clave, descripcion });
            medios.sort((a, b) => a.clave.localeCompare(b.clave));
            alert('Registro agregado');
        }
        const index = medios.findIndex(m => m.clave === clave);
        mostrarRegistro(index);
    }
});

// Botón Terminar
document.getElementById('btnTerminar').addEventListener('click', () => {
    if (confirm('¿Desea salir del catálogo de Medios?')) {
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
    if (registroActual < medios.length - 1) {
        mostrarRegistro(registroActual + 1);
    }
});

document.getElementById('btnUltimo').addEventListener('click', () => {
    mostrarRegistro(medios.length - 1);
});

document.getElementById('btnBuscarRegistro').addEventListener('click', () => {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= medios.length) {
        mostrarRegistro(num - 1);
    }
});

// Inicializar al cargar
init();
