// Listado de Bajas
let supabase = null;
let listadoInicializado = false;

// Esperar a que Supabase esté listo
window.addEventListener('supabaseReady', (e) => {
    if (!listadoInicializado) {
        supabase = e.detail?.supabase || window.supabaseClient;
        inicializarListado();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        if (listadoInicializado) return;
        
        if (typeof isSupabaseConnected === 'function' && isSupabaseConnected()) {
            supabase = window.supabaseClient || getSupabase();
            await inicializarListado();
        } else if (typeof waitForSupabase === 'function') {
            try {
                supabase = await waitForSupabase(8000);
                await inicializarListado();
            } catch (e) {
                console.error('Error esperando Supabase:', e);
                alert('Error: No se pudo conectar a la base de datos');
            }
        }
    }, 500);
});

async function inicializarListado() {
    if (listadoInicializado) return;
    listadoInicializado = true;
    
    updateDate();
    await loadAlumnosBaja();
}

function updateDate() {
    const now = new Date();
    const formatted = now.toLocaleDateString('es-MX', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const el = document.getElementById('date');
    if (el) el.textContent = formatted;
}

async function loadAlumnosBaja() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    try {
        // Primero intentar cargar de la tabla alumnos_bajas
        let { data, error } = await supabase
            .from('alumnos_bajas')
            .select('*')
            .order('nombre', { ascending: true });

        // Si no hay datos o hay error, intentar con alumnos con status='baja'
        if (error || !data || data.length === 0) {
            const result = await supabase
                .from('alumnos')
                .select('*')
                .eq('status', 'baja')
                .order('nombre', { ascending: true });
            
            data = result.data || [];
            error = result.error;
        }

        if (error) throw error;

        const container = document.getElementById('alumnosList');
        if (!container) return;
        
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px;">No hay alumnos dados de baja</p>';
            return;
        }

        data.forEach(alumno => {
            const card = document.createElement('div');
            card.className = 'alumno-card';
            card.innerHTML = `
                <h2>Nombre: ${alumno.nombre || ''}</h2>
                <div class="info-row"><span class="info-label">Direccion1:</span><span class="info-value">${alumno.direccion1 || ''}</span></div>
                <div class="info-row"><span class="info-label">Telefono:</span><span class="info-value">${alumno.telefono || ''}</span></div>
                <div class="info-row"><span class="info-label">Celular:</span><span class="info-value">${alumno.celular || ''}</span></div>
                <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${alumno.email || ''}</span></div>
                <div class="info-row"><span class="info-label">Grupo:</span><span class="info-value">${alumno.grupo || ''}</span></div>
                <div class="info-row"><span class="info-label">Credencial:</span><span class="info-value">${alumno.credencial1 || ''}${alumno.credencial2 || ''}</span></div>
                <div class="info-row"><span class="info-label">Fecha Ingreso:</span><span class="info-value">${alumno.fecha_ingreso || ''}</span></div>
                <div class="info-row"><span class="info-label">Fecha Baja:</span><span class="info-value">${alumno.fecha_baja || ''}</span></div>
                <div class="info-row"><span class="info-label">Motivo:</span><span class="info-value">${alumno.motivo_baja || ''}</span></div>
                <div class="info-row"><span class="info-label">Observaciones:</span><span class="info-value">${alumno.observaciones || ''}</span></div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error cargando listado:', error);
        alert('Error al cargar el listado: ' + error.message);
    }
}
