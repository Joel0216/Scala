// Datos de ejemplo de alumnos
let alumnos = [
    {
        credencial: '5086',
        nombre: 'RODRIGUEZ MURGUIA MARIA CAMILA',
        grupo: 'CAASLU18',
        fechaIngreso: '27-sep-2019',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        digito: '2',
        direccion: 'Calle 10 #123',
        email: 'maria@email.com',
        celular: '9991234567',
        telefono: '9999876543',
        fechaNacimiento: '15/03/2010',
        nombrePadre: 'JUAN RODRIGUEZ',
        celularPadre: '9991111111',
        nombreMadre: 'MARIA MURGUIA',
        celularMadre: '9992222222',
        comentario: '',
        instrumento: 'NOTI',
        medio: 'ANUN',
        reingreso: false
    },
    {
        credencial: '3511',
        nombre: 'DEY JUAREZ ALAN OLAF',
        grupo: 'GAIAJU17',
        fechaIngreso: '03-sep-2011',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        digito: '2',
        direccion: 'Calle 20 #456',
        email: 'alan@email.com',
        celular: '9993334444',
        telefono: '9995556666',
        fechaNacimiento: '20/05/2008',
        nombrePadre: 'PEDRO DEY',
        celularPadre: '9993333333',
        nombreMadre: 'ANA JUAREZ',
        celularMadre: '9994444444',
        comentario: '',
        instrumento: 'GUIT',
        medio: 'FACE',
        reingreso: false
    },
    {
        credencial: '5191',
        nombre: 'CUBRIA MENDEZ ANA LAURA',
        grupo: 'BCASJU12',
        fechaIngreso: '07-sep-2020',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        digito: '5',
        direccion: 'Calle 30 #789',
        email: 'ana@email.com',
        celular: '9995556666',
        telefono: '9997778888',
        fechaNacimiento: '10/08/2012',
        nombrePadre: 'CARLOS CUBRIA',
        celularPadre: '9995555555',
        nombreMadre: 'LAURA MENDEZ',
        celularMadre: '9996666666',
        comentario: '',
        instrumento: 'CANT',
        medio: 'RADI',
        reingreso: false
    }
];

let alumnosFiltrados = [...alumnos];

// Cargar alumnos al iniciar
function cargarAlumnos(lista = alumnosFiltrados) {
    const tbody = document.getElementById('tablaAlumnos');
    tbody.innerHTML = '';
    
    lista.forEach((alumno, index) => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = function() {
            seleccionarAlumnoLista(index);
        };
        tr.innerHTML = `
            <td>►</td>
            <td>${alumno.credencial}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.grupo}</td>
            <td>${alumno.fechaIngreso}</td>
            <td>${alumno.grado}</td>
            <td>${alumno.beca ? '☑' : '☐'}</td>
            <td>${alumno.porcentaje}%</td>
        `;
        tbody.appendChild(tr);
    });
}

function seleccionarAlumnoLista(index) {
    const alumno = alumnosFiltrados[index];
    // Guardar en localStorage para que la ventana principal lo cargue
    localStorage.setItem('alumnoSeleccionado', JSON.stringify(alumno));
    // Notificar a la ventana principal
    if (window.opener && !window.opener.closed) {
        window.opener.cargarAlumnoDesdeVentana(alumno);
    }
    window.close();
}

function buscarEnLista() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Proporcione el nombre del alumno</h2>
            <input type="text" id="inputBusquedaLista" placeholder="Nombre del alumno">
            <div class="modal-buttons">
                <button class="btn" onclick="aceptarBusquedaLista()">Aceptar</button>
                <button class="btn" onclick="cerrarModalLista()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.getElementById('inputBusquedaLista').focus();
}

function aceptarBusquedaLista() {
    const termino = document.getElementById('inputBusquedaLista').value.trim().toUpperCase();
    
    if (!termino) {
        alumnosFiltrados = [...alumnos];
    } else {
        alumnosFiltrados = alumnos.filter(a => 
            a.nombre.toUpperCase().includes(termino) ||
            a.nombre.toUpperCase().startsWith(termino)
        );
    }
    
    cargarAlumnos(alumnosFiltrados);
    cerrarModalLista();
    
    if (alumnosFiltrados.length === 0) {
        alert('No se encontraron alumnos con ese nombre');
    }
}

function cerrarModalLista() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => modal.remove());
}

// Cargar alumnos al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarAlumnos();
});
