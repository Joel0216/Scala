// Funciones para el módulo de alumnos

function buscarCredencial() {
    alert('Buscar por credencial');
}

function buscarNombre() {
    alert('Buscar por nombre');
}

function darBaja() {
    const confirmacion = confirm('Esta seguro de desear dar de baja a este alumno <S/N> ?');
    if (confirmacion) {
        // Aquí iría la lógica para dar de baja
        alert('Alumno dado de baja');
    }
}

function cambiarGrupo() {
    const confirmacion = confirm('Esta seguro de desear cambiar de grupo a este alumno <S/N> ?');
    if (confirmacion) {
        // Aquí iría la lógica para cambiar de grupo
        alert('Grupo cambiado');
    }
}

function listaCredencial() {
    window.open('alumnos-lista.html', 'Lista Credencial', 'width=1000,height=600');
}

function listaNombre() {
    window.open('alumnos-lista.html', 'Lista Nombre', 'width=1000,height=600');
}

function guardar() {
    alert('Datos guardados');
    window.location.href = 'alumnos.html';
}

function guardarAlta() {
    alert('Alumno dado de alta');
    window.location.href = 'alumnos.html';
}

function nuevoAlumno() {
    // Limpiar formulario
    document.getElementById('nombre').value = '';
    document.getElementById('direccion').value = '';
    // ... limpiar demás campos
}

function buscar() {
    alert('Buscar alumno');
}
