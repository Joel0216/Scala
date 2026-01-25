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
    if (!alumnoSeleccionado) {
        alert('Primero debe seleccionar un alumno');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalCambioGrupo';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Cambio de Grupo</h2>
            <p><strong>Alumno:</strong> ${alumnoSeleccionado.nombre}</p>
            <p><strong>Grupo Actual:</strong> ${alumnoSeleccionado.grupo}</p>
            <br>
            <label>Nuevo Grupo:</label>
            <select id="nuevoGrupo" class="input-medium" style="width: 300px; padding: 8px; font-size: 14px;">
                <option value="">-- Seleccione un grupo --</option>
            </select>
            <div id="infoGrupo" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 4px; display: none;">
                <p><strong>Curso:</strong> <span id="cursoInfo"></span></p>
                <p><strong>Maestro:</strong> <span id="maestroInfo"></span></p>
                <p><strong>Horario:</strong> <span id="horarioInfo"></span></p>
                <p><strong>Cupo:</strong> <span id="cupoInfo"></span></p>
            </div>
            <div class="modal-buttons" style="margin-top: 20px;">
                <button class="btn" onclick="confirmarCambioGrupo()">Aceptar</button>
                <button class="btn" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Cargar grupos disponibles
    cargarGruposDisponibles();
}

async function cargarGruposDisponibles() {
    // Aquí cargarías los grupos desde Supabase
    // Por ahora usamos datos de ejemplo
    const grupos = [
        { clave: 'CAASLU18', curso: 'Canto Adultos', maestro: 'Luis Pérez', dia: 'LU', hora: '18:00', cupo: 10, inscritos: 5 },
        { clave: 'GAIAJU17', curso: 'Guitarra Infantil', maestro: 'Juan García', dia: 'JU', hora: '17:00', cupo: 8, inscritos: 3 },
        { clave: 'BCASJU12', curso: 'Batería Adultos', maestro: 'Sergio Martínez', dia: 'JU', hora: '12:00', cupo: 6, inscritos: 2 },
        { clave: 'PIASMA16', curso: 'Piano Adultos', maestro: 'María López', dia: 'MA', hora: '16:00', cupo: 10, inscritos: 7 }
    ];
    
    const select = document.getElementById('nuevoGrupo');
    if (!select) return;
    
    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.clave;
        option.textContent = `${grupo.clave} - ${grupo.curso}`;
        option.dataset.curso = grupo.curso;
        option.dataset.maestro = grupo.maestro;
        option.dataset.dia = grupo.dia;
        option.dataset.hora = grupo.hora;
        option.dataset.cupo = grupo.cupo;
        option.dataset.inscritos = grupo.inscritos;
        select.appendChild(option);
    });
    
    // Evento para mostrar información del grupo seleccionado
    select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const infoDiv = document.getElementById('infoGrupo');
        
        if (selectedOption.value) {
            document.getElementById('cursoInfo').textContent = selectedOption.dataset.curso;
            document.getElementById('maestroInfo').textContent = selectedOption.dataset.maestro;
            document.getElementById('horarioInfo').textContent = `${selectedOption.dataset.dia} ${selectedOption.dataset.hora}`;
            document.getElementById('cupoInfo').textContent = `${selectedOption.dataset.inscritos}/${selectedOption.dataset.cupo}`;
            infoDiv.style.display = 'block';
        } else {
            infoDiv.style.display = 'none';
        }
    });
}

function confirmarCambioGrupo() {
    const nuevoGrupo = document.getElementById('nuevoGrupo').value;
    
    if (!nuevoGrupo) {
        alert('Debe seleccionar un grupo');
        return;
    }
    
    if (!confirm(`¿Está seguro de cambiar al alumno ${alumnoSeleccionado.nombre} al grupo ${nuevoGrupo}?`)) {
        return;
    }
    
    // Aquí guardarías el cambio en Supabase
    const grupoAnterior = alumnoSeleccionado.grupo;
    alumnoSeleccionado.grupo = nuevoGrupo;
    
    // Actualizar el campo en la interfaz
    const grupoInput = document.getElementById('grupo');
    if (grupoInput) {
        grupoInput.value = nuevoGrupo;
    }
    
    alert(`Grupo cambiado exitosamente\n\nGrupo anterior: ${grupoAnterior}\nGrupo nuevo: ${nuevoGrupo}`);
    cerrarModal();
    
    // Aquí registrarías el cambio en la tabla cambios_alumnos
    console.log('Cambio registrado:', {
        alumno_id: alumnoSeleccionado.credencial,
        grupo_anterior: grupoAnterior,
        grupo_nuevo: nuevoGrupo,
        fecha: new Date().toISOString()
    });
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
