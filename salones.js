// Inicializar Supabase

let salones = [];
let currentIndex = 0;

// Esperar a que se cargue la libreria de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando salones...');

    // Configurar event listeners PRIMERO para que los botones funcionen
    setupEventListeners();
    console.log('Event listeners configurados');

    // Inicializar Supabase
    let dbConnected = false;
    if (typeof initSupabase === 'function') {
        dbConnected = initSupabase();
        if (dbConnected) {
            supabase = window.supabase;
        } else {
            console.warn('Conexión a base de datos pendiente o fallida - Modo Offline/Limitado');
            // No alertar bloqueante, permitir que la UI cargue
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Cargar datos si hay conexión
    if (dbConnected) {
        await loadSalones();
    } else {
        // Reintentar conexión en 2 segundos por si el CDN se inyectó
        setTimeout(async () => {
            if (window.supabase) {
                supabase = window.supabase; // Update ref
                await loadSalones();
            }
        }, 2000);
    }

    console.log('Inicialización de salones completa');
});

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
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = formatted;
    }
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón Nuevo
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', nuevoSalon);
    }

    // Botón Buscar
    const buscarBtn = document.getElementById('buscarBtn');
    if (buscarBtn) {
        buscarBtn.addEventListener('click', buscarSalon);
    }

    // Botón Aceptar búsqueda
    const aceptarBtn = document.getElementById('aceptarBtn');
    if (aceptarBtn) {
        aceptarBtn.addEventListener('click', aceptarBusquedaSalon);
    }

    // Botón Cancelar búsqueda
    const cancelarBtn = document.getElementById('cancelarBtn');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModalSalon);
    }

    // Botón Borrar
    const borrarBtn = document.getElementById('borrarBtn');
    if (borrarBtn) {
        borrarBtn.addEventListener('click', deleteSalon);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', terminarSalones);
    }
}

// Funciones disponibles globalmente
function buscarSalon() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'block';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
    }
}

function terminarSalones() {
    if (confirm('¿Desea salir del módulo de Salones?')) {
        window.location.href = 'archivos.html';
    }
}

function guardarSalon() {
    saveSalon();
}

// Funciones de navegación (disponibles globalmente)
function navegarSalonPrimero() {
    if (salones.length > 0) {
        currentIndex = 0;
        displaySalon(0);
    }
}

function navegarSalonAnterior() {
    if (currentIndex > 0) {
        currentIndex--;
        displaySalon(currentIndex);
    }
}

function navegarSalonSiguiente() {
    if (currentIndex < salones.length - 1) {
        currentIndex++;
        displaySalon(currentIndex);
    }
}

function navegarSalonUltimo() {
    if (salones.length > 0) {
        currentIndex = salones.length - 1;
        displaySalon(currentIndex);
    }
}

function navegarSalonRegistro() {
    const input = document.getElementById('inputRegistro');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= salones.length) {
            currentIndex = num - 1;
            displaySalon(currentIndex);
        }
    }
}

// Aceptar búsqueda salón
function aceptarBusquedaSalon() {
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('searchModal');

    if (modal) {
        modal.style.display = 'none';
    }

    if (searchInput && searchInput.value) {
        const numero = searchInput.value;
        const index = salones.findIndex(s => s.numero === numero);
        if (index >= 0) {
            currentIndex = index;
            displaySalon(currentIndex);
        } else {
            alert('Salón no encontrado');
        }
    }
}

// Cerrar modal salón
function cerrarModalSalon() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Botones de navegación
const firstBtn = document.getElementById('firstBtn');
if (firstBtn) {
    firstBtn.addEventListener('click', () => {
        currentIndex = 0;
        displaySalon(currentIndex);
    });
}

const prevBtn = document.getElementById('prevBtn');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displaySalon(currentIndex);
        }
    });
}

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < salones.length - 1) {
            currentIndex++;
            displaySalon(currentIndex);
        }
    });
}

