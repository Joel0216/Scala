// Inicializar Supabase

let grupos = [];
let maestros = [];
let cursos = [];
let salones = [];

// Esperar a que se cargue el DOM
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando listado de grupos...');

    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
        } else {
            alert('Error: No se pudo conectar a la base de datos');
            return;
        }
    } else {
        alert('Error: initSupabase no está disponible');
        return;
    }

    // Actualizar fecha/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Cargar datos
    await cargarDatos();

    // Setup event listeners
    setupEventListeners();

    // Mostrar todos los grupos
    mostrarGrupos(grupos);

    console.log('Inicialización completa');
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

// Setup event listeners
function setupEventListeners() {
    // Botón Aplicar Filtros
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltrosBtn');
    if (aplicarFiltrosBtn) {
        aplicarFiltrosBtn.addEventListener('click', aplicarFiltros);
    }

    // Botón Limpiar Filtros
    const limpiarFiltrosBtn = document.getElementById('limpiarFiltrosBtn');
    if (limpiarFiltrosBtn) {
        limpiarFiltrosBtn.addEventListener('click', limpiarFiltros);
    }

    // Botón Imprimir
    const imprimirBtn = document.getElementById('imprimirBtn');
    if (imprimirBtn) {
        imprimirBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Botón Cerrar
    const cerrarBtn = document.getElementById('cerrarBtn');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            window.close();
        });
    }
}

// Cargar todos los datos
async function cargarDatos() {
    if (!supabase) return;

    try {
        // Cargar grupos con relaciones
        console.log('Cargando grupos...');
        const { data: dataGrupos, error: errorGrupos } = await supabase
            .from('grupos')
            .select(`
                *,
                cursos (id, curso),
                maestros (id, nombre),
                salones (id, numero, ubicacion)
            `)
            .eq('status', 'activo')
            .order('dia', { ascending: true });

        if (errorGrupos) throw errorGrupos;
        grupos = dataGrupos || [];
        console.log(`✓ ${grupos.length} grupos cargados`);

        // Cargar maestros para filtro
        const { data: dataMaestros, error: errorMaestros } = await supabase
            .from('maestros')
            .select('id, nombre')
            .eq('status', 'activo')
            .order('nombre', { ascending: true });

        if (errorMaestros) throw errorMaestros;
        maestros = dataMaestros || [];

        // Llenar dropdown de maestros
        const filterMaestro = document.getElementById('filterMaestro');
        if (filterMaestro) {
            filterMaestro.innerHTML = '<option value="">Todos</option>';
            maestros.forEach(maestro => {
                const option = document.createElement('option');
                option.value = maestro.id;
                option.textContent = maestro.nombre;
                filterMaestro.appendChild(option);
            });
        }

        console.log(`✓ ${maestros.length} maestros cargados`);
    } catch (error) {
        console.error('Error cargando datos:', error);
        alert('Error al cargar datos: ' + error.message);
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const filterDia = document.getElementById('filterDia').value;
    const filterMaestro = document.getElementById('filterMaestro').value;
    const sortBy = document.getElementById('sortBy').value;

    let gruposFiltrados = [...grupos];

    // Filtrar por día
    if (filterDia) {
        gruposFiltrados = gruposFiltrados.filter(g => g.dia === filterDia);
    }

    // Filtrar por maestro
    if (filterMaestro) {
        gruposFiltrados = gruposFiltrados.filter(g => g.maestro_id === filterMaestro);
    }

    // Ordenar
    gruposFiltrados.sort((a, b) => {
        switch (sortBy) {
            case 'dia':
                const diasOrden = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
                return diasOrden.indexOf(a.dia) - diasOrden.indexOf(b.dia);
            case 'hora':
                return (a.hora_entrada || '').localeCompare(b.hora_salida || '');
            case 'salon':
                return (a.salones?.numero || '').localeCompare(b.salones?.numero || '');
            case 'maestro':
                return (a.maestros?.nombre || '').localeCompare(b.maestros?.nombre || '');
            case 'curso':
                return (a.cursos?.curso || '').localeCompare(b.cursos?.curso || '');
            default:
                return 0;
        }
    });

    mostrarGrupos(gruposFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filterDia').value = '';
    document.getElementById('filterMaestro').value = '';
    document.getElementById('sortBy').value = 'dia';

    mostrarGrupos(grupos);
}

// Mostrar grupos en la tabla
function mostrarGrupos(gruposAMostrar) {
    const tbody = document.getElementById('gruposTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (gruposAMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">No se encontraron grupos</td></tr>';
        actualizarEstadisticas(0, 0, 0);
        return;
    }

    let totalAlumnos = 0;
    let totalHoras = 0;

    gruposAMostrar.forEach(grupo => {
        const row = document.createElement('tr');

        const disponibles = (grupo.cupo || 0) - (grupo.alumnos_inscritos || 0);
        const porcentajeOcupacion = grupo.cupo > 0 ? (grupo.alumnos_inscritos / grupo.cupo) * 100 : 0;

        // Determinar clase de color según disponibilidad
        let claseDisponibilidad = '';
        if (porcentajeOcupacion >= 100) {
            claseDisponibilidad = 'disponible-lleno';
        } else if (porcentajeOcupacion >= 75) {
            claseDisponibilidad = 'disponible-baja';
        } else if (porcentajeOcupacion >= 50) {
            claseDisponibilidad = 'disponible-media';
        } else {
            claseDisponibilidad = 'disponible-alta';
        }

        row.className = claseDisponibilidad;

        // Calcular horas del grupo
        if (grupo.hora_entrada && grupo.hora_salida) {
            const [horaE, minE] = grupo.hora_entrada.split(':').map(Number);
            const [horaS, minS] = grupo.hora_salida.split(':').map(Number);
            const horas = (horaS * 60 + minS - horaE * 60 - minE) / 60;
            totalHoras += horas;
        }

        totalAlumnos += grupo.alumnos_inscritos || 0;

        row.innerHTML = `
            <td><strong>${grupo.clave || ''}</strong></td>
            <td>${grupo.cursos?.curso || 'N/A'}</td>
            <td>${grupo.maestros?.nombre || 'N/A'}</td>
            <td>${getDiaNombre(grupo.dia)}</td>
            <td>${grupo.hora_entrada || ''} - ${grupo.hora_salida || ''}</td>
            <td>${grupo.salones?.numero || ''} ${grupo.salones?.ubicacion ? '- ' + grupo.salones.ubicacion : ''}</td>
            <td style="text-align: center;">${grupo.cupo || 0}</td>
            <td style="text-align: center;"><strong>${grupo.alumnos_inscritos || 0}</strong></td>
            <td style="text-align: center;">${disponibles}</td>
            <td>${grupo.inicio || ''}</td>
        `;

        tbody.appendChild(row);
    });

    actualizarEstadisticas(gruposAMostrar.length, totalAlumnos, totalHoras);
}

// Actualizar estadísticas
function actualizarEstadisticas(totalGrupos, totalAlumnos, totalHoras) {
    document.getElementById('totalGrupos').textContent = totalGrupos;
    document.getElementById('totalAlumnos').textContent = totalAlumnos;
    document.getElementById('totalHoras').textContent = totalHoras.toFixed(1);
}

// Obtener nombre del día
function getDiaNombre(dia) {
    const dias = {
        'LU': 'Lunes',
        'MA': 'Martes',
        'MI': 'Miércoles',
        'JU': 'Jueves',
        'VI': 'Viernes',
        'SA': 'Sábado',
        'DO': 'Domingo'
    };
    return dias[dia] || dia || '';
}
