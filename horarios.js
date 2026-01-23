import { supabase } from './supabase-config.js';

let cursoSeleccionado = null;

// Actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    document.getElementById('datetime').textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Cargar horarios de un curso
async function loadHorarios(cursoId) {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select(`
                *,
                maestros(nombre),
                cursos(curso),
                salones(numero)
            `)
            .eq('curso_id', cursoId)
            .order('dia', { ascending: true })
            .order('hora_entrada', { ascending: true });

        if (error) throw error;

        const tbody = document.getElementById('horariosTableBody');
        tbody.innerHTML = '';

        const diasMap = {
            'LU': 'Lunes',
            'MA': 'Martes',
            'MI': 'Miércoles',
            'JU': 'Jueves',
            'VI': 'Viernes',
            'SA': 'Sábado',
            'DO': 'Domingo'
        };

        data.forEach((grupo, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index === 0 ? '▶' : ''}</td>
                <td>${diasMap[grupo.dia] || grupo.dia}</td>
                <td>${grupo.hora_entrada || ''}</td>
                <td>${grupo.clave || ''}</td>
                <td>${grupo.maestros?.nombre || ''}</td>
                <td>${grupo.salones?.numero || ''}</td>
                <td>${grupo.cupo || 0}</td>
                <td>${grupo.alumnos || 0}</td>
                <td>${grupo.inicio || ''}</td>
                <td>${grupo.leccion || ''}</td>
                <td>${grupo.fecha_leccion || ''}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando horarios:', error);
        alert('Error al cargar los horarios');
    }
}

// Buscar curso
document.getElementById('buscarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'block';
});

document.getElementById('aceptarBtn').addEventListener('click', async () => {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    document.getElementById('searchModal').style.display = 'none';

    if (!searchValue) return;

    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .ilike('curso', `%${searchValue}%`)
            .order('curso', { ascending: true });

        if (error) throw error;

        if (data.length === 0) {
            alert('No se encontraron cursos');
        } else if (data.length === 1) {
            cursoSeleccionado = data[0];
            await loadHorarios(data[0].id);
        } else {
            showSelectModal(data);
        }
    } catch (error) {
        console.error('Error buscando cursos:', error);
        alert('Error al buscar cursos');
    }
});

// Mostrar modal de selección
function showSelectModal(cursos) {
    const modal = document.getElementById('selectModal');
    const list = document.getElementById('cursosList');
    list.innerHTML = '';

    cursos.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'curso-item';
        div.textContent = curso.curso;
        div.onclick = async () => {
            cursoSeleccionado = curso;
            await loadHorarios(curso.id);
            modal.style.display = 'none';
        };
        list.appendChild(div);
    });

    modal.style.display = 'block';
}

document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'none';
});

document.getElementById('cerrarSelectBtn').addEventListener('click', () => {
    document.getElementById('selectModal').style.display = 'none';
});

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
