// Inicializar Supabase
let supabase = null;
let todosLosGrupos = [];
let gruposFiltrados = [];
let currentPage = 0;
const ITEMS_PER_PAGE = 20;

// Esperar a que se cargue la libreria de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando horarios...');
    
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
    
    // Cargar todos los grupos al inicio
    await loadAllGrupos();
    
    console.log('Inicialización de horarios completa');
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
    // Buscador híbrido
    const hybridSearch = document.getElementById('hybridSearch');
    if (hybridSearch) {
        hybridSearch.addEventListener('input', handleHybridSearch);
        hybridSearch.addEventListener('focus', handleHybridSearch);
        
        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                const suggestions = document.getElementById('searchSuggestions');
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
            }
        });
    }

    // Botón Buscar (abre el buscador híbrido)
    const buscarBtn = document.getElementById('buscarBtn');
    if (buscarBtn) {
        buscarBtn.addEventListener('click', buscarHorarios);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', terminarHorarios);
    }

    // Navegación de tabla
    document.getElementById('firstBtn')?.addEventListener('click', () => navigateTable('first'));
    document.getElementById('prevBtn')?.addEventListener('click', () => navigateTable('prev'));
    document.getElementById('nextBtn')?.addEventListener('click', () => navigateTable('next'));
    document.getElementById('lastBtn')?.addEventListener('click', () => navigateTable('last'));
    document.getElementById('newBtn')?.addEventListener('click', () => navigateTable('first'));
}

// Funciones disponibles globalmente
function buscarHorarios() {
    const searchInput = document.getElementById('hybridSearch');
    if (searchInput) {
        searchInput.focus();
    }
}

function terminarHorarios() {
    if (confirm('¿Desea salir del módulo de Horarios?')) {
        window.location.href = 'archivos.html';
    }
}

function navegarHorariosPrimero() {
    navigateTable('first');
}

function navegarHorariosAnterior() {
    navigateTable('prev');
}

function navegarHorariosSiguiente() {
    navigateTable('next');
}

function navegarHorariosUltimo() {
    navigateTable('last');
}

function navegarHorariosRegistro() {
    navigateTable('first');
}

// Cargar todos los grupos al inicio
async function loadAllGrupos() {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select(`
                *,
                maestros(nombre),
                cursos(curso),
                salones(numero)
            `)
            .eq('status', 'activo')
            .order('dia', { ascending: true })
            .order('hora_entrada', { ascending: true });

        if (error) throw error;

        todosLosGrupos = data || [];
        console.log(`Cargados ${todosLosGrupos.length} grupos`);
    } catch (error) {
        console.error('Error cargando grupos:', error);
        alert('Error al cargar los grupos: ' + error.message);
    }
}

// Manejar búsqueda híbrida
function handleHybridSearch(e) {
    const searchValue = e.target.value.trim().toLowerCase();
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    if (!suggestionsDiv) return;
    
    // Si está vacío, ocultar sugerencias
    if (searchValue === '') {
        suggestionsDiv.style.display = 'none';
        suggestionsDiv.innerHTML = '';
        return;
    }
    
    // Buscar coincidencias en cursos y maestros
    const matches = new Map(); // Usar Map para evitar duplicados
    
    todosLosGrupos.forEach(grupo => {
        const cursoNombre = grupo.cursos?.curso || '';
        const maestroNombre = grupo.maestros?.nombre || '';
        
        // Buscar en curso
        if (cursoNombre.toLowerCase().includes(searchValue)) {
            const key = `curso_${grupo.curso_id}`;
            if (!matches.has(key)) {
                matches.set(key, {
                    type: 'curso',
                    id: grupo.curso_id,
                    curso: cursoNombre,
                    maestro: maestroNombre,
                    grupo: grupo
                });
            }
        }
        
        // Buscar en maestro
        if (maestroNombre.toLowerCase().includes(searchValue)) {
            const key = `maestro_${grupo.maestro_id}_${grupo.curso_id}`;
            if (!matches.has(key)) {
                matches.set(key, {
                    type: 'maestro',
                    id: grupo.maestro_id,
                    curso: cursoNombre,
                    maestro: maestroNombre,
                    grupo: grupo
                });
            }
        }
    });
    
    // Mostrar sugerencias
    if (matches.size === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion-item no-results">No se encontraron resultados</div>';
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.innerHTML = '';
        
        // Convertir a array y ordenar
        const matchesArray = Array.from(matches.values());
        matchesArray.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'curso' ? -1 : 1; // Cursos primero
            }
            return a.curso.localeCompare(b.curso);
        });
        
        // Limitar a 10 resultados
        matchesArray.slice(0, 10).forEach(match => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            if (match.type === 'curso') {
                div.innerHTML = `
                    <span class="icon">📘</span>
                    <span class="label">CURSO:</span>
                    <span class="value">${match.curso}</span>
                    <span class="separator">|</span>
                    <span class="icon">👤</span>
                    <span class="label">Maestro:</span>
                    <span class="value">${match.maestro}</span>
                `;
                div.onclick = () => filterByCurso(match.id);
            } else {
                div.innerHTML = `
                    <span class="icon">👤</span>
                    <span class="label">MAESTRO:</span>
                    <span class="value">${match.maestro}</span>
                    <span class="separator">|</span>
                    <span class="icon">📘</span>
                    <span class="label">Curso:</span>
                    <span class="value">${match.curso}</span>
                `;
                div.onclick = () => filterByMaestroAndCurso(match.id, match.curso);
            }
            
            suggestionsDiv.appendChild(div);
        });
        
        suggestionsDiv.style.display = 'block';
    }
}

