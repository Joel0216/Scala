import { supabase } from './supabase-config.js';

let prospectos = [];
let currentIndex = 0;

// Generar ID de prospecto
async function generateProspectoId() {
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
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('curso');
        select.innerHTML = '<option value=""></option>';
        
        data.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.curso;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando cursos:', error);
    }
}

// Guardar prospecto
document.getElementById('nuevoBtn').addEventListener('click', async () => {
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
        document.getElementById('prospectosForm').reset();
        document.getElementById('idProspecto').value = await generateProspectoId();
    } catch (error) {
        console.error('Error guardando prospecto:', error);
        alert('Error al guardar el prospecto');
    }
});

// Buscar prospecto
document.getElementById('buscarBtn').addEventListener('click', async () => {
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
});

// Borrar prospecto
document.getElementById('borrarBtn').addEventListener('click', async () => {
    const id = document.getElementById('idProspecto').value;
    
    if (!id) {
        alert('Seleccione un prospecto primero');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este prospecto?')) return;

    try {
        const { error } = await supabase
            .from('prospectos')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Prospecto eliminado correctamente');
        document.getElementById('prospectosForm').reset();
    } catch (error) {
        console.error('Error eliminando prospecto:', error);
        alert('Error al eliminar el prospecto');
    }
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Inicializar
(async () => {
    await loadCursos();
    document.getElementById('idProspecto').value = await generateProspectoId();
    document.getElementById('fechaAtencion').value = new Date().toISOString().split('T')[0];
})();
