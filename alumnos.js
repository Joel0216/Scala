// Datos de ejemplo de alumnos
let alumnos = [
    {
        credencial: '5086',
        digito: '2',
        nombre: 'RODRIGUEZ MURGUIA MARIA CAMILA',
        direccion: 'Calle 10 #123, Col. Centro',
        email: 'maria@email.com',
        celular: '9991234567',
        telefono: '9999876543',
        fechaNacimiento: '15/03/2010',
        fechaIngreso: '27-sep-2019',
        nombrePadre: 'JUAN RODRIGUEZ',
        celularPadre: '9991111111',
        nombreMadre: 'MARIA MURGUIA',
        celularMadre: '9992222222',
        grupo: 'CAASLU18',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        comentario: '',
        instrumento: 'NOTI',
        medio: 'ANUN',
        reingreso: false
    },
    {
        credencial: '3511',
        digito: '2',
        nombre: 'DEY JUAREZ ALAN OLAF',
        direccion: 'Calle 20 #456, Col. Norte',
        email: 'alan@email.com',
        celular: '9993334444',
        telefono: '9995556666',
        fechaNacimiento: '20/05/2008',
        fechaIngreso: '03-sep-2011',
        nombrePadre: 'PEDRO DEY',
        celularPadre: '9993333333',
        nombreMadre: 'ANA JUAREZ',
        celularMadre: '9994444444',
        grupo: 'GAIAJU17',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        comentario: '',
        instrumento: 'GUIT',
        medio: 'FACE',
        reingreso: false
    },
    {
        credencial: '5191',
        digito: '5',
        nombre: 'CUBRIA MENDEZ ANA LAURA',
        direccion: 'Calle 30 #789, Col. Sur',
        email: 'ana@email.com',
        celular: '9995556666',
        telefono: '9997778888',
        fechaNacimiento: '10/08/2012',
        fechaIngreso: '07-sep-2020',
        nombrePadre: 'CARLOS CUBRIA',
        celularPadre: '9995555555',
        nombreMadre: 'LAURA MENDEZ',
        celularMadre: '9996666666',
        grupo: 'BCASJU12',
        grado: '',
        beca: false,
        porcentaje: '0.00',
        comentario: '',
        instrumento: 'CANT',
        medio: 'RADI',
        reingreso: false
    }
];

let alumnoSeleccionado = null;

// Función para cargar alumno desde ventana de lista
function cargarAlumnoDesdeVentana(alumno) {
    cargarDatosAlumno(alumno);
}

// Función unificada de búsqueda
function buscarAlumno() {
    const modal = crearModalBusqueda();
    document.body.appendChild(modal);
    modal.style.display = 'block';
    modal.querySelector('input').focus();
}

