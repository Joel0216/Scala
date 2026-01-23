import { supabase } from './supabase-config.js';

// Guardar grupo de artículos
document.getElementById('nuevoBtn').addEventListener('click', async () => {
    const grupo = document.getElementById('grupo').value.trim();

    if (!grupo) {
        alert('Ingrese el nombre del grupo');
        return;
    }

    try {
        const { error } = await supabase
            .from('grupos_articulos')
            .insert([{ nombre: grupo }]);

        if (error) throw error;

        alert('Grupo guardado correctamente');
        document.getElementById('grupo').value = '';
    } catch (error) {
        console.error('Error guardando grupo:', error);
        alert('Error al guardar el grupo');
    }
});

// Borrar grupo
document.getElementById('borrarBtn').addEventListener('click', async () => {
    const grupo = document.getElementById('grupo').value.trim();

    if (!grupo) {
        alert('Ingrese el nombre del grupo a eliminar');
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el grupo "${grupo}"?`)) return;

    try {
        const { error } = await supabase
            .from('grupos_articulos')
            .delete()
            .eq('nombre', grupo);

        if (error) throw error;

        alert('Grupo eliminado correctamente');
        document.getElementById('grupo').value = '';
    } catch (error) {
        console.error('Error eliminando grupo:', error);
        alert('Error al eliminar el grupo');
    }
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
