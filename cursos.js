// Inicializar Supabase
let supabase = null;
let cursos = [];
let registroActual = 0;
let cursoSeleccionado = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de cursos...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
            
            // Cargar cursos desde la base de datos
            await cargarCursos();
        } else {
            console.error('✗ Error al conectar con Supabase');
            alert('Error: No se pudo conectar a la base de datos');
        }
    } else {
        console.error('✗ initSupabase no está disponible');
        alert('Error: initSupabase no está disponible');
    }
    
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    console.log('Inicialización completa');
});

// Cargar cursos desde Supabase
async function cargarCursos() {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });
        
        if (error) throw error;
        
        cursos = data || [];
        console.log(`✓ ${cursos.length} cursos cargados`);
        
        // Cargar dropdown de curso siguiente
        await cargarDropdownCursoSiguiente();
        
        // Mostrar primer registro si hay cursos
        if (cursos.length > 0) {
            mostrarRegistro(0);
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
        alert('Error al cargar cursos: ' + error.message);
    }
}

// Cargar dropdown de curso siguiente
async function cargarDropdownCursoSiguiente() {
    const select = document.getElementById('cursoSiguiente');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Ninguno (Fin de cadena) --</option>';
    
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.curso;
        select.appendChild(option);
    });
}

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

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('curso').value = '';
    document.getElementById('costo').value = '';
    document.getElementById('clave').value = '';
    document.getElementById('iva').value = '0.16';
    document.getElementById('recargo').value = '';
    document.getElementById('cursoSiguiente').value = '';
    cursoSeleccionado = null;
}

// Función para cargar datos del curso
function cargarDatosCurso(curso) {
    cursoSeleccionado = curso;
    document.getElementById('curso').value = curso.curso || '';
    document.getElementById('costo').value = curso.precio_mensual ? '$' + curso.precio_mensual.toFixed(2) : '';
    document.getElementById('clave').value = curso.clave || '';
    document.getElementById('iva').value = '0.16'; // IVA fijo
    document.getElementById('recargo').value = curso.precio_inscripcion ? '$' + curso.precio_inscripcion.toFixed(2) : '';
    document.getElementById('cursoSiguiente').value = curso.curso_siguiente_id || '';
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

// Botón Nuevo - Redirigir a página de alta
function nuevoCurso() {
    window.location.href = 'cursos-alta.html';
}

// Botón Buscar
function buscarCurso() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
async function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        alert('Por favor ingrese un nombre');
        return;
    }
    
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .or(`curso.ilike.%${termino}%,clave.ilike.%${termino}%`)
            .order('curso', { ascending: true });
        
        if (error) throw error;
        
        cerrarModal();
        
        if (!data || data.length === 0) {
            alert('No se encontraron cursos con ese nombre o clave');
        } else if (data.length === 1) {
            const index = cursos.findIndex(c => c.id === data[0].id);
            if (index !== -1) {
                mostrarRegistro(index);
            }
        } else {
            mostrarListaCursos(data);
        }
    } catch (error) {
        console.error('Error buscando cursos:', error);
        alert('Error al buscar cursos: ' + error.message);
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
            const index = cursos.findIndex(c => c.id === curso.id);
            if (index !== -1) {
                mostrarRegistro(index);
            }
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${curso.curso}</td>
            <td>${curso.clave || 'N/A'}</td>
            <td>$${curso.precio_mensual ? curso.precio_mensual.toFixed(2) : '0.00'}</td>
            <td>16%</td>
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
async function borrarCurso() {
    if (!cursoSeleccionado) {
        alert('Primero debe seleccionar un curso');
        return;
    }
    
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    if (confirm('¿Está seguro de eliminar este curso?\n\nEsta acción no se puede deshacer.')) {
        try {
            const { error } = await supabase
                .from('cursos')
                .delete()
                .eq('id', cursoSeleccionado.id);
            
            if (error) throw error;
            
            alert('Curso eliminado correctamente');
            
            // Recargar cursos
            await cargarCursos();
        } catch (error) {
            console.error('Error eliminando curso:', error);
            alert('Error al eliminar curso: ' + error.message);
        }
    }
}

// Generar reporte
function generarReporte() {
    window.open('reportes-cursos.html', 'Reporte de Cursos', 'width=900,height=700');
}

// Botón Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de cursos?')) {
        window.location.href = 'archivos.html';
    }
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
