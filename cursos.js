// Inicializar Supabase
let supabase = null;
let cursos = [];
let registroActual = 0;
let cursoSeleccionado = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de cursos...');

    // Esperar a que Supabase esté listo
    try {
        await new Promise(r => setTimeout(r, 500)); // Esperar a que cargue el CDN
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
            await cargarCursos();
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Habilitar inputs
    if (typeof habilitarInputs === 'function') {
        habilitarInputs();
    }

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
        } else {
            limpiarFormulario();
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
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
    const campos = ['curso', 'costo', 'clave', 'recargo', 'cursoSiguiente'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const ivaEl = document.getElementById('iva');
    if (ivaEl) ivaEl.value = '0.16';
    cursoSeleccionado = null;
}

// Función para cargar datos del curso
function cargarDatosCurso(curso) {
    cursoSeleccionado = curso;
    
    const cursoInput = document.getElementById('curso');
    const costoInput = document.getElementById('costo');
    const claveInput = document.getElementById('clave');
    const ivaInput = document.getElementById('iva');
    const recargoInput = document.getElementById('recargo');
    const cursoSiguienteSelect = document.getElementById('cursoSiguiente');

    if (cursoInput) cursoInput.value = curso.curso || '';
    if (costoInput) costoInput.value = curso.precio_mensual ? curso.precio_mensual.toFixed(2) : '';
    if (claveInput) claveInput.value = curso.clave || '';
    if (ivaInput) ivaInput.value = '0.16';
    if (recargoInput) recargoInput.value = curso.precio_inscripcion ? curso.precio_inscripcion.toFixed(2) : '';
    if (cursoSiguienteSelect) cursoSiguienteSelect.value = curso.curso_siguiente_id || '';
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < cursos.length) {
        registroActual = index;
        cargarDatosCurso(cursos[index]);

        const registroActualEl = document.getElementById('registroActual');
        const inputRegistroEl = document.getElementById('inputRegistro');
        const totalRegistrosEl = document.getElementById('totalRegistros');

        if (registroActualEl) registroActualEl.textContent = index + 1;
        if (inputRegistroEl) {
            inputRegistroEl.value = index + 1;
            inputRegistroEl.max = cursos.length;
        }
        if (totalRegistrosEl) totalRegistrosEl.textContent = cursos.length;
    }
}

// Botón Nuevo - Redirigir a página de alta
function nuevoCurso() {
    window.location.href = 'cursos-alta.html';
}

// Botón Buscar
function buscarCurso() {
    const modal = document.getElementById('modalBusqueda');
    if (modal) {
        modal.style.display = 'block';
        const inputBusqueda = document.getElementById('inputBusqueda');
        if (inputBusqueda) {
            inputBusqueda.value = '';
            inputBusqueda.focus();
        }
    }
}

// Aceptar búsqueda
async function aceptarBusqueda() {
    const inputBusqueda = document.getElementById('inputBusqueda');
    const termino = inputBusqueda ? inputBusqueda.value.trim().toUpperCase() : '';

    cerrarModal();

    if (!termino) {
        alert('Por favor ingrese un nombre');
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
        return;
    }

    // Buscar en datos locales primero
    const resultados = cursos.filter(c => 
        (c.curso && c.curso.toUpperCase().includes(termino)) ||
        (c.clave && c.clave.toUpperCase().includes(termino))
    );

    if (resultados.length === 0) {
        alert('No se encontraron cursos con ese nombre o clave');
    } else if (resultados.length === 1) {
        const index = cursos.findIndex(c => c.id === resultados[0].id);
        if (index !== -1) {
            mostrarRegistro(index);
        }
    } else {
        mostrarListaCursos(resultados);
    }

    setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
}

// Mostrar lista de cursos
function mostrarListaCursos(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    if (!modal || !tbody) return;

    tbody.innerHTML = '';

    resultados.forEach((curso) => {
        const tr = document.createElement('tr');
        tr.onclick = function () {
            const index = cursos.findIndex(c => c.id === curso.id);
            if (index !== -1) {
                mostrarRegistro(index);
            }
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${curso.curso || ''}</td>
            <td>${curso.clave || 'N/A'}</td>
            <td>${curso.precio_mensual ? curso.precio_mensual.toFixed(2) : '0.00'}</td>
            <td>16%</td>
        `;
        tbody.appendChild(tr);
    });

    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    const modalBusqueda = document.getElementById('modalBusqueda');
    const modalLista = document.getElementById('modalLista');
    if (modalBusqueda) modalBusqueda.style.display = 'none';
    if (modalLista) modalLista.style.display = 'none';
    
    // Habilitar inputs después de cerrar modal
    setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
}

// Botón Borrar
async function borrarCurso() {
    if (!cursoSeleccionado) {
        alert('Primero debe seleccionar un curso');
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
        return;
    }

    if (!supabase) {
        alert('Error: Base de datos no conectada');
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
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
            await cargarCursos();
        } catch (error) {
            console.error('Error eliminando curso:', error);
            alert('Error al eliminar curso: ' + error.message);
        }
    }

    setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
}

// Generar reporte
function generarReporte() {
    window.open('reportes-cursos.html', 'Reporte de Cursos', 'width=900,height=700');
}

// Botón Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de cursos?')) {
        window.location.href = 'archivos.html';
    } else {
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
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
    const input = document.getElementById('inputRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= cursos.length) {
            mostrarRegistro(num - 1);
        }
    }
}
