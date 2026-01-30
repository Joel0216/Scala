// Variables globales
let factores = [];
let maestros = [];
let cursos = [];
let currentIndex = 0;
let modoEdicion = false;
let factorActual = null;

// Variable para evitar inicialización múltiple
let moduloInicializado = false;

// Esperar a que Supabase esté listo
window.addEventListener('supabaseReady', () => {
    if (!moduloInicializado) {
        inicializarModulo();
    }
});

// También intentar inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Esperar un momento para que Supabase se cargue
    setTimeout(async () => {
        if (moduloInicializado) return;
        
        if (typeof isSupabaseConnected === 'function' && isSupabaseConnected()) {
            await inicializarModulo();
        } else if (typeof waitForSupabase === 'function') {
            try {
                await waitForSupabase(8000);
                await inicializarModulo();
            } catch (e) {
                console.error('Error esperando Supabase:', e);
                mostrarErrorConexion();
            }
        } else {
            mostrarErrorConexion();
        }
    }, 1000);
});

// Mostrar error de conexión
function mostrarErrorConexion() {
    const msg = 'No se pudo conectar a la base de datos.\n\n' +
                'Posibles causas:\n' +
                '1. Las tablas no existen en Supabase\n' +
                '2. RLS está habilitado\n' +
                '3. Sin conexión a internet\n\n' +
                'Consulte INSTRUCCIONES-SUPABASE.md para configurar la base de datos.';
    alert(msg);
}

// Función principal de inicialización
async function inicializarModulo() {
    if (moduloInicializado) return;
    
    console.log('Inicializando módulo de Factores...');
    
    // Verificar conexión
    if (typeof isSupabaseConnected !== 'function' || !isSupabaseConnected()) {
        console.error('Supabase no está conectado');
        return;
    }
    
    moduloInicializado = true;

    // Inicializar fecha/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Cargar datos
    await loadMaestros();
    await loadCursos();
    await loadFactores();

    // Configurar event listeners
    setupEventListeners();

    // Deshabilitar campos inicialmente
    desactivarModoEdicion();

    // Mostrar primer factor si existe
    if (factores.length > 0) {
        mostrarFactor(0);
    } else {
        limpiarFormulario();
    }

    // Habilitar inputs
    if (typeof habilitarInputs === 'function') {
        habilitarInputs();
    }

    console.log('✓ Módulo de Factores inicializado');
}

// Actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    const el = document.getElementById('datetime');
    if (el) el.textContent = formatted;
}

// Limpiar formulario
function limpiarFormulario() {
    const campos = ['maestro', 'curso', 'factor', 'porcentaje', 'nombreMaestro', 'grado', 'detallesGrado', 'fechaIngreso'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'SELECT') el.value = '';
            else if (id === 'factor') el.value = '0';
            else if (id === 'porcentaje') el.value = '0.00%';
            else el.value = '';
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Maestro select
    const maestroSelect = document.getElementById('maestro');
    if (maestroSelect) {
        maestroSelect.addEventListener('change', function() {
            actualizarDetallesMaestro(this.value);
        });
    }

    // Factor input - calcular porcentaje
    const factorInput = document.getElementById('factor');
    if (factorInput) {
        factorInput.addEventListener('input', function() {
            const factor = parseFloat(this.value) || 0;
            const porcentaje = (factor / 100).toFixed(2);
            document.getElementById('porcentaje').value = porcentaje + '%';
        });
    }

    // Input de registro para navegación
    const inputRegistro = document.getElementById('inputRegistro');
    if (inputRegistro) {
        inputRegistro.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const num = parseInt(this.value);
                if (num > 0 && num <= factores.length) {
                    mostrarFactor(num - 1);
                }
            }
        });
    }
}


// Cargar maestros
async function loadMaestros() {
    try {
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        maestros = data || [];
        const select = document.getElementById('maestro');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccione un maestro --</option>';
        maestros.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nombre;
            select.appendChild(option);
        });
        
        console.log(`✓ ${maestros.length} maestros cargados`);
    } catch (error) {
        console.error('Error cargando maestros:', error);
    }
}

// Cargar cursos
async function loadCursos() {
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });

        if (error) throw error;

        cursos = data || [];
        const select = document.getElementById('curso');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccione un curso --</option>';
        cursos.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.curso;
            select.appendChild(option);
        });
        
        console.log(`✓ ${cursos.length} cursos cargados`);
    } catch (error) {
        console.error('Error cargando cursos:', error);
    }
}

