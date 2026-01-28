// Inicializar Supabase


// Esperar a que se cargue la librería de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        initSupabase();
        supabase = window.supabase;
    }

    updateDate();
    loadAlumnosBaja();
});

// Actualizar fecha
function updateDate() {
    const now = new Date();
    const formatted = now.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('date').textContent = formatted;
}

// Cargar alumnos dados de baja
async function loadAlumnosBaja() {
    if (!supabase) {
        alert('Error: Supabase no está inicializado');
        return;
    }
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*')
            .eq('status', 'baja')
            .order('nombre', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('alumnosList');
        container.innerHTML = '';

        data.forEach(alumno => {
            const card = document.createElement('div');
            card.className = 'alumno-card';
            card.innerHTML = `
                <h2>Nombre: ${alumno.nombre || ''}</h2>
                <div class="info-row">
                    <span class="info-label">Direccion1:</span>
                    <span class="info-value">${alumno.direccion1 || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Direccion2:</span>
                    <span class="info-value">${alumno.direccion2 || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Telefono:</span>
                    <span class="info-value">${alumno.telefono || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Celular:</span>
                    <span class="info-value">${alumno.celular || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${alumno.email || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nombre del padre:</span>
                    <span class="info-value">${alumno.nombre_padre || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Celular del padre:</span>
                    <span class="info-value">${alumno.celular_padre || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nombre de la madre:</span>
                    <span class="info-value">${alumno.nombre_madre || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Celular de la madre:</span>
                    <span class="info-value">${alumno.celular_madre || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Grupo:</span>
                    <span class="info-value">${alumno.grupo || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Credencial:</span>
                    <span class="info-value">${alumno.credencial1 || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Dig_ver:</span>
                    <span class="info-value">${alumno.credencial2 || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fecha Ingreso:</span>
                    <span class="info-value">${alumno.fecha_ingreso || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Grado:</span>
                    <span class="info-value">${alumno.grado || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fecha Baja:</span>
                    <span class="info-value">${alumno.fecha_baja || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Motivo:</span>
                    <span class="info-value">${alumno.motivo_baja || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Maestro:</span>
                    <span class="info-value">${alumno.maestro || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Curso:</span>
                    <span class="info-value">${alumno.curso || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Beca:</span>
                    <span class="info-value">${alumno.beca ? 'Si' : 'No'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Porcentaje:</span>
                    <span class="info-value">${alumno.porcentaje || '0.00'}%</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Comentario:</span>
                    <span class="info-value">${alumno.comentario || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">QueInstrumento:</span>
                    <span class="info-value">${alumno.instrumento || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">QueMedio:</span>
                    <span class="info-value">${alumno.metodo || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Clave Motivo:</span>
                    <span class="info-value">${alumno.clave_motivo || ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Observaciones:</span>
                    <span class="info-value">${alumno.observaciones || ''}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error cargando listado:', error);
        alert('Error al cargar el listado: ' + error.message);
    }
}
