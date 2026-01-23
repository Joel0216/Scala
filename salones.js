import { supabase } from './supabase-config.js';

let salones = [];
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

// Cargar salones
async function loadSalones() {
    try {
        const { data, error } = await supabase
            .from('salones')
            .select('*')
            .order('numero', { ascending: true });

        if (error) throw error;

        salones = data || [];
        document.getElementById('totalRecords').textContent = salones.length;
        
        if (salones.length > 0) {
            currentIndex = 0;
            displaySalon(currentIndex);
        }
    } catch (error) {
        console.error('Error cargando salones:', error);
        alert('Error al cargar los datos');
    }
}

// Mostrar salón
function displaySalon(index) {
    if (index < 0 || index >= salones.length) return;

    const salon = salones[index];
    document.getElementById('salon').value = salon.numero || '';
    document.getElementById('ubicacion').value = salon.ubicacion || '';
    document.getElementById('cupo').value = salon.cupo || 10;
    document.getElementById('instrumentos').value = salon.instrumentos || '';

    document.getElementById('currentRecord').textContent = index + 1;
}

// Limpiar formulario
function clearForm() {
    document.getElementById('salonesForm').reset();
    document.getElementById('cupo').value = 10;
    currentIndex = -1;
}

// Guardar salón
async function saveSalon() {
    const salonData = {
        numero: document.getElementById('salon').value,
        ubicacion: document.getElementById('ubicacion').value,
        cupo: parseInt(document.getElementById('cupo').value) || 10,
        instrumentos: document.getElementById('instrumentos').value
    };

    if (!salonData.numero) {
        alert('Ingrese el número del salón');
        return;
    }

    try {
        if (currentIndex >= 0 && salones[currentIndex]) {
            // Actualizar
            const { error } = await supabase
                .from('salones')
                .update(salonData)
                .eq('id', salones[currentIndex].id);

            if (error) throw error;
            alert('Salón actualizado correctamente');
        } else {
            // Insertar nuevo
            const { error } = await supabase
                .from('salones')
                .insert([salonData]);

            if (error) throw error;
            alert('Salón guardado correctamente');
        }

        await loadSalones();
    } catch (error) {
        console.error('Error guardando salón:', error);
        alert('Error al guardar el salón');
    }
}

// Eliminar salón
async function deleteSalon() {
    if (currentIndex < 0 || !salones[currentIndex]) {
        alert('Seleccione un salón para eliminar');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este salón?')) return;

    try {
        const { error } = await supabase
            .from('salones')
            .delete()
            .eq('id', salones[currentIndex].id);

        if (error) throw error;

        alert('Salón eliminado correctamente');
        await loadSalones();
    } catch (error) {
        console.error('Error eliminando salón:', error);
        alert('Error al eliminar el salón');
    }
}

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', () => {
    clearForm();
    saveSalon();
});

document.getElementById('buscarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'block';
});

document.getElementById('aceptarBtn').addEventListener('click', () => {
    const numero = document.getElementById('searchInput').value;
    document.getElementById('searchModal').style.display = 'none';

    if (numero) {
        const index = salones.findIndex(s => s.numero === numero);
        if (index >= 0) {
            currentIndex = index;
            displaySalon(currentIndex);
        } else {
            alert('Salón no encontrado');
        }
    }
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'none';
});

document.getElementById('borrarBtn').addEventListener('click', deleteSalon);

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('firstBtn').addEventListener('click', () => {
    currentIndex = 0;
    displaySalon(currentIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displaySalon(currentIndex);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < salones.length - 1) {
        currentIndex++;
        displaySalon(currentIndex);
    }
});

document.getElementById('lastBtn').addEventListener('click', () => {
    currentIndex = salones.length - 1;
    displaySalon(currentIndex);
});

document.getElementById('newRecordBtn').addEventListener('click', () => {
    clearForm();
});

// Cargar datos al iniciar
loadSalones();
