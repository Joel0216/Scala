// Datos de ejemplo de alumnos con exámenes asignados
let alumnosExamenes = [
    {
        credencial: '598',
        nombre: 'VERA AZUETA GILBERTO AA',
        claveExamen: 'EG1211250',
        horario: '18:00',
        gradoNivel: 'EN12',
        reciboPago: '86:33',
        fechaPago: '25/11/2003',
        cantidad: '1',
        neto: '160'
    }
];

let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const credencialInput = document.getElementById('credencial');
const nombreInput = document.getElementById('nombre');
const claveExamenInput = document.getElementById('claveExamen');
const horarioInput = document.getElementById('horario');
const gradoNivelInput = document.getElementById('gradoNivel');
const reciboPagoInput = document.getElementById('reciboPago');
const fechaPagoInput = document.getElementById('fechaPago');
const cantidadInput = document.getElementById('cantidad');
const netoInput = document.getElementById('neto');
const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const modalReasignar = document.getElementById('modalReasignar');
const inputBusqueda = document.getElementById('inputBusqueda');
const inputNuevaClave = document.getElementById('inputNuevaClave');
const bodyResultados = document.getElementById('bodyResultados');

// Inicializar
function init() {
    if (alumnosExamenes.length > 0) {
        mostrarRegistro(0);
    }
    actualizarContador();
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < alumnosExamenes.length) {
        registroActual = index;
        const alumno = alumnosExamenes[index];
        credencialInput.value = alumno.credencial;
        nombreInput.value = alumno.nombre;
        claveExamenInput.value = alumno.claveExamen;
        horarioInput.value = alumno.horario;
        gradoNivelInput.value = alumno.gradoNivel;
        reciboPagoInput.value = alumno.reciboPago;
        fechaPagoInput.value = alumno.fechaPago;
        cantidadInput.value = alumno.cantidad;
        netoInput.value = alumno.neto;
        actualizarContador();
    }
}

// Actualizar contador
function actualizarContador() {
    registroSpan.textContent = alumnosExamenes.length > 0 ? registroActual + 1 : 0;
    totalSpan.textContent = alumnosExamenes.length;
    document.getElementById('inputRegistro').max = alumnosExamenes.length;
}

// Botón Buscar
document.getElementById('btnBuscar').addEventListener('click', () => {
    inputBusqueda.value = '';
    modalBusqueda.style.display = 'block';
    inputBusqueda.focus();
});

// Aceptar búsqueda
document.getElementById('btnAceptarBusqueda').addEventListener('click', () => {
    const termino = inputBusqueda.value.trim().toUpperCase();
    
    if (!termino) {
        alert('Por favor ingrese una credencial o nombre');
        return;
    }
    
    const resultados = alumnosExamenes.filter(a => 
        a.credencial.includes(termino) || 
        a.nombre.toUpperCase().includes(termino)
    );
    
    modalBusqueda.style.display = 'none';
    
    if (resultados.length === 0) {
        alert('No se encontraron resultados');
    } else if (resultados.length === 1) {
        const index = alumnosExamenes.findIndex(a => a.credencial === resultados[0].credencial);
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
    
    resultados.forEach((alumno) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${alumno.credencial}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.claveExamen}</td>
            <td>${alumno.gradoNivel}</td>
        `;
        tr.addEventListener('click', () => {
            if (filaSeleccionada) {
                filaSeleccionada.classList.remove('selected');
            }
            tr.classList.add('selected');
            filaSeleccionada = tr;
        });
        tr.addEventListener('dblclick', () => {
            seleccionarAlumno(alumno);
        });
        bodyResultados.appendChild(tr);
    });
    
    modalLista.style.display = 'block';
}

// Seleccionar alumno
function seleccionarAlumno(alumno) {
    const index = alumnosExamenes.findIndex(a => a.credencial === alumno.credencial);
    mostrarRegistro(index);
    modalLista.style.display = 'none';
}

// Botón Seleccionar en modal lista
document.getElementById('btnSeleccionar').addEventListener('click', () => {
    if (!filaSeleccionada) {
        alert('Por favor seleccione un alumno');
        return;
    }
    
    const credencial = filaSeleccionada.cells[0].textContent;
    const alumno = alumnosExamenes.find(a => a.credencial === credencial);
    seleccionarAlumno(alumno);
});

// Cancelar lista
document.getElementById('btnCancelarLista').addEventListener('click', () => {
    modalLista.style.display = 'none';
});

// Botón Reasignar
document.getElementById('btnReasignar').addEventListener('click', () => {
    if (!credencialInput.value) {
        alert('Primero debe seleccionar un alumno');
        return;
    }
    inputNuevaClave.value = '';
    modalReasignar.style.display = 'block';
    inputNuevaClave.focus();
});

// Aceptar reasignación
document.getElementById('btnAceptarReasignar').addEventListener('click', () => {
    const nuevaClave = inputNuevaClave.value.trim().toUpperCase();
    
    if (!nuevaClave) {
        alert('Por favor ingrese una nueva clave de examen');
        return;
    }
    
    if (alumnosExamenes.length > 0 && registroActual >= 0) {
        alumnosExamenes[registroActual].claveExamen = nuevaClave;
        mostrarRegistro(registroActual);
        alert('Examen reasignado correctamente');
    }
    
    modalReasignar.style.display = 'none';
});

// Cancelar reasignación
document.getElementById('btnCancelarReasignar').addEventListener('click', () => {
    modalReasignar.style.display = 'none';
});

// Botón Terminar
document.getElementById('btnTerminar').addEventListener('click', () => {
    window.location.href = 'examenes-menu.html';
});

// Navegación
document.getElementById('btnPrimero').addEventListener('click', () => mostrarRegistro(0));
document.getElementById('btnAnterior').addEventListener('click', () => {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
});
document.getElementById('btnSiguiente').addEventListener('click', () => {
    if (registroActual < alumnosExamenes.length - 1) mostrarRegistro(registroActual + 1);
});
document.getElementById('btnUltimo').addEventListener('click', () => mostrarRegistro(alumnosExamenes.length - 1));
document.getElementById('btnBuscarRegistro').addEventListener('click', () => {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= alumnosExamenes.length) mostrarRegistro(num - 1);
});

init();
