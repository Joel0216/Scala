import { supabase } from './supabase-config.js';

let alumnoId = null;
let alumnoData = null;

// Obtener ID del alumno de la URL
const urlParams = new URLSearchParams(window.location.search);
alumnoId = urlParams.get('id');

// Cargar datos del alumno
async function loadAlumno() {
    if (!alumnoId) {
        alert('No se especificó un alumno');
        window.location.href = 'alumnos-bajas.html';
        return;
    }

    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*')
            .eq('id', alumnoId)
            .single();

        if (error) throw error;

        alumnoData = data;
        displayAlumno(data);
        loadHistorial(alumnoId);
    } catch (error) {
        console.error('Error cargando alumno:', error);
        alert('Error al cargar los datos del alumno');
    }
}

// Mostrar datos del alumno
function displayAlumno(alumno) {
    document.getElementById('credencial').value = alumno.credencial1 || '';
    document.getElementById('nombre').value = alumno.nombre || '';
    document.getElementById('ultimoGrupo').value = alumno.grupo || '';
    document.getElementById('beca').checked = alumno.beca || false;
    document.getElementById('porcentaje').value = alumno.porcentaje || '0.00';
}

// Cargar grupos disponibles
async function loadGrupos() {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('nuevoGrupo');
        select.innerHTML = '<option value=""></option>';
        
        data.forEach(grupo => {
            const option = document.createElement('option');
            option.value = grupo.id;
            option.textContent = grupo.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando grupos:', error);
    }
}

// Cargar historial de bajas/reingresos
async function loadHistorial(alumnoId) {
    try {
        const { data, error } = await supabase
            .from('historial_alumnos')
            .select('*')
            .eq('alumno_id', alumnoId)
            .order('fecha_ingreso', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('historialTableBody');
        tbody.innerHTML = '';

        data.forEach(registro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registro.grupo || ''}</td>
                <td>${registro.fecha_ingreso || ''}</td>
                <td>${registro.fecha_baja || ''}</td>
                <td>${registro.motivo || ''}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando historial:', error);
    }
}

// Guardar reingreso
document.getElementById('guardarBtn').addEventListener('click', async () => {
    const nuevoGrupo = document.getElementById('nuevoGrupo').value;
    
    if (!nuevoGrupo) {
        alert('Debe seleccionar un nuevo grupo');
        return;
    }

    try {
        // Obtener nombre del grupo
        const { data: grupoData, error: grupoError } = await supabase
            .from('grupos')
            .select('nombre')
            .eq('id', nuevoGrupo)
            .single();

        if (grupoError) throw grupoError;

        // Actualizar alumno
        const { error: updateError } = await supabase
            .from('alumnos')
            .update({
                status: 'activo',
                grupo: grupoData.nombre,
                beca: document.getElementById('beca').checked,
                porcentaje: parseFloat(document.getElementById('porcentaje').value) || 0,
                fecha_reingreso: new Date().toISOString().split('T')[0]
            })
            .eq('id', alumnoId);

        if (updateError) throw updateError;

        // Registrar en historial
        const { error: historialError } = await supabase
            .from('historial_alumnos')
            .insert([{
                alumno_id: alumnoId,
                grupo: grupoData.nombre,
                fecha_ingreso: new Date().toISOString().split('T')[0],
                tipo: 'reingreso'
            }]);

        if (historialError) throw historialError;

        alert('Reingreso registrado correctamente');
        window.location.href = 'alumnos-bajas.html';
    } catch (error) {
        console.error('Error guardando reingreso:', error);
        alert('Error al guardar el reingreso');
    }
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'alumnos-bajas.html';
});

// Inicializar
loadAlumno();
loadGrupos();
