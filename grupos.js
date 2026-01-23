import { supabase } from './supabase-config.js';

let grupos = [];
let currentIndex = 0;

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

// Generar clave del grupo
function generateClave() {
    const cursoSelect = document.getElementById('curso');
    const maestroSelect = document.getElementById('maestro');
    const dia = document.getElementById('dia').value;
    const horaEntrada = document.getElementById('horaEntrada').value;

    if (!cursoSelect.value || !maestroSelect.value || !dia || !horaEntrada) {
        return '';
    }

    // Obtener código del curso (primeras 2 letras)
    const cursoText = cursoSelect.options[cursoSelect.selectedIndex].textContent;
    const cursoCodigo = cursoText.substring(0, 2).toUpperCase();

    // Obtener iniciales del maestro
    const maestroText = maestroSelect.options[maestroSelect.selectedIndex].textContent;
    const nombres = maestroText.split(' ');
    let iniciales = '';
    nombres.forEach(nombre => {
        if (nombre.length > 0) {
            iniciales += nombre[0].toUpperCase();
        }
    });
    iniciales = iniciales.substring(0, 4); // Máximo 4 letras

    // Obtener hora (solo la hora sin minutos)
    const hora = horaEntrada.split(':')[0];

    return `${cursoCodigo}${iniciales}${dia}${hora}`;
}

// Actualizar clave automáticamente
function updateClave() {
    const clave = generateClave();
    document.getElementById('clave').value = clave;
}

document.getElementById('curso').addEventListener('change', updateClave);
document.getElementById('maestro').addEventListener('change', updateClave);
document.getElementById('dia').addEventListener('change', updateClave);
document.getElementById('horaEntrada').addEventListener('change', updateClave);

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

// Cargar maestros
async function loadMaestros() {
    try {
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('maestro');
        select.innerHTML = '<option value=""></option>';
        
        data.forEach(maestro => {
            const option = document.createElement('option');
            option.value = maestro.id;
            option.textContent = maestro.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando maestros:', error);
    }
}

// Cargar salones
async function loadSalones() {
    try {
        const { data, error } = await supabase
            .from('salones')
            .select('*')
            .order('numero', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('salon');
        select.innerHTML = '<option value=""></option>';
        
        data.forEach(salon => {
            const option = document.createElement('option');
            option.value = salon.id;
            option.textContent = salon.numero;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando salones:', error);
    }
}

// Cargar alumnos del grupo
async function loadAlumnosGrupo(grupoId) {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('nombre', { ascending: true });

        if (error) throw error;

        const tbody = document.getElementById('alumnosTableBody');
        tbody.innerHTML = '';

        data.forEach(alumno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alumno.credencial1 || ''}</td>
                <td>${alumno.credencial2 || ''}</td>
                <td>${alumno.nombre || ''}</td>
                <td>${alumno.telefono || ''}</td>
                <td>${alumno.grupo || ''}</td>
                <td>${alumno.fecha_ingreso || ''}</td>
            `;
            tbody.appendChild(row);
        });

        // Actualizar contador de alumnos
        document.getElementById('alumnos').value = data.length;
    } catch (error) {
        console.error('Error cargando alumnos:', error);
    }
}

// Buscar grupo
document.getElementById('buscarBtn').addEventListener('click', () => {
    const clave = prompt('Proporcione la clave del grupo o inicio de la clave');
    if (clave) {
        const index = grupos.findIndex(g => 
            g.clave.toLowerCase().includes(clave.toLowerCase())
        );
        if (index >= 0) {
            currentIndex = index;
            displayGrupo(currentIndex);
        } else {
            alert('Grupo no encontrado');
        }
    }
});

// Borrar grupo
document.getElementById('borrarBtn').addEventListener('click', async () => {
    if (currentIndex < 0 || !grupos[currentIndex]) {
        alert('Seleccione un grupo para eliminar');
        return;
    }

    const grupo = grupos[currentIndex];
    if (!confirm(`¿Esta seguro de querer borrar el grupo ${grupo.clave}?`)) return;

    try {
        const { error } = await supabase
            .from('grupos')
            .delete()
            .eq('id', grupo.id);

        if (error) throw error;

        alert('Grupo eliminado correctamente');
        await loadGrupos();
    } catch (error) {
        console.error('Error eliminando grupo:', error);
        alert('Error al eliminar el grupo');
    }
});

// Edición
document.getElementById('edicionBtn').addEventListener('click', () => {
    if (currentIndex >= 0 && grupos[currentIndex]) {
        window.location.href = `grupos-edicion.html?id=${grupos[currentIndex].id}`;
    } else {
        alert('Seleccione un grupo primero');
    }
});

// Altas
document.getElementById('altasBtn').addEventListener('click', () => {
    window.location.href = 'grupos-alta.html';
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Cargar grupos
async function loadGrupos() {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .order('clave', { ascending: true });

        if (error) throw error;

        grupos = data || [];
    } catch (error) {
        console.error('Error cargando grupos:', error);
    }
}

// Mostrar grupo
function displayGrupo(index) {
    if (index < 0 || index >= grupos.length) return;

    const grupo = grupos[index];
    document.getElementById('clave').value = grupo.clave || '';
    document.getElementById('curso').value = grupo.curso_id || '';
    document.getElementById('dia').value = grupo.dia || '';
    document.getElementById('maestro').value = grupo.maestro_id || '';
    document.getElementById('horaEntrada').value = grupo.hora_entrada || '';
    document.getElementById('salon').value = grupo.salon_id || '';
    document.getElementById('cupo').value = grupo.cupo || 0;
    document.getElementById('horaSalida').value = grupo.hora_salida || '';
    document.getElementById('inicio').value = grupo.inicio || '';
    document.getElementById('leccion').value = grupo.leccion || 'Null';
    document.getElementById('fechaLeccion').value = grupo.fecha_leccion || '';

    loadAlumnosGrupo(grupo.id);
}

// Inicializar
loadCursos();
loadMaestros();
loadSalones();
loadGrupos();
