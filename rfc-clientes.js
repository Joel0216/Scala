import { supabase } from './supabase-config.js';

let clientes = [];
let currentCliente = null;

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

// Actualizar RFC display
document.getElementById('rfc').addEventListener('input', function() {
    document.getElementById('rfcDisplay').value = this.value;
});

// Cargar credenciales asociadas
async function loadCredenciales(rfc) {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('credencial1')
            .eq('rfc_tutor', rfc);

        if (error) throw error;

        const tbody = document.getElementById('credencialesTableBody');
        tbody.innerHTML = '';

        // Agregar credenciales encontradas
        data.forEach((alumno, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index === 0 ? '▶' : ''}</td>
                <td><input type="text" class="credencial-input" value="${alumno.credencial1}" readonly></td>
            `;
            tbody.appendChild(row);
        });

        // Agregar fila de total
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td>*</td>
            <td class="total">${data.length}</td>
        `;
        tbody.appendChild(totalRow);
    } catch (error) {
        console.error('Error cargando credenciales:', error);
    }
}

// Guardar cliente
document.getElementById('nuevoBtn').addEventListener('click', async () => {
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
        document.getElementById('rfcForm').reset();
    } catch (error) {
        console.error('Error guardando cliente:', error);
        alert('Error al guardar el cliente');
    }
});

// Buscar cliente
document.getElementById('buscarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'block';
});

document.getElementById('aceptarBtn').addEventListener('click', async () => {
    const rfc = document.getElementById('searchInput').value.toUpperCase();
    document.getElementById('searchModal').style.display = 'none';

    if (!rfc) return;

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
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'none';
});

// Borrar cliente
document.getElementById('borrarBtn').addEventListener('click', async () => {
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
        document.getElementById('rfcForm').reset();
        currentCliente = null;
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        alert('Error al eliminar el cliente');
    }
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    if (confirm('¿Desea salir del módulo de RFC Clientes?')) {
        window.location.href = 'archivos.html';
    }
});