const lastBtn = document.getElementById('lastBtn');
if (lastBtn) {
    lastBtn.addEventListener('click', () => {
        currentIndex = salones.length - 1;
        displaySalon(currentIndex);
    });
}

const newRecordBtn = document.getElementById('newRecordBtn');
if (newRecordBtn) {
    newRecordBtn.addEventListener('click', () => {
        const num = parseInt(document.getElementById('inputRegistro')?.value || '1');
        if (num > 0 && num <= salones.length) {
            currentIndex = num - 1;
            displaySalon(currentIndex);
        }
    });
}

// Cargar salones
async function loadSalones() {
    if (!supabase) {
        console.error('Supabase no inicializado');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('salones')
            .select('*')
            .order('numero', { ascending: true });

        if (error) throw error;

        salones = data || [];
        const totalElement = document.getElementById('totalRecords');
        if (totalElement) {
            totalElement.textContent = salones.length;
        }

        // Actualizar máximo del input
        const inputRegistro = document.getElementById('inputRegistro');
        if (inputRegistro) {
            inputRegistro.max = salones.length;
        }

        if (salones.length > 0) {
            currentIndex = 0;
            displaySalon(currentIndex);
        } else {
            clearForm();
        }
    } catch (error) {
        console.error('Error cargando salones:', error);
        alert('Error al cargar los datos: ' + error.message);
    }
}

// Mostrar salón
function displaySalon(index) {
    if (index < 0 || index >= salones.length) return;

    const salon = salones[index];
    const salonInput = document.getElementById('salon');
    const ubicacionInput = document.getElementById('ubicacion');
    const cupoInput = document.getElementById('cupo');
    const instrumentosInput = document.getElementById('instrumentos');
    const currentRecordElement = document.getElementById('currentRecord');

    if (salonInput) salonInput.value = salon.numero || '';
    if (ubicacionInput) ubicacionInput.value = salon.ubicacion || '';
    if (cupoInput) cupoInput.value = salon.cupo || 10;
    if (instrumentosInput) instrumentosInput.value = salon.instrumentos || '';
    if (currentRecordElement) currentRecordElement.textContent = index + 1;

    // Actualizar input de registro
    const inputRegistro = document.getElementById('inputRegistro');
    if (inputRegistro) {
        inputRegistro.value = index + 1;
        inputRegistro.max = salones.length;
    }

    // Actualizar total
    const totalRecords = document.getElementById('totalRecords');
    if (totalRecords) totalRecords.textContent = salones.length;
}

// Limpiar formulario
function clearForm() {
    const form = document.getElementById('salonesForm');
    if (form) form.reset();
    const cupoInput = document.getElementById('cupo');
    if (cupoInput) cupoInput.value = 10;
    currentIndex = -1;
}

// Nuevo salón - Limpiar formulario
function nuevoSalon() {
    clearForm();
    document.getElementById('salon').focus();

    // Asegurar que los inputs estén habilitados
    document.getElementById('salon').disabled = false;
    document.getElementById('ubicacion').disabled = false;
    document.getElementById('cupo').disabled = false;
    document.getElementById('instrumentos').disabled = false;

    // Cambiar texto del botón
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.textContent = 'Guardar';
        nuevoBtn.setAttribute('onclick', 'guardarSalon()');
    }
}

// Guardar salón
async function saveSalon() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
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

        // Restaurar texto del botón
        const nuevoBtn = document.getElementById('nuevoBtn');
        if (nuevoBtn) {
            nuevoBtn.textContent = 'Nuevo';
            nuevoBtn.setAttribute('onclick', 'nuevoSalon()');
        }

        await loadSalones();
    } catch (error) {
        console.error('Error guardando salón:', error);
        alert('Error al guardar el salón: ' + error.message);
    }
}

// Eliminar salón
async function deleteSalon() {
    if (!supabase) return;
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
        alert('Error al eliminar el salón: ' + error.message);
    }
}
