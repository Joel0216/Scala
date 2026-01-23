import { supabase } from './supabase-config.js';

let cursos = [];
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

// Cargar cursos desde Supabase
async function loadCursos() {
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        cursos = data || [];
        document.getElementById('totalRecords').textContent = cursos.length;
        
        if (cursos.length > 0) {
            currentIndex = 0;
            displayCurso(currentIndex);
        }

        // Actualizar dropdown de curso siguiente
        updateCursoSiguienteDropdown();
    } catch (error) {
        console.error('Error cargando cursos:', error);
        alert('Error al cargar los datos');
    }
}

// Actualizar dropdown de curso siguiente
function updateCursoSiguienteDropdown() {
    const select = document.getElementById('cursoSiguiente');
    select.innerHTML = '<option value="">INSCRIPCION</option>';
    
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.curso;
        select.appendChild(option);
    });
}

// Mostrar curso en el formulario
function displayCurso(index) {
    if (index < 0 || index >= cursos.length) return;

    const curso = cursos[index];
    document.getElementById('curso').value = curso.curso || '';
    document.getElementById('costo').value = curso.costo || 0;
    document.getElementById('clave').value = curso.clave || '';
    document.getElementById('iva').value = curso.iva || 0;
    document.getElementById('recargo').value = curso.recargo || 0;
    document.getElementById('cursoSiguiente').value = curso.curso_siguiente || '';

    document.getElementById('currentRecord').textContent = index + 1;
}

// Limpiar formulario
function clearForm() {
    document.getElementById('cursosForm').reset();
    currentIndex = -1;
}

// Guardar curso
async function saveCurso() {
    const cursoData = {
        curso: document.getElementById('curso').value,
        costo: parseFloat(document.getElementById('costo').value) || 0,
        clave: document.getElementById('clave').value,
        iva: parseFloat(document.getElementById('iva').value) || 0,
        recargo: parseFloat(document.getElementById('recargo').value) || 0,
        curso_siguiente: document.getElementById('cursoSiguiente').value || null
    };

    try {
        if (currentIndex >= 0 && cursos[currentIndex]) {
            // Actualizar
            const { error } = await supabase
                .from('cursos')
                .update(cursoData)
                .eq('id', cursos[currentIndex].id);

            if (error) throw error;
            alert('Curso actualizado correctamente');
        } else {
            // Insertar nuevo
            const { error } = await supabase
                .from('cursos')
                .insert([cursoData]);

            if (error) throw error;
            alert('Curso guardado correctamente');
        }

        await loadCursos();
    } catch (error) {
        console.error('Error guardando curso:', error);
        alert('Error al guardar el curso');
    }
}

// Eliminar curso
async function deleteCurso() {
    if (currentIndex < 0 || !cursos[currentIndex]) {
        alert('Seleccione un curso para eliminar');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este curso?')) return;

    try {
        const { error } = await supabase
            .from('cursos')
            .delete()
            .eq('id', cursos[currentIndex].id);

        if (error) throw error;

        alert('Curso eliminado correctamente');
        await loadCursos();
    } catch (error) {
        console.error('Error eliminando curso:', error);
        alert('Error al eliminar el curso');
    }
}

// Event listeners
document.getElementById('nuevoBtn').addEventListener('click', () => {
    clearForm();
    saveCurso();
});

document.getElementById('buscarBtn').addEventListener('click', () => {
    const nombre = prompt('Ingrese el nombre del curso a buscar:');
    if (nombre) {
        const index = cursos.findIndex(c => 
            c.curso.toLowerCase().includes(nombre.toLowerCase())
        );
        if (index >= 0) {
            currentIndex = index;
            displayCurso(currentIndex);
        } else {
            alert('Curso no encontrado');
        }
    }
});

document.getElementById('borrarBtn').addEventListener('click', deleteCurso);

document.getElementById('reporteBtn').addEventListener('click', () => {
    window.open('reportes-cursos.html', '_blank');
});

document.getElementById('terminarBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('firstBtn').addEventListener('click', () => {
    currentIndex = 0;
    displayCurso(currentIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayCurso(currentIndex);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < cursos.length - 1) {
        currentIndex++;
        displayCurso(currentIndex);
    }
});

document.getElementById('lastBtn').addEventListener('click', () => {
    currentIndex = cursos.length - 1;
    displayCurso(currentIndex);
});

document.getElementById('newRecordBtn').addEventListener('click', () => {
    clearForm();
});

// Cargar datos al iniciar
loadCursos();