function crearModalBusqueda() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Proporcione el numero de Credencial</h2>
            <input type="text" id="inputBusquedaAlumno" placeholder="Credencial o nombre">
            <div class="modal-buttons">
                <button class="btn" onclick="aceptarBusqueda()">Aceptar</button>
                <button class="btn" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    `;
    return modal;
}

function aceptarBusqueda() {
    const termino = document.getElementById('inputBusquedaAlumno').value.trim().toUpperCase();
    
    if (!termino) {
        alert('Por favor ingrese una credencial o nombre');
        return;
    }
    
    const resultados = alumnos.filter(a => 
        a.credencial.includes(termino) || 
        a.nombre.toUpperCase().includes(termino) ||
        a.nombre.toUpperCase().startsWith(termino)
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        alert('No se encontraron resultados');
    } else if (resultados.length === 1) {
        cargarDatosAlumno(resultados[0]);
    } else {
        mostrarListaAlumnos(resultados);
    }
}

function mostrarListaAlumnos(resultados) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let tablaHTML = `
        <div class="modal-content modal-lista">
            <h2>Seleccione un alumno</h2>
            <div class="lista-container">
                <table>
                    <thead>
                        <tr>
                            <th>Credencial</th>
                            <th>Nombre</th>
                            <th>Grupo</th>
                            <th>Grado</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    resultados.forEach((alumno, index) => {
        tablaHTML += `
            <tr onclick="seleccionarAlumno(${index})" style="cursor: pointer;">
                <td>${alumno.credencial}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.grupo}</td>
                <td>${alumno.grado}</td>
            </tr>
        `;
    });
    
    tablaHTML += `
                    </tbody>
                </table>
            </div>
            <div class="modal-buttons">
                <button class="btn" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = tablaHTML;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Guardar resultados temporalmente
    window.resultadosBusqueda = resultados;
}

function seleccionarAlumno(index) {
    const alumno = window.resultadosBusqueda[index];
    cargarDatosAlumno(alumno);
    cerrarModal();
}

function cargarDatosAlumno(alumno) {
    alumnoSeleccionado = alumno;
    
    // Cargar datos en los campos del formulario
    const campos = {
        'credencial': alumno.credencial,
        'digito': alumno.digito,
        'nombre': alumno.nombre,
        'direccion': alumno.direccion,
        'direccion1': alumno.direccion,
        'direccion2': '',
        'email': alumno.email,
        'celular': alumno.celular,
        'telefono': alumno.telefono,
        'fechaNacimiento': alumno.fechaNacimiento,
        'fechaIngreso': alumno.fechaIngreso,
        'nombrePadre': alumno.nombrePadre,
        'celularPadre': alumno.celularPadre,
        'nombreMadre': alumno.nombreMadre,
        'celularMadre': alumno.celularMadre,
        'grupo': alumno.grupo,
        'grado': alumno.grado,
        'porcentaje': alumno.porcentaje,
        'comentario': alumno.comentario
    };
    
    for (let campo in campos) {
        const elemento = document.getElementById(campo);
        if (elemento) {
            if (elemento.tagName === 'TEXTAREA') {
                elemento.value = campos[campo];
            } else {
                elemento.value = campos[campo];
            }
        }
    }
    
    // Checkboxes
    const becaCheck = document.getElementById('beca');
    if (becaCheck) becaCheck.checked = alumno.beca;
    
    const reingresoCheck = document.getElementById('reingreso');
    if (reingresoCheck) reingresoCheck.checked = alumno.reingreso;
    
    // Selects
    const instrumentoSelect = document.getElementById('instrumento');
    if (instrumentoSelect) instrumentoSelect.value = alumno.instrumento;
    
    const medioSelect = document.getElementById('medio');
    if (medioSelect) medioSelect.value = alumno.medio;
}

function cerrarModal() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => modal.remove());
}

function darBaja() {
    const confirmacion = confirm('Esta seguro de desear dar de baja a este alumno <S/N> ?');
    if (confirmacion) {
        alert('Alumno dado de baja');
    }
}

function cambiarGrupo() {
    const confirmacion = confirm('Esta seguro de desear cambiar de grupo a este alumno <S/N> ?');
    if (confirmacion) {
        alert('Grupo cambiado');
    }
}

function listaAlumnos() {
    window.open('alumnos-lista.html', 'Lista Alumnos', 'width=1000,height=600');
}

function guardar() {
    alert('Datos guardados');
    window.location.href = 'alumnos.html';
}

function noGuardarSalir() {
    if (confirm('¿Está seguro de salir sin guardar los cambios?')) {
        window.location.href = 'alumnos.html';
    }
}

function guardarAlta() {
    alert('Alumno dado de alta');
    window.location.href = 'alumnos.html';
}

function cancelarAlta() {
    if (confirm('¿Está seguro de cancelar el alta del alumno?')) {
        window.location.href = 'alumnos.html';
    }
}

function nuevoAlumno() {
    // Limpiar formulario
    const campos = ['nombre', 'direccion', 'email', 'celular', 'telefono', 
                    'nombrePadre', 'celularPadre', 'nombreMadre', 'celularMadre',
                    'grado', 'comentario'];
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = '';
    });
    
    const becaCheck = document.getElementById('beca');
    if (becaCheck) becaCheck.checked = false;
    
    const reingresoCheck = document.getElementById('reingreso');
    if (reingresoCheck) reingresoCheck.checked = false;
}
