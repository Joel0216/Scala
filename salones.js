// Inicializar Supabase
let supabase = null;
let salones = [];
let currentIndex = 0;

// Esperar a que se cargue la libreria de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando salones...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
        } else {
            alert('Error: No se pudo conectar a la base de datos');
            return;
        }
    } else {
        alert('Error: initSupabase no está disponible');
        return;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Cargar datos
    await loadSalones();
    
    // Configurar event listeners
    setupEventListeners();
    
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
        nuevoBtn.addEventListener('click', () => {
            clearForm();
            saveSalon();
        });
    }

    // Botón Buscar
    const buscarBtn = document.getElementById('buscarBtn');
    if (buscarBtn) {
        buscarBtn.addEventListener('click', () => {
            const modal = document.getElementById('searchModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    // Botón Aceptar búsqueda
    const aceptarBtn = document.getElementById('aceptarBtn');
    if (aceptarBtn) {
        aceptarBtn.addEventListener('click', () => {
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
        });
    }

    // Botón Cancelar búsqueda
    const cancelarBtn = document.getElementById('cancelarBtn');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', () => {
            const modal = document.getElementById('searchModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Botón Borrar
    const borrarBtn = document.getElementById('borrarBtn');
    if (borrarBtn) {
        borrarBtn.addEventListener('click', deleteSalon);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', () => {
            if (confirm('¿Desea salir del módulo de Salones?')) {
                window.location.href = 'archivos.html';
            }
        });
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
            clearForm();
        });
    }
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
        
        if (salones.length > 0) {
            currentIndex = 0;
            displaySalon(currentIndex);
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
}

// Limpiar formulario
function clearForm() {
    const form = document.getElementById('salonesForm');
    if (form) form.reset();
    const cupoInput = document.getElementById('cupo');
    if (cupoInput) cupoInput.value = 10;
    currentIndex = -1;
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