// Filtrar por curso
function filterByCurso(cursoId) {
    gruposFiltrados = todosLosGrupos.filter(g => g.curso_id === cursoId);
    currentPage = 0;
    displayGrupos();
    
    // Ocultar sugerencias
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
    }
}

// Filtrar por maestro y curso
function filterByMaestroAndCurso(maestroId, cursoNombre) {
    gruposFiltrados = todosLosGrupos.filter(g => 
        g.maestro_id === maestroId && 
        g.cursos?.curso === cursoNombre
    );
    currentPage = 0;
    displayGrupos();
    
    // Ocultar sugerencias
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
    }
}

// Mostrar grupos en la tabla
function displayGrupos() {
    const tbody = document.getElementById('horariosTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (gruposFiltrados.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="12" class="no-data">No se encontraron horarios</td>';
        tbody.appendChild(row);
        updateRecordCount(0, 0);
        return;
    }
    
    const diasMap = {
        'LU': 'Lunes',
        'MA': 'Martes',
        'MI': 'Miércoles',
        'JU': 'Jueves',
        'VI': 'Viernes',
        'SA': 'Sábado',
        'DO': 'Domingo'
    };
    
    // Calcular paginación
    const start = currentPage * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, gruposFiltrados.length);
    const pageData = gruposFiltrados.slice(start, end);
    
    pageData.forEach((grupo, index) => {
        const row = document.createElement('tr');
        
        // Formatear hora
        const horaEntrada = grupo.hora_entrada ? grupo.hora_entrada.substring(0, 5) : '';
        const horaSalida = grupo.hora_salida ? grupo.hora_salida.substring(0, 5) : '';
        const horaCompleta = horaEntrada && horaSalida ? `${horaEntrada} - ${horaSalida}` : horaEntrada;
        
        // Formatear fecha de inicio
        const fechaInicio = grupo.inicio ? formatDate(grupo.inicio) : '';
        const fechaLeccion = grupo.fecha_leccion ? formatDate(grupo.fecha_leccion) : '';
        
        row.innerHTML = `
            <td>${index === 0 ? '▶' : ''}</td>
            <td>${diasMap[grupo.dia] || grupo.dia || ''}</td>
            <td>${horaCompleta}</td>
            <td>${grupo.clave || ''}</td>
            <td>${grupo.cursos?.curso || ''}</td>
            <td>${grupo.maestros?.nombre || ''}</td>
            <td>${grupo.salones?.numero || ''}</td>
            <td>${grupo.cupo || 0}</td>
            <td>${grupo.alumnos_inscritos || 0}</td>
            <td>${fechaInicio}</td>
            <td>${grupo.leccion || ''}</td>
            <td>${fechaLeccion}</td>
        `;
        tbody.appendChild(row);
    });
    
    updateRecordCount(start + 1, end);
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Actualizar contador de registros
function updateRecordCount(start, end) {
    const recordCount = document.getElementById('recordCount');
    if (recordCount) {
        recordCount.value = gruposFiltrados.length > 0 ? `${start}-${end} de ${gruposFiltrados.length}` : '0';
    }
}

// Navegar en la tabla
function navigateTable(direction) {
    const totalPages = Math.ceil(gruposFiltrados.length / ITEMS_PER_PAGE);
    
    switch(direction) {
        case 'first':
            currentPage = 0;
            break;
        case 'prev':
            if (currentPage > 0) currentPage--;
            break;
        case 'next':
            if (currentPage < totalPages - 1) currentPage++;
            break;
        case 'last':
            currentPage = totalPages - 1;
            break;
    }
    
    displayGrupos();
}