// Cargar factores
async function loadFactores() {
    try {
        const { data, error } = await supabase
            .from('factores')
            .select(`*, maestros (id, nombre, grado, detalles_grado, fecha_ingreso), cursos (id, curso)`)
            .order('id', { ascending: true });

        if (error) throw error;

        factores = data || [];
        
        const totalEl = document.getElementById('totalRecords');
        if (totalEl) totalEl.textContent = factores.length;
        
        console.log(`✓ ${factores.length} factores cargados`);
    } catch (error) {
        console.error('Error cargando factores:', error);
    }
}

// Actualizar detalles del maestro
function actualizarDetallesMaestro(maestroId) {
    if (!maestroId) {
        document.getElementById('nombreMaestro').value = '';
        document.getElementById('grado').value = '';
        document.getElementById('detallesGrado').value = '';
        document.getElementById('fechaIngreso').value = '';
        return;
    }

    const maestro = maestros.find(m => m.id === maestroId);
    if (maestro) {
        document.getElementById('nombreMaestro').value = maestro.nombre || '';
        document.getElementById('grado').value = maestro.grado || '';
        document.getElementById('detallesGrado').value = maestro.detalles_grado || '';
        document.getElementById('fechaIngreso').value = maestro.fecha_ingreso || '';
    }
}

// Mostrar factor
function mostrarFactor(index) {
    if (index < 0 || index >= factores.length) return;

    currentIndex = index;
    factorActual = factores[index];

    if (modoEdicion) desactivarModoEdicion();

    // Actualizar campos
    document.getElementById('maestro').value = factorActual.maestro_id || '';
    document.getElementById('curso').value = factorActual.curso_id || '';
    document.getElementById('factor').value = factorActual.factor || 0;
    document.getElementById('porcentaje').value = ((factorActual.factor || 0) / 100).toFixed(2) + '%';

    // Detalles del maestro
    if (factorActual.maestros) {
        document.getElementById('nombreMaestro').value = factorActual.maestros.nombre || '';
        document.getElementById('grado').value = factorActual.maestros.grado || '';
        document.getElementById('detallesGrado').value = factorActual.maestros.detalles_grado || '';
        document.getElementById('fechaIngreso').value = factorActual.maestros.fecha_ingreso || '';
    }

    // Navegación
    document.getElementById('currentRecord').textContent = index + 1;
    document.getElementById('totalRecords').textContent = factores.length;
    document.getElementById('inputRegistro').value = index + 1;
}


// Activar modo edición (Nuevo)
function activarModoEdicion() {
    modoEdicion = true;
    factorActual = null;

    // Cambiar estilo
    const form = document.getElementById('factoresForm');
    if (form) {
        form.style.border = '3px solid #4169E1';
        form.style.backgroundColor = '#E6F2FF';
    }

    // Limpiar y habilitar campos
    limpiarFormulario();
    
    document.getElementById('maestro').disabled = false;
    document.getElementById('curso').disabled = false;
    document.getElementById('factor').disabled = false;

    // Cambiar botón
    const btn = document.getElementById('nuevoBtn');
    if (btn) {
        btn.textContent = 'Guardar';
        btn.onclick = guardarFactor;
    }

    document.getElementById('maestro').focus();
}

// Desactivar modo edición
function desactivarModoEdicion() {
    modoEdicion = false;

    const form = document.getElementById('factoresForm');
    if (form) {
        form.style.border = '';
        form.style.backgroundColor = '';
    }

    const btn = document.getElementById('nuevoBtn');
    if (btn) {
        btn.textContent = 'Nuevo';
        btn.onclick = activarModoEdicion;
    }

    // Los campos de selección se mantienen habilitados para navegación
    // pero el factor se deshabilita
    document.getElementById('factor').disabled = true;
}

