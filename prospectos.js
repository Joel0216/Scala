// Inicializar Supabase
let supabase = null;
let prospectos = [];
let currentIndex = 0;

// Esperar a que se cargue la libreria de Supabase
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando prospectos...');

    // Esperar a que Supabase esté listo
    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Inicializar datos
    if (supabase) await loadCursos();
    const idProspectoInput = document.getElementById('idProspecto');
    if (idProspectoInput && supabase) {
        idProspectoInput.value = await generateProspectoId();
    }
    const fechaAtencionInput = document.getElementById('fechaAtencion');
    if (fechaAtencionInput) {
        fechaAtencionInput.value = new Date().toISOString().split('T')[0];
    }

    // Configurar event listeners
    setupEventListeners();

    console.log('Inicialización de prospectos completa');
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón Nuevo - Limpiar formulario
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', nuevoProspecto);
    }

    // Botón Buscar
    const buscarBtn = document.getElementById('buscarBtn');
    if (buscarBtn) {
        buscarBtn.addEventListener('click', buscarProspecto);
    }

    // Botón Borrar
    const borrarBtn = document.getElementById('borrarBtn');
    if (borrarBtn) {
        borrarBtn.addEventListener('click', deleteProspecto);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', terminarProspectos);
    }
}

// Función terminar (disponible globalmente)
function terminarProspectos() {
    if (confirm('¿Desea salir del módulo de Prospectos?')) {
        window.location.href = 'archivos.html';
    }
}

// Generar ID de prospecto
async function generateProspectoId() {
    if (!supabase) return 1001;

    try {
        const { data, error } = await supabase
            .from('prospectos')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

        if (error) throw error;

        const lastId = data && data.length > 0 ? parseInt(data[0].id) : 1000;
        return lastId + 1;
    } catch (error) {
        console.error('Error generando ID:', error);
        return 1001;
    }
}

// Cargar cursos
async function loadCursos() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('curso');
        if (!select) return;

        select.innerHTML = '<option value=""></option>';

        if (data && data.length > 0) {
            data.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.curso;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
    }
}

// Nuevo prospecto - Limpiar formulario
async function nuevoProspecto() {
    const form = document.getElementById('prospectosForm');
    if (form) {
        form.reset();
    }

    // Generar nuevo ID
    const idProspectoInput = document.getElementById('idProspecto');
    if (idProspectoInput) {
        idProspectoInput.value = await generateProspectoId();
    }

    // Establecer fecha actual
    const fechaAtencionInput = document.getElementById('fechaAtencion');
    if (fechaAtencionInput) {
        fechaAtencionInput.value = new Date().toISOString().split('T')[0];
    }

    // Cambiar texto del botón a "Guardar"
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.textContent = 'Guardar';
        nuevoBtn.setAttribute('onclick', 'saveProspecto()');
    }

    // Focus en nombre
    const nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.focus();
    }
}

// Guardar prospecto
async function saveProspecto() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    const prospectoData = {
        id: document.getElementById('idProspecto').value || await generateProspectoId(),
        fecha_atencion: document.getElementById('fechaAtencion').value,
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        edad: parseInt(document.getElementById('edad').value) || null,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        codigo_postal: document.getElementById('codigoPostal').value,
        curso_id: document.getElementById('curso').value,
        medio_entero: document.getElementById('medioEntero').value,
        recomienda: document.getElementById('recomienda').value,
        dia_preferente1: document.getElementById('diaPreferente1').value,
        hora_preferente1: document.getElementById('horaPreferente1').value,
        dia_preferente2: document.getElementById('diaPreferente2').value,
        hora_preferente2: document.getElementById('horaPreferente2').value,
        se_inscribio: document.getElementById('seInscribio').value,
        sigue_interesado: document.getElementById('sigueInteresado').value,
        nota: document.getElementById('nota').value,
        atendio: document.getElementById('atendio').value
    };

    if (!prospectoData.nombre) {
        alert('Ingrese el nombre del prospecto');
        return;
    }

    try {
        const { error } = await supabase
            .from('prospectos')
            .insert([prospectoData]);

        if (error) throw error;

        alert('Prospecto guardado correctamente');

        // Limpiar formulario
        const form = document.getElementById('prospectosForm');
        if (form) form.reset();

        // Generar nuevo ID
        const idProspectoInput = document.getElementById('idProspecto');
        if (idProspectoInput) {
            idProspectoInput.value = await generateProspectoId();
        }

        // Establecer fecha actual
        const fechaAtencionInput = document.getElementById('fechaAtencion');
        if (fechaAtencionInput) {
            fechaAtencionInput.value = new Date().toISOString().split('T')[0];
        }

        // Restaurar texto del botón
        const nuevoBtn = document.getElementById('nuevoBtn');
        if (nuevoBtn) {
            nuevoBtn.textContent = 'Nuevo';
            nuevoBtn.setAttribute('onclick', 'nuevoProspecto()');
        }
    } catch (error) {
        console.error('Error guardando prospecto:', error);
        alert('Error al guardar el prospecto: ' + error.message);
    }
}

// Buscar prospecto
async function buscarProspecto() {
    if (!supabase) return;
    const id = prompt('Ingrese el ID del prospecto:');
    if (!id) return;

    try {
        const { data, error } = await supabase
            .from('prospectos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (data) {
            document.getElementById('idProspecto').value = data.id;
            document.getElementById('fechaAtencion').value = data.fecha_atencion || '';
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('apellidos').value = data.apellidos || '';
            document.getElementById('edad').value = data.edad || '';
            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('direccion').value = data.direccion || '';
            document.getElementById('ciudad').value = data.ciudad || '';
            document.getElementById('codigoPostal').value = data.codigo_postal || '';
            document.getElementById('curso').value = data.curso_id || '';
            document.getElementById('medioEntero').value = data.medio_entero || 'REC';
            document.getElementById('recomienda').value = data.recomienda || '';
            document.getElementById('diaPreferente1').value = data.dia_preferente1 || '';
            document.getElementById('horaPreferente1').value = data.hora_preferente1 || '';
            document.getElementById('diaPreferente2').value = data.dia_preferente2 || '';
            document.getElementById('horaPreferente2').value = data.hora_preferente2 || '';
            document.getElementById('seInscribio').value = data.se_inscribio || 'No';
            document.getElementById('sigueInteresado').value = data.sigue_interesado || 'Si';
            document.getElementById('nota').value = data.nota || '';
            document.getElementById('atendio').value = data.atendio || '';
        } else {
            alert('Prospecto no encontrado');
        }
    } catch (error) {
        console.error('Error buscando prospecto:', error);
        alert('Prospecto no encontrado');
    }
}

// Borrar prospecto
async function deleteProspecto() {
    if (!supabase) {
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
        return;
    }
    const id = document.getElementById('idProspecto').value;

    if (!id) {
        alert('Seleccione un prospecto primero');
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
        return;
    }

    if (!confirm('¿Está seguro de eliminar este prospecto?')) {
        setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
        return;
    }

    try {
        const { error } = await supabase
            .from('prospectos')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Prospecto eliminado correctamente');
        const form = document.getElementById('prospectosForm');
        if (form) form.reset();
    } catch (error) {
        console.error('Error eliminando prospecto:', error);
        alert('Error al eliminar el prospecto: ' + error.message);
    }
    
    // Habilitar inputs después de la operación
    setTimeout(() => { if (typeof habilitarInputs === 'function') habilitarInputs(); }, 100);
}
