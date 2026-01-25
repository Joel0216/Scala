// Inicializar Supabase
let supabase = null;
let clientes = [];
let currentCliente = null;

// Esperar a que se cargue la libreria de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando rfc-clientes...');
    
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
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('Inicialización de rfc-clientes completa');
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
    // Actualizar RFC display
    const rfcInput = document.getElementById('rfc');
    if (rfcInput) {
        rfcInput.addEventListener('input', function() {
            const rfcDisplay = document.getElementById('rfcDisplay');
            if (rfcDisplay) {
                rfcDisplay.value = this.value;
            }
        });
    }

    // Botón Nuevo
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', saveCliente);
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
        aceptarBtn.addEventListener('click', buscarCliente);
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
        borrarBtn.addEventListener('click', deleteCliente);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', () => {
            if (confirm('¿Desea salir del módulo de RFC Clientes?')) {
                window.location.href = 'archivos.html';
            }
        });
    }
}

// Cargar credenciales asociadas
async function loadCredenciales(rfc) {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('credencial1')
            .eq('rfc_tutor', rfc);

        if (error) throw error;

        const tbody = document.getElementById('credencialesTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        // Agregar credenciales encontradas
        if (data && data.length > 0) {
            data.forEach((alumno, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index === 0 ? '▶' : ''}</td>
                    <td><input type="text" class="credencial-input" value="${alumno.credencial1}" readonly></td>
                `;
                tbody.appendChild(row);
            });
        }

        // Agregar fila de total
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td>*</td>
            <td class="total">${data ? data.length : 0}</td>
        `;
        tbody.appendChild(totalRow);
    } catch (error) {
        console.error('Error cargando credenciales:', error);
    }
}

// Guardar cliente
async function saveCliente() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    const clienteData = {
        rfc: document.getElementById('rfc').value.toUpperCase(),
        nombre: document.getElementById('nombre').value,
        direccion1: document.getElementById('direccion1').value,
        direccion2: document.getElementById('direccion2').value
    };

    if (!clienteData.rfc || !clienteData.nombre) {
        alert('Complete los campos requeridos');
        return;
    }

    try {
        // Obtener credenciales ingresadas
        const credenciales = [];
        document.querySelectorAll('.credencial-input').forEach(input => {
            if (input.value && !input.readOnly) {
                credenciales.push(input.value);
            }
        });

        const { error } = await supabase
            .from('rfc_clientes')
            .insert([clienteData]);

        if (error) throw error;

        // Actualizar RFC en alumnos con las credenciales asociadas
        if (credenciales.length > 0) {
            const { error: updateError } = await supabase
                .from('alumnos')
                .update({ rfc_tutor: clienteData.rfc })
                .in('credencial1', credenciales);

            if (updateError) throw updateError;
        }

        alert('Cliente guardado correctamente');
        const form = document.getElementById('rfcForm');
        if (form) form.reset();
    } catch (error) {
        console.error('Error guardando cliente:', error);
        alert('Error al guardar el cliente: ' + error.message);
    }
}

// Buscar cliente
async function buscarCliente() {
    if (!supabase) return;
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('searchModal');
    
    if (modal) {
        modal.style.display = 'none';
    }

    if (!searchInput || !searchInput.value) return;
    
    const rfc = searchInput.value.toUpperCase();

    try {
        const { data, error } = await supabase
            .from('rfc_clientes')
            .select('*')
            .eq('rfc', rfc)
            .single();

        if (error) throw error;

        if (data) {
            document.getElementById('rfc').value = data.rfc;
            document.getElementById('nombre').value = data.nombre;
            document.getElementById('direccion1').value = data.direccion1 || '';
            document.getElementById('direccion2').value = data.direccion2 || '';
            document.getElementById('rfcDisplay').value = data.rfc;
            
            currentCliente = data;
            await loadCredenciales(data.rfc);
        } else {
            alert('Cliente no encontrado');
        }
    } catch (error) {
        console.error('Error buscando cliente:', error);
        alert('Cliente no encontrado');
    }
}

// Borrar cliente
async function deleteCliente() {
    if (!supabase) return;
    if (!currentCliente) {
        alert('Seleccione un cliente primero');
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el cliente con RFC ${currentCliente.rfc}?`)) return;

    try {
        const { error } = await supabase
            .from('rfc_clientes')
            .delete()
            .eq('rfc', currentCliente.rfc);

        if (error) throw error;

        alert('Cliente eliminado correctamente');
        const form = document.getElementById('rfcForm');
        if (form) form.reset();
        currentCliente = null;
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        alert('Error al eliminar el cliente: ' + error.message);
    }
}
