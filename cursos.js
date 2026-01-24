// Datos de ejemplo de cursos
let cursos = [
    { curso: 'ANUALIDAD', costo: 300.00, clave: 'AN', iva: 0.16, recargo: 0.00, cursoSiguiente: 'INSCRIPCION' },
    { curso: 'ARTES MARCIALES', costo: 400.00, clave: 'AM', iva: 0.16, recargo: 0.00, cursoSiguiente: '' },
    { curso: 'Baby Music', costo: 770.00, clave: 'BM', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bajo Electrico 1', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bajo Electrico 2', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bajo Electrico 3', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bajo Individual 1', costo: 1280.00, clave: 'BI', iva: 0.15, recargo: 850.00, cursoSiguiente: '' },
    { curso: 'Bajo Individual 2', costo: 1280.00, clave: 'BE', iva: 0.15, recargo: 850.00, cursoSiguiente: '' },
    { curso: 'BALLET', costo: 400.00, clave: 'BA', iva: 0.16, recargo: 0.00, cursoSiguiente: '' },
    { curso: 'BALLET SCALA NIÑOS', costo: 400.00, clave: 'BS', iva: 0, recargo: 0.00, cursoSiguiente: '' },
    { curso: 'Bateria 1', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bateria 2', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Bateria 3', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'CANTO', costo: 770.00, clave: 'CA', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Canto Individual', costo: 1280.00, clave: 'CI', iva: 0.15, recargo: 850.00, cursoSiguiente: '' },
    { curso: 'Drum Kids', costo: 770.00, clave: 'DK', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'English Music', costo: 770.00, clave: 'EM', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Guitarra Acústica', costo: 770.00, clave: 'GA', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Piano Infantil 1', costo: 770.00, clave: 'P1', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Piano Infantil 2', costo: 770.00, clave: 'P2', iva: 0.15, recargo: 550.00, cursoSiguiente: '' },
    { curso: 'Piano Preparatorio', costo: 770.00, clave: 'PP', iva: 0.15, recargo: 550.00, cursoSiguiente: '' }
];

let registroActual = 0;
let cursoSeleccionado = null;

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

// Generar clave automáticamente
function generarClave(nombreCurso) {
    if (!nombreCurso) return '';
    
    const nombre = nombreCurso.trim().toUpperCase();
    const palabras = nombre.split(' ');
    
    // Si tiene número al final (ej: "Piano Infantil 1")
    const ultimaPalabra = palabras[palabras.length - 1];
    if (!isNaN(ultimaPalabra)) {
        // Tomar primera letra de la primera palabra + número
        return palabras[0].charAt(0) + ultimaPalabra;
    }
    
    // Si es una sola palabra, tomar las dos primeras letras
    if (palabras.length === 1) {
        return nombre.substring(0, 2);
    }
    
    // Si son dos o más palabras, tomar iniciales
    let clave = '';
    for (let i = 0; i < Math.min(2, palabras.length); i++) {
        clave += palabras[i].charAt(0);
    }
    
    return clave;
}

// Actualizar clave cuando cambia el nombre del curso
document.getElementById('curso').addEventListener('input', function() {
    const clave = generarClave(this.value);
    document.getElementById('clave').value = clave;
});

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('curso').value = '';
    document.getElementById('costo').value = '$300.00';
    document.getElementById('clave').value = '';
    document.getElementById('iva').value = '0.16';
    document.getElementById('recargo').value = '$0.00';
    document.getElementById('cursoSiguiente').value = '';
    cursoSeleccionado = null;
}

// Función para cargar datos del curso
function cargarDatosCurso(curso) {
    cursoSeleccionado = curso;
    document.getElementById('curso').value = curso.curso;
    document.getElementById('costo').value = '$' + curso.costo.toFixed(2);
    document.getElementById('clave').value = curso.clave;
    document.getElementById('iva').value = curso.iva.toFixed(2);
    document.getElementById('recargo').value = '$' + curso.recargo.toFixed(2);
    document.getElementById('cursoSiguiente').value = curso.cursoSiguiente || '';
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < cursos.length) {
        registroActual = index;
        cargarDatosCurso(cursos[index]);
        document.getElementById('registroActual').textContent = index + 1;
        document.getElementById('inputRegistro').value = index + 1;
        document.getElementById('inputRegistro').max = cursos.length;
    }
}