// Guardar factor
async function guardarFactor() {
    const maestroId = document.getElementById('maestro').value;
    const cursoId = document.getElementById('curso').value;
    const factor = parseInt(document.getElementById('factor').value) || 0;

    if (!maestroId) {
        alert('Debe seleccionar un maestro');
        return;
    }
    if (!cursoId) {
        alert('Debe seleccionar un curso');
        return;
    }
    if (factor <= 0) {
        alert('El factor debe ser mayor a 0');
        return;
    }

    try {
        // Verificar si ya existe
        const { data: existente } = await supabase
            .from('factores')
            .select('id')
            .eq('maestro_id', maestroId)
            .eq('curso_id', cursoId)
            .single();

        if (existente) {
            if (!confirm('Ya existe un factor para este maestro y curso. ¿Desea actualizarlo?')) {
                return;
            }
            await supabase.from('factores').update({ factor }).eq('id', existente.id);
            alert('Factor actualizado correctamente');
        } else {
            await supabase.from('factores').insert([{ maestro_id: maestroId, curso_id: cursoId, factor }]);
            alert('Factor guardado correctamente');
        }

        await loadFactores();
        desactivarModoEdicion();
        
        if (factores.length > 0) {
            mostrarFactor(factores.length - 1);
        }
    } catch (error) {
        console.error('Error guardando factor:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// Borrar factor
async function borrarFactor() {
    if (!factorActual || !factorActual.id) {
        alert('No hay un factor seleccionado para borrar.\nUse "Buscar X Maestro" para cargar un factor existente.');
        return;
    }

    const maestroNombre = document.getElementById('nombreMaestro').value;
    const cursoSelect = document.getElementById('curso');
    const cursoNombre = cursoSelect.options[cursoSelect.selectedIndex]?.text || '';

    if (!confirm(`¿Está seguro de eliminar el factor?\n\nMaestro: ${maestroNombre}\nCurso: ${cursoNombre}`)) {
        return;
    }

    try {
        await supabase.from('factores').delete().eq('id', factorActual.id);
        alert('Factor eliminado correctamente');
        
        await loadFactores();
        limpiarFormulario();
        factorActual = null;
        
        if (factores.length > 0) {
            mostrarFactor(0);
        }
    } catch (error) {
        console.error('Error eliminando factor:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

// Abrir modal de búsqueda
function abrirModalBusqueda() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'block';
        const input = document.getElementById('searchInput');
        if (input) {
            input.value = '';
            input.focus();
        }
    }
}

// Cerrar modal de búsqueda
function cerrarModalBusqueda() {
    const modal = document.getElementById('searchModal');
    if (modal) modal.style.display = 'none';
    if (typeof habilitarInputs === 'function') habilitarInputs();
}

// Buscar por maestro
function buscarPorMaestro() {
    const searchValue = document.getElementById('searchInput').value.trim().toUpperCase();
    cerrarModalBusqueda();

    if (!searchValue) {
        alert('Debe ingresar un nombre o letras iniciales');
        return;
    }

    const resultados = factores.filter(f =>
        f.maestros?.nombre?.toUpperCase().includes(searchValue)
    );

    if (resultados.length === 0) {
        alert('No se encontraron factores para: ' + searchValue);
        return;
    }

    const index = factores.findIndex(f => f.id === resultados[0].id);
    if (index !== -1) {
        mostrarFactor(index);
    }
}

// Terminar
function terminarFactores() {
    if (confirm('¿Desea salir del módulo de Factores?')) {
        window.location.href = 'archivos.html';
    }
}

// Navegación de maestros
let registroActualMaestro = 0;

function navegarMaestroPrimero() { if (maestros.length > 0) { registroActualMaestro = 0; mostrarMaestroEnPanel(0); } }
function navegarMaestroAnterior() { if (registroActualMaestro > 0) { registroActualMaestro--; mostrarMaestroEnPanel(registroActualMaestro); } }
function navegarMaestroSiguiente() { if (registroActualMaestro < maestros.length - 1) { registroActualMaestro++; mostrarMaestroEnPanel(registroActualMaestro); } }
function navegarMaestroUltimo() { if (maestros.length > 0) { registroActualMaestro = maestros.length - 1; mostrarMaestroEnPanel(registroActualMaestro); } }
function navegarMaestroRegistro() {
    const input = document.getElementById('inputRegistroMaestro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= maestros.length) {
            registroActualMaestro = num - 1;
            mostrarMaestroEnPanel(registroActualMaestro);
        }
    }
}

function mostrarMaestroEnPanel(index) {
    if (index < 0 || index >= maestros.length) return;
    const m = maestros[index];
    document.getElementById('nombreMaestro').value = m.nombre || '';
    document.getElementById('grado').value = m.grado || '';
    document.getElementById('detallesGrado').value = m.detalles_grado || '';
    document.getElementById('fechaIngreso').value = m.fecha_ingreso || '';
    document.getElementById('inputRegistroMaestro').value = index + 1;
    document.getElementById('totalMaestros').textContent = maestros.length;
    document.getElementById('maestro').value = m.id;
}

function navegarFactorRegistro() {
    const input = document.getElementById('inputRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= factores.length) {
            mostrarFactor(num - 1);
        }
    }
}
