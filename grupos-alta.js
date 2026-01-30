// Inicializar Supabase
let supabase = null;
let cursos = [];
let maestros = [];
let salones = [];

// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando alta de grupos...');

    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Actualizar fecha/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Cargar datos
    await cargarCursos();
    await cargarMaestros();
    await cargarSalones();

    // Setup event listeners
    setupEventListeners();

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
    // Búsqueda predictiva de cursos
    const cursoSearch = document.getElementById('cursoSearch');
    if (cursoSearch) {
        cursoSearch.addEventListener('input', function () {
            buscarCursos(this.value);
        });

        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.search-container')) {
                document.getElementById('cursoSuggestions').classList.remove('show');
            }
        });
    }

    // Búsqueda predictiva de maestros
    const maestroSearch = document.getElementById('maestroSearch');
    if (maestroSearch) {
        maestroSearch.addEventListener('input', function () {
            buscarMaestros(this.value);
        });

        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.search-container')) {
                document.getElementById('maestroSuggestions').classList.remove('show');
            }
        });
    }

    // Actualizar clave al cambiar campos
    const dia = document.getElementById('dia');
    const horaEntrada = document.getElementById('horaEntrada');

    if (dia) dia.addEventListener('change', generarClave);
    if (horaEntrada) horaEntrada.addEventListener('change', generarClave);

    // Mostrar información del salón
    const salon = document.getElementById('salon');
    if (salon) {
        salon.addEventListener('change', function () {
            mostrarInfoSalon(this.value);
        });
    }

    // Botón Nuevo (Guardar)
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', guardarGrupo);
    }

    // Botón Cancelar
    const cancelarBtn = document.getElementById('cancelarBtn');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', limpiarFormulario);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', () => {
            if (confirm('¿Desea salir del alta de grupos?')) {
                window.location.href = 'grupos.html';
            }
        });
    }
}

// Cargar cursos
async function cargarCursos() {
    if (!supabase) return;

    try {
        console.log('Cargando cursos...');
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .eq('activo', true)
            .order('curso', { ascending: true });

        if (error) throw error;

        cursos = data || [];
        console.log(`✓ ${cursos.length} cursos cargados`);
    } catch (error) {
        console.error('Error cargando cursos:', error);
        alert('Error al cargar cursos: ' + error.message);
    }
}

// Cargar maestros
async function cargarMaestros() {
    if (!supabase) return;

    try {
        console.log('Cargando maestros...');
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .eq('status', 'activo')
            .order('nombre', { ascending: true });

        if (error) throw error;

        maestros = data || [];
        console.log(`✓ ${maestros.length} maestros cargados`);
    } catch (error) {
        console.error('Error cargando maestros:', error);
        alert('Error al cargar maestros: ' + error.message);
    }
}

// Cargar salones
async function cargarSalones() {
    if (!supabase) return;

    try {
        console.log('Cargando salones...');
        const { data, error } = await supabase
            .from('salones')
            .select('*')
            .eq('activo', true)
            .order('numero', { ascending: true });

        if (error) throw error;

        salones = data || [];

        // Llenar dropdown de salones
        const select = document.getElementById('salon');
        if (select) {
            select.innerHTML = '<option value="">-- Seleccione --</option>';
            salones.forEach(salon => {
                const option = document.createElement('option');
                option.value = salon.id;
                option.textContent = `${salon.numero} - ${salon.ubicacion || ''}`;
                option.dataset.instrumentos = salon.instrumentos || '';
                select.appendChild(option);
            });
        }

        console.log(`✓ ${salones.length} salones cargados`);
    } catch (error) {
        console.error('Error cargando salones:', error);
        alert('Error al cargar salones: ' + error.message);
    }
}

