import { supabase } from './supabase-config.js';

let movimientos = [];
let currentIndex = 0;
let articulosMovimiento = [];

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

// Generar número de movimiento
async function generateNumeroMovimiento() {
    try {
        const { data, error } = await supabase
            .from('movimientos_inventario')
            .select('numero_movimiento')
            .order('numero_movimiento', { ascending: false })
            .limit(1);

        if (error) throw error;

        const lastNumber = data && data.length > 0 ? parseInt(data[0].numero_movimiento) : 1000;
        return lastNumber + 1;
    } catch (error) {
        console.error('Error generando número:', error);
        return 1001;
    }
}

// Cargar tipos de movimiento desde Supabase
async function loadTiposMovimiento() {
    try {
        const { data, error } = await supabase
            .from('tipos_movimiento')
            .select('*')
            .order('codigo', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('tipoMovimiento');
        select.innerHTML = '';
        
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.codigo;
            option.textContent = tipo.codigo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando tipos de movimiento:', error);
    }
}

// Buscar artículo por clave
async function buscarArticulo(clave) {
    try {
        const { data, error } = await supabase
            .from('articulos')
            .select('*')
            .eq('clave', clave)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error buscando artículo:', error);
        return null;
    }
}

// Event listeners para inputs de clave
document.querySelectorAll('.clave-input').forEach(input => {
    input.addEventListener('blur', async function() {
        const clave = this.value;
        if (clave) {
            const articulo = await buscarArticulo(clave);
            if (articulo) {
                document.getElementById('descripcion').value = articulo.descripcion;
                document.getElementById('precio').value = articulo.precio;
                document.getElementById('iva').value = articulo.iva;
                document.getElementById('stock').value = articulo.stock;
                document.getElementById('grupo').value = articulo.grupo;
            }
        }
    });
});

// Calcular total
function calcularTotal() {
    let total = 0;
    document.querySelectorAll('.cantidad-input').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    document.querySelector('.total').textContent = total;
}

document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('input', calcularTotal);
});

// Guardar movimiento
async function saveMovimiento() {
    const movimientoData = {
        numero_movimiento: document.getElementById('numeroMovimiento').value,
        fecha_movimiento: document.getElementById('fechaMovimiento').value,
        tipo_movimiento: document.getElementById('tipoMovimiento').value
    };

    try {
        const { data: movimiento, error: movError } = await supabase
            .from('movimientos_inventario')
            .insert([movimientoData])
            .select()
            .single();

        if (movError) throw movError;

        // Guardar detalles
        const detalles = [];
        document.querySelectorAll('.clave-input').forEach((input, index) => {
            const clave = input.value;
            const cantidad = document.querySelectorAll('.cantidad-input')[index].value;
            
            if (clave && cantidad > 0) {
                detalles.push({
                    movimiento_id: movimiento.id,
                    clave_articulo: clave,
                    cantidad: parseInt(cantidad)
                });
            }
        });

        if (detalles.length > 0) {
            const { error: detError } = await supabase
                .from('movimientos_inventario_detalle')
                .insert(detalles);

            if (detError) throw detError;
        }

        alert('Movimiento guardado correctamente');
        await loadMovimientos();
    } catch (error) {
        console.error('Error guardando movimiento:', error);
        alert('Error al guardar el movimiento');
    }
}

// Cargar movimientos
async function loadMovimientos() {
    try {
        const { data, error } = await supabase
            .from('movimientos_inventario')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        movimientos = data || [];
        document.getElementById('totalRecords').textContent = movimientos.length;
    } catch (error) {
        console.error('Error cargando movimientos:', error);
    }
}

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', async () => {
    const numero = await generateNumeroMovimiento();
    document.getElementById('numeroMovimiento').value = numero;
    document.getElementById('fechaMovimiento').value = new Date().toISOString().split('T')[0];
});

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Inicializar
loadTiposMovimiento();
loadMovimientos();
