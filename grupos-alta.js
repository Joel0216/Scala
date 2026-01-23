import { supabase } from './supabase-config.js';

// Generar clave del grupo
function generateClave() {
    const cursoSelect = document.getElementById('curso');
    const nombreSelect = document.getElementById('nombre');
    const dia = document.getElementById('dia').value;
    const horaEntrada = document.getElementById('horaEntrada').value;

    if (!cursoSelect.value || !nombreSelect.value || !dia || !horaEntrada) {
        return '';
    }

    const cursoText = cursoSelect.options[cursoSelect.selectedIndex].textContent;
    const cursoCodigo = cursoText.substring(0, 2).toUpperCase();

    const nombreText = nombreSelect.options[nombreSelect.selectedIndex].textContent;
    const nombres = nombreText.split(' ');
    let iniciales = '';
    nombres.forEach(nombre => {
        if (nombre.length > 0) {
            iniciales += nombre[0].toUpperCase();
        }
    });
    iniciales = iniciales.substring(0, 4);

    const hora = horaEntrada.split(':')[0];

    return `${cursoCodigo}${iniciales}${dia}${hora}`;
}

function updateClave() {
    const clave = generateClave();
    document.getElementById('clave').value = clave;
}

document.getElementById('curso').addEventListener('change', updateClave);
document.getElementById('nombre').addEventListener('change', updateClave);
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
            .order('nombre', { ascending: true});

        if (error) throw error;

        const select = document.getElementById('nombre');
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

// Guardar grupo
document.getElementById('nuevoBtn').addEventListener('click', async () => {
    const grupoData = {
        clave: document.getElementById('clave').value,
        curso_id: document.getElementById('curso').value,
        maestro_id: document.getElementById('nombre').value,
        dia: document.getElementById('dia').value,
        hora_entrada: document.getElementById('horaEntrada').value,
        hora_salida: document.getElementById('horaSalida').value,
        salon_id: document.getElementById('salon').value,
        cupo: parseInt(document.getElementById('cupo').value) || 0,
        inicio: document.getElementById('inicio').value,
        leccion: document.getElementById('leccion').value,
        fecha_leccion: document.getElementById('fechaLeccion').value
    };

    if (!grupoData.clave || !grupoData.curso_id || !grupoData.maestro_id) {
        alert('Complete los campos requeridos');
        return;
    }

    try {
        const { error } = await supabase
            .from('grupos')
            .insert([grupoData]);

        if (error) throw error;

        alert('Grupo guardado correctamente');
        window.location.href = 'grupos.html';
    } catch (error) {
        console.error('Error guardando grupo:', error);
        alert('Error al guardar el grupo');
    }
});

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'grupos.html';
});

// Inicializar
loadCursos();
loadMaestros();
loadSalones();