// Búsqueda predictiva de cursos
function buscarCursos(termino) {
    const suggestions = document.getElementById('cursoSuggestions');
    if (!suggestions) return;

    if (!termino || termino.length < 1) {
        suggestions.classList.remove('show');
        return;
    }

    const terminoUpper = termino.toUpperCase();
    const resultados = cursos.filter(c =>
        c.curso.toUpperCase().includes(terminoUpper) ||
        c.curso.toUpperCase().startsWith(terminoUpper)
    ).slice(0, 10);

    if (resultados.length === 0) {
        suggestions.innerHTML = '<div class="suggestion-item">No se encontraron cursos</div>';
        suggestions.classList.add('show');
        return;
    }

    suggestions.innerHTML = '';
    resultados.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = curso.curso;
        div.onclick = function () {
            seleccionarCurso(curso);
        };
        suggestions.appendChild(div);
    });

    suggestions.classList.add('show');
}

// Seleccionar curso
function seleccionarCurso(curso) {
    document.getElementById('cursoSearch').value = curso.curso;
    document.getElementById('cursoId').value = curso.id;
    document.getElementById('cursoSuggestions').classList.remove('show');

    // Generar clave
    generarClave();
}

// Búsqueda predictiva de maestros
function buscarMaestros(termino) {
    const suggestions = document.getElementById('maestroSuggestions');
    if (!suggestions) return;

    if (!termino || termino.length < 1) {
        suggestions.classList.remove('show');
        return;
    }

    const terminoUpper = termino.toUpperCase();
    const resultados = maestros.filter(m =>
        m.nombre.toUpperCase().includes(terminoUpper) ||
        m.nombre.toUpperCase().startsWith(terminoUpper)
    ).slice(0, 10);

    if (resultados.length === 0) {
        suggestions.innerHTML = '<div class="suggestion-item">No se encontraron maestros</div>';
        suggestions.classList.add('show');
        return;
    }

    suggestions.innerHTML = '';
    resultados.forEach(maestro => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = maestro.nombre;
        div.onclick = function () {
            seleccionarMaestro(maestro);
        };
        suggestions.appendChild(div);
    });

    suggestions.classList.add('show');
}

// Seleccionar maestro
function seleccionarMaestro(maestro) {
    document.getElementById('maestroSearch').value = maestro.nombre;
    document.getElementById('maestroId').value = maestro.id;
    document.getElementById('maestroSuggestions').classList.remove('show');

    // Generar clave
    generarClave();
}

// Generar clave automáticamente
function generarClave() {
    const cursoSearch = document.getElementById('cursoSearch').value;
    const maestroSearch = document.getElementById('maestroSearch').value;
    const dia = document.getElementById('dia').value;
    const horaEntrada = document.getElementById('horaEntrada').value;

    if (!cursoSearch || !maestroSearch || !dia || !horaEntrada) {
        return;
    }

    // Obtener código del curso (primeras 2 letras)
    const cursoCodigo = cursoSearch.substring(0, 2).toUpperCase();

    // Obtener iniciales del maestro
    const nombres = maestroSearch.split(' ');
    let iniciales = '';
    nombres.forEach(nombre => {
        if (nombre.length > 0) {
            iniciales += nombre[0].toUpperCase();
        }
    });
    iniciales = iniciales.substring(0, 4); // Máximo 4 letras

    // Obtener hora (solo la hora sin minutos)
    const hora = horaEntrada.split(':')[0];

    // Generar clave: CURSO + INICIALES + DIA + HORA
    const clave = `${cursoCodigo}${iniciales}${dia}${hora}`;

    document.getElementById('clave').value = clave;
}

// Mostrar información del salón
function mostrarInfoSalon(salonId) {
    const salonInfo = document.getElementById('salonInfo');
    if (!salonInfo) return;

    if (!salonId) {
        salonInfo.classList.remove('show');
        return;
    }

    const salon = salones.find(s => s.id === salonId);
    if (salon && salon.instrumentos) {
        salonInfo.textContent = `Instrumentos disponibles: ${salon.instrumentos}`;
        salonInfo.classList.add('show');
    } else {
        salonInfo.classList.remove('show');
    }
}

