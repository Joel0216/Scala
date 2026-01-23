import { supabase } from './supabase-config.js';

async function loadCursosReport() {
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });

        if (error) throw error;

        const tbody = document.getElementById('cursosTableBody');
        tbody.innerHTML = '';

        data.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.curso || ''}</td>
                <td>$${parseFloat(curso.costo || 0).toFixed(2)}</td>
                <td>${curso.clave || ''}</td>
                <td>${parseFloat(curso.iva || 0).toFixed(2)}</td>
                <td>$${parseFloat(curso.recargo || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando reporte:', error);
        alert('Error al cargar el reporte');
    }
}

loadCursosReport();