// Botón Nuevo
function nuevoCurso() {
    const nombreCurso = document.getElementById('curso').value.trim();
    
    if (!nombreCurso) {
        alert('Por favor ingrese el nombre del curso');
        return;
    }
    
    const costoStr = document.getElementById('costo').value.replace('$', '').replace(',', '');
    const recargoStr = document.getElementById('recargo').value.replace('$', '').replace(',', '');
    
    const nuevoCurso = {
        curso: nombreCurso.toUpperCase(),
        costo: parseFloat(costoStr) || 0,
        clave: document.getElementById('clave').value.toUpperCase(),
        iva: parseFloat(document.getElementById('iva').value) || 0,
        recargo: parseFloat(recargoStr) || 0,
        cursoSiguiente: document.getElementById('cursoSiguiente').value
    };
    
    if (cursoSeleccionado) {
        // Actualizar curso existente
        const index = cursos.findIndex(c => c.curso === cursoSeleccionado.curso);
        if (index !== -1) {
            cursos[index] = nuevoCurso;
            alert('Curso actualizado correctamente');
            mostrarRegistro(index);
        }
    } else {
        // Agregar nuevo curso
        cursos.push(nuevoCurso);
        alert('Curso agregado correctamente');
        mostrarRegistro(cursos.length - 1);
    }
}

// Botón Buscar
function buscarCurso() {
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
    
    const resultados = cursos.filter(c => 
        c.curso.toUpperCase().includes(termino) ||
        c.curso.toUpperCase().startsWith(termino)
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        alert('No se encontraron cursos con ese nombre');
    } else if (resultados.length === 1) {
        const index = cursos.findIndex(c => c.curso === resultados[0].curso);
        mostrarRegistro(index);
    } else {
        mostrarListaCursos(resultados);
    }
}

// Mostrar lista de cursos
function mostrarListaCursos(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    resultados.forEach((curso) => {
        const tr = document.createElement('tr');
        tr.onclick = function() {
            const index = cursos.findIndex(c => c.curso === curso.curso);
            mostrarRegistro(index);
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${curso.curso}</td>
            <td>${curso.clave}</td>
            <td>$${curso.costo.toFixed(2)}</td>
            <td>${curso.iva.toFixed(2)}</td>
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
function borrarCurso() {
    if (!cursoSeleccionado) {
        alert('Primero debe seleccionar un curso');
        return;
    }
    
    if (confirm('¿Está seguro de eliminar este curso?')) {
        const index = cursos.findIndex(c => c.curso === cursoSeleccionado.curso);
        if (index !== -1) {
            cursos.splice(index, 1);
            alert('Curso eliminado correctamente');
            if (cursos.length > 0) {
                mostrarRegistro(Math.min(index, cursos.length - 1));
            } else {
                limpiarFormulario();
            }
        }
    }
}

// Generar reporte
function generarReporte() {
    window.open('reportes-cursos.html', 'Reporte de Cursos', 'width=900,height=700');
}

// Botón Terminar
function terminar() {
    window.location.href = 'archivos.html';
}

// Navegación
function navegarPrimero() {
    if (cursos.length > 0) mostrarRegistro(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < cursos.length - 1) mostrarRegistro(registroActual + 1);
}

function navegarUltimo() {
    if (cursos.length > 0) mostrarRegistro(cursos.length - 1);
}

function navegarRegistro() {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= cursos.length) {
        mostrarRegistro(num - 1);
    }
}

// Inicializar
if (cursos.length > 0) {
    mostrarRegistro(0);
}