// Guardar grupo
async function guardarGrupo() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    // Validar campos obligatorios
    const clave = document.getElementById('clave').value.trim();
    const cursoId = document.getElementById('cursoId').value;
    const maestroId = document.getElementById('maestroId').value;
    const dia = document.getElementById('dia').value;
    const horaEntrada = document.getElementById('horaEntrada').value;
    const horaSalida = document.getElementById('horaSalida').value;
    const salonId = document.getElementById('salon').value;
    const cupo = parseInt(document.getElementById('cupo').value) || 0;
    const inicio = document.getElementById('inicio').value;

    // Validaciones
    if (!clave) {
        alert('La clave es obligatoria.\n\nComplete: Curso, Maestro, Día y Hora de entrada.');
        return;
    }

    if (!cursoId) {
        alert('Debe seleccionar un curso');
        document.getElementById('cursoSearch').focus();
        return;
    }

    if (!maestroId) {
        alert('Debe seleccionar un maestro');
        document.getElementById('maestroSearch').focus();
        return;
    }

    if (!dia) {
        alert('Debe seleccionar un día');
        document.getElementById('dia').focus();
        return;
    }

    if (!horaEntrada) {
        alert('Debe ingresar la hora de entrada');
        document.getElementById('horaEntrada').focus();
        return;
    }

    if (!horaSalida) {
        alert('Debe ingresar la hora de salida');
        document.getElementById('horaSalida').focus();
        return;
    }

    if (!salonId) {
        alert('Debe seleccionar un salón');
        document.getElementById('salon').focus();
        return;
    }

    if (cupo <= 0) {
        alert('El cupo debe ser mayor a 0');
        document.getElementById('cupo').focus();
        return;
    }

    if (!inicio) {
        alert('Debe seleccionar la fecha de inicio');
        document.getElementById('inicio').focus();
        return;
    }

    // Campos opcionales
    const leccion = document.getElementById('leccion').value.trim() || null;
    const fechaLeccion = document.getElementById('fechaLeccion').value || null;

    const grupoData = {
        clave: clave,
        curso_id: cursoId,
        maestro_id: maestroId,
        salon_id: salonId,
        dia: dia,
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
        cupo: cupo,
        alumnos_inscritos: 0,
        inicio: inicio,
        leccion: leccion,
        fecha_leccion: fechaLeccion,
        status: 'activo'
    };

    try {
        console.log('Guardando grupo:', grupoData);

        // Verificar si ya existe la clave
        const { data: existente, error: errorCheck } = await supabase
            .from('grupos')
            .select('id')
            .eq('clave', clave)
            .single();

        if (existente) {
            alert('Ya existe un grupo con la clave: ' + clave);
            return;
        }

        // Insertar nuevo grupo
        const { data, error } = await supabase
            .from('grupos')
            .insert([grupoData])
            .select();

        if (error) throw error;

        alert(`Grupo guardado correctamente\n\nClave: ${clave}\nCurso: ${document.getElementById('cursoSearch').value}\nMaestro: ${document.getElementById('maestroSearch').value}\nDía: ${getDiaNombre(dia)}\nHorario: ${horaEntrada} - ${horaSalida}`);

        // Preguntar si desea crear otro
        if (confirm('¿Desea crear otro grupo?')) {
            limpiarFormulario();
        } else {
            window.location.href = 'grupos.html';
        }
    } catch (error) {
        console.error('Error guardando grupo:', error);
        alert('Error al guardar el grupo: ' + error.message);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('clave').value = '';
    document.getElementById('cursoSearch').value = '';
    document.getElementById('cursoId').value = '';
    document.getElementById('maestroSearch').value = '';
    document.getElementById('maestroId').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('horaEntrada').value = '';
    document.getElementById('horaSalida').value = '';
    document.getElementById('salon').value = '';
    document.getElementById('cupo').value = '0';
    document.getElementById('alumnos').value = '0';
    document.getElementById('inicio').value = '';
    document.getElementById('leccion').value = 'Null';
    document.getElementById('fechaLeccion').value = '';

    document.getElementById('salonInfo').classList.remove('show');
    document.getElementById('cursoSuggestions').classList.remove('show');
    document.getElementById('maestroSuggestions').classList.remove('show');

    document.getElementById('cursoSearch').focus();
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
    return dias[dia] || dia;
}
