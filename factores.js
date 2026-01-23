import { supabase } from './supabase-config.js';

let factores = [];
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
            option.dataset.grado = maestro.grado || '';
            option.dataset.detallesGrado = maestro.detalles_grado || '';
            option.dataset.fechaIngreso = maestro.fecha_ingreso || '';
            select.appendChild(option);
        });
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

// Actualizar detalles del maestro
document.getElementById('maestro').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    if (selectedOption.value) {
        document.getElementById('nombreMaestro').value = selectedOption.textContent;
        document.getElementById('grado').value = selectedOption.dataset.grado;
        document.getElementById('detallesGrado').value = selectedOption.dataset.detallesGrado;
        document.getElementById('fechaIngreso').value = selectedOption.dataset.fechaIngreso;
    } else {
        document.getElementById('nombreMaestro').value = '';
        document.getElementById('grado').value = '';
        document.getElementById('detallesGrado').value = '';
        document.getElementById('fechaIngreso').value = '';
    }
});

// Calcular porcentaje
document.getElementById('factor').addEventListener('input', function() {
    const factor = parseFloat(this.value) || 0;
    const porcentaje = (factor / 100).toFixed(2);
    document.getElementById('porcentaje').value = porcentaje + '%';
});

// Guardar factor
async function saveFactor() {
    const factorData = {
        maestro_id: document.getElementById('maestro').value,
        curso_id: document.getElementById('curso').value,
        factor: parseInt(document.getElementById('factor').value) || 0
    };

    if (!factorData.maestro_id || !factorData.curso_id) {
        alert('Debe seleccionar un maestro y un curso');
        return;
    }

    try {
        const { error } = await supabase
            .from('factores')
            .insert([factorData]);

        if (error) throw error;

        alert('Factor guardado correctamente');
        await loadFactores();
    } catch (error) {
        console.error('Error guardando factor:', error);
        alert('Error al guardar el factor');
    }
}

// Cargar factores
async function loadFactores() {
    try {
        const { data, error } = await supabase
            .from('factores')
            .select('*, maestros(nombre), cursos(curso)')
            .order('id', { ascending: true });

        if (error) throw error;

        factores = data || [];
        document.getElementById('totalRecords').textContent = factores.length;
    } catch (error) {
        console.error('Error cargando factores:', error);
    }
}

// Buscar maestro
document.getElementById('buscarMaestroBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'block';
});

document.getElementById('aceptarBtn').addEventListener('click', async () => {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    document.getElementById('searchModal').style.display = 'none';

    if (!searchValue) return;

    const maestroSelect = document.getElementById('maestro');
    const options = Array.from(maestroSelect.options);
    
    const matches = options.filter(opt => 
        opt.textContent.toLowerCase().includes(searchValue)
    );

    if (matches.length > 0) {
        maestroSelect.value = matches[0].value;
        maestroSelect.dispatchEvent(new Event('change'));
    } else {
        alert('No se encontró el maestro');
    }
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'none';
});

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', saveFactor);

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Inicializar
loadMaestros();
loadCursos();
loadFactores();
