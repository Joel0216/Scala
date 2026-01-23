import { supabase } from './supabase-config.js';

let maestros = [];
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

// Cargar maestros desde Supabase
async function loadMaestros() {
    try {
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        maestros = data || [];
        document.getElementById('totalRecords').textContent = maestros.length;
        
        if (maestros.length > 0) {
            currentIndex = 0;
            displayMaestro(currentIndex);
        }
    } catch (error) {
        console.error('Error cargando maestros:', error);
        alert('Error al cargar los datos');
    }
}

// Mostrar maestro en el formulario
function displayMaestro(index) {
    if (index < 0 || index >= maestros.length) return;

    const maestro = maestros[index];
    document.getElementById('nombre').value = maestro.nombre || '';
    document.getElementById('direccion1').value = maestro.direccion1 || '';
    document.getElementById('direccion2').value = maestro.direccion2 || '';
    document.getElementById('telefono').value = maestro.telefono || '';
    document.getElementById('clave').value = maestro.clave || '';
    document.getElementById('rfc').value = maestro.rfc || '';
    document.getElementById('grado').value = maestro.grado || '';
    document.getElementById('detallesGrado').value = maestro.detalles_grado || '';
    document.getElementById('fechaIngreso').value = maestro.fecha_ingreso || '';

    document.getElementById('currentRecord').textContent = index + 1;
}

// Limpiar formulario
function clearForm() {
    document.getElementById('maestrosForm').reset();
    currentIndex = -1;
}

// Guardar maestro
async function saveMaestro() {
    const maestroData = {
        nombre: document.getElementById('nombre').value,
        direccion1: document.getElementById('direccion1').value,
        direccion2: document.getElementById('direccion2').value,
        telefono: document.getElementById('telefono').value,
        clave: document.getElementById('clave').value,
        rfc: document.getElementById('rfc').value,
        grado: document.getElementById('grado').value,
        detalles_grado: document.getElementById('detallesGrado').value,
        fecha_ingreso: document.getElementById('fechaIngreso').value
    };

    try {
        if (currentIndex >= 0 && maestros[currentIndex]) {
            // Actualizar
            const { error } = await supabase
                .from('maestros')
                .update(maestroData)
                .eq('id', maestros[currentIndex].id);

            if (error) throw error;
            alert('Maestro actualizado correctamente');
        } else {
            // Insertar nuevo
            const { error } = await supabase
                .from('maestros')
                .insert([maestroData]);

            if (error) throw error;
            alert('Maestro guardado correctamente');
        }

        await loadMaestros();
    } catch (error) {
        console.error('Error guardando maestro:', error);
        alert('Error al guardar el maestro');
    }
}

// Eliminar maestro
async function deleteMaestro() {
    if (currentIndex < 0 || !maestros[currentIndex]) {
        alert('Seleccione un maestro para eliminar');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este maestro?')) return;

    try {
        const { error } = await supabase
            .from('maestros')
            .delete()
            .eq('id', maestros[currentIndex].id);

        if (error) throw error;

        alert('Maestro eliminado correctamente');
        await loadMaestros();
    } catch (error) {
        console.error('Error eliminando maestro:', error);
        alert('Error al eliminar el maestro');
    }
}

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', () => {
    clearForm();
    saveMaestro();
});

document.getElementById('buscarBtn').addEventListener('click', () => {
    const nombre = prompt('Ingrese el nombre a buscar:');
    if (nombre) {
        const index = maestros.findIndex(m => 
            m.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        if (index >= 0) {
            currentIndex = index;
            displayMaestro(currentIndex);
        } else {
            alert('Maestro no encontrado');
        }
    }
});

document.getElementById('borrarBtn').addEventListener('click', deleteMaestro);

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('firstBtn').addEventListener('click', () => {
    currentIndex = 0;
    displayMaestro(currentIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayMaestro(currentIndex);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < maestros.length - 1) {
        currentIndex++;
        displayMaestro(currentIndex);
    }
});

document.getElementById('lastBtn').addEventListener('click', () => {
    currentIndex = maestros.length - 1;
    displayMaestro(currentIndex);
});

// Cargar datos al iniciar
loadMaestros();
