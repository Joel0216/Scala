// Datos de ejemplo
let examenes = [
    {
        clave: 'EN1201217',
        fecha: 'oles, 20 de diciembre de 2017',
        hora: '19:00',
        tipo: 'GRADO BASICO',
        salon: '6',
        maestroBase: 'JESUS PEDROZA',
        examinador1: 'ARLETTE MARIA SIERRA ALCOCER',
        examinador2: '',
        alumnos: []
    }
];

let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const claveInput = document.getElementById('claveExamen');
const fechaInput = document.getElementById('fechaExamen');
const horaInput = document.getElementById('horaExamen');
const tipoInput = document.getElementById('tipoExamen');
const salonInput = document.getElementById('salonExamen');
const maestroInput = document.getElementById('maestroBase');
const examinador1Input = document.getElementById('examinador1');
const examinador2Input = document.getElementById('examinador2');
const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const inputBusqueda = document.getElementById('inputBusqueda');
const bodyResultados = document.getElementById('bodyResultados');
const bodyAlumnos = document.getElementById('bodyAlumnos');

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
    document.getElementById('fechaHora').textContent = 
        `${dia}/${mes}/${anio} ${horasStr}:${minutos}:${segundos} ${ampm}`;
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// Inicializar
function init() {
    if (examenes.length > 0) {
        mostrarRegistro(0);
    }
    actualizarContador();
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < examenes.length) {
        registroActual = index;
        const examen = examenes[index];
        claveInput.value = examen.clave;
        fechaInput.value = examen.fecha;
        horaInput.value = examen.hora;
        tipoInput.value = examen.tipo;
        salonInput.value = examen.salon;
        maestroInput.value = examen.maestroBase;
        examinador1Input.value = examen.examinador1;
        examinador2Input.value = examen.examinador2;
        mostrarAlumnos(examen.alumnos);
        actualizarContador();
    }
}

// Mostrar alumnos
function mostrarAlumnos(alumnos) {
    bodyAlumnos.innerHTML = '';
    if (alumnos && alumnos.length > 0) {
        alumnos.forEach(alumno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>►</td>
                <td>${alumno.hora || ''}</td>
                <td>${alumno.credencial || ''}</td>
                <td>${alumno.nombre || ''}</td>
                <td>${alumno.grado || ''}</td>
                <td>${alumno.recibo || ''}</td>
                <td>${alumno.fecha || ''}</td>
                <td>${alumno.cantidad || ''}</td>
                <td>${alumno.neto || ''}</td>
                <td><input type="checkbox" ${alumno.presento ? 'checked' : ''}></td>
                <td><input type="checkbox" ${alumno.aprobo ? 'checked' : ''}></td>
                <td>${alumno.certificado || ''}</td>
            `;
            bodyAlumnos.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>►</td>
            <td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td></td>
        `;
        bodyAlumnos.appendChild(tr);
    }
}

// Actualizar contador
function actualizarContador() {
    registroSpan.textContent = examenes.length > 0 ? registroActual + 1 : 0;
    totalSpan.textContent = examenes.length;
    document.getElementById('inputRegistro').max = examenes.length;
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
        alert('Por favor ingrese una clave de búsqueda');
        return;
    }
    
    const resultados = examenes.filter(e => e.clave.includes(termino));
    
    modalBusqueda.style.display = 'none';
    
    if (resultados.length === 0) {
        alert('No se encontraron resultados');
    } else if (resultados.length === 1) {
        const index = examenes.findIndex(e => e.clave === resultados[0].clave);
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
    
    resultados.forEach((examen) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${examen.clave}</td>
            <td>${examen.fecha}</td>
            <td>${examen.tipo}</td>
        `;
        tr.addEventListener('click', () => {
            if (filaSeleccionada) {
                filaSeleccionada.classList.remove('selected');
            }
            tr.classList.add('selected');
            filaSeleccionada = tr;
        });
        tr.addEventListener('dblclick', () => {
            seleccionarExamen(examen);
        });
        bodyResultados.appendChild(tr);
    });
    
    modalLista.style.display = 'block';
}

// Seleccionar examen
function seleccionarExamen(examen) {
    const index = examenes.findIndex(e => e.clave === examen.clave);
    mostrarRegistro(index);
    modalLista.style.display = 'none';
}

// Botón Seleccionar en modal lista
document.getElementById('btnSeleccionar').addEventListener('click', () => {
    if (!filaSeleccionada) {
        alert('Por favor seleccione un examen');
        return;
    }
    
    const clave = filaSeleccionada.cells[0].textContent;
    const examen = examenes.find(e => e.clave === clave);
    seleccionarExamen(examen);
});

// Cancelar lista
document.getElementById('btnCancelarLista').addEventListener('click', () => {
    modalLista.style.display = 'none';
});

// Botón Terminar
document.getElementById('btnTerminar').addEventListener('click', () => {
    window.close();
});

// Navegación
document.getElementById('btnPrimero').addEventListener('click', () => mostrarRegistro(0));
document.getElementById('btnAnterior').addEventListener('click', () => {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
});
document.getElementById('btnSiguiente').addEventListener('click', () => {
    if (registroActual < examenes.length - 1) mostrarRegistro(registroActual + 1);
});
document.getElementById('btnUltimo').addEventListener('click', () => mostrarRegistro(examenes.length - 1));
document.getElementById('btnBuscarRegistro').addEventListener('click', () => {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= examenes.length) mostrarRegistro(num - 1);
});

init();
