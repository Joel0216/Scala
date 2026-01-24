import { supabase } from './supabase-config.js';

let articulos = [];
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

// Cargar artículos desde Supabase
async function loadArticulos() {
    try {
        const { data, error } = await supabase
            .from('articulos')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        articulos = data || [];
        document.getElementById('totalRecords').textContent = articulos.length;
        
        if (articulos.length > 0) {
            currentIndex = 0;
            displayArticulo(currentIndex);
        }
    } catch (error) {
        console.error('Error cargando artículos:', error);
        alert('Error al cargar los datos');
    }
}

// Mostrar artículo en el formulario
function displayArticulo(index) {
    if (index < 0 || index >= articulos.length) return;

    const articulo = articulos[index];
    document.getElementById('clave').value = articulo.clave || '';
    document.getElementById('descripcion').value = articulo.descripcion || '';
    document.getElementById('grupo').value = articulo.grupo || 'Métodos';
    document.getElementById('precio').value = articulo.precio || 0;
    document.getElementById('iva').value = articulo.iva || 0;
    document.getElementById('stock').value = articulo.stock || 0;

    document.getElementById('currentRecord').textContent = index + 1;
}

// Limpiar formulario
function clearForm() {
    document.getElementById('articulosForm').reset();
    currentIndex = -1;
}

// Guardar artículo
async function saveArticulo() {
    const articuloData = {
        clave: document.getElementById('clave').value,
        descripcion: document.getElementById('descripcion').value,
        grupo: document.getElementById('grupo').value,
        precio: parseFloat(document.getElementById('precio').value) || 0,
        iva: parseFloat(document.getElementById('iva').value) || 0,
        stock: parseInt(document.getElementById('stock').value) || 0
    };

    try {
        if (currentIndex >= 0 && articulos[currentIndex]) {
            // Actualizar
            const { error } = await supabase
                .from('articulos')
                .update(articuloData)
                .eq('id', articulos[currentIndex].id);

            if (error) throw error;
            alert('Artículo actualizado correctamente');
        } else {
            // Insertar nuevo
            const { error } = await supabase
                .from('articulos')
                .insert([articuloData]);

            if (error) throw error;
            alert('Artículo guardado correctamente');
        }

        await loadArticulos();
    } catch (error) {
        console.error('Error guardando artículo:', error);
        alert('Error al guardar el artículo');
    }
}

// Eliminar artículo
async function deleteArticulo() {
    if (currentIndex < 0 || !articulos[currentIndex]) {
        alert('Seleccione un artículo para eliminar');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este artículo?')) return;

    try {
        const { error } = await supabase
            .from('articulos')
            .delete()
            .eq('id', articulos[currentIndex].id);

        if (error) throw error;

        alert('Artículo eliminado correctamente');
        await loadArticulos();
    } catch (error) {
        console.error('Error eliminando artículo:', error);
        alert('Error al eliminar el artículo');
    }
}

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', () => {
    clearForm();
    saveArticulo();
});

document.getElementById('buscarBtn').addEventListener('click', () => {
    const clave = prompt('Ingrese la clave del artículo a buscar:');
    if (clave) {
        const index = articulos.findIndex(a => 
            a.clave.toLowerCase().includes(clave.toLowerCase())
        );
        if (index >= 0) {
            currentIndex = index;
            displayArticulo(currentIndex);
        } else {
            alert('Artículo no encontrado');
        }
    }
});

document.getElementById('borrarBtn').addEventListener('click', deleteArticulo);

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'archivos.html';
});

document.getElementById('firstBtn').addEventListener('click', () => {
    currentIndex = 0;
    displayArticulo(currentIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayArticulo(currentIndex);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < articulos.length - 1) {
        currentIndex++;
        displayArticulo(currentIndex);
    }
});

document.getElementById('lastBtn').addEventListener('click', () => {
    currentIndex = articulos.length - 1;
    displayArticulo(currentIndex);
});

document.getElementById('newRecordBtn').addEventListener('click', () => {
    clearForm();
});

// Cargar datos al iniciar
loadArticulos();
