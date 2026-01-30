// Inicializar Supabase
let supabase = null;
let grupos = [];
let currentIndex = 0;

// Esperar a que se cargue la libreria de Supabase y el DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando grupos...');

    // Esperar a que Supabase esté listo
    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    // Inicializar fecha/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Cargar datos
    if (supabase) {
        await loadCursos();
        await loadMaestros();
        await loadSalones();
        await loadGrupos();
    }

    // Configurar event listeners
    setupEventListeners();

    console.log('Inicialización de grupos completa');
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

// Generar clave del grupo
function generateClave() {
    const cursoSelect = document.getElementById('curso');
    const maestroSelect = document.getElementById('maestro');
    const diaInput = document.getElementById('dia');
    const horaEntradaInput = document.getElementById('horaEntrada');

    if (!cursoSelect || !maestroSelect || !diaInput || !horaEntradaInput) {
        return '';
    }

    const dia = diaInput.value;
    const horaEntrada = horaEntradaInput.value;

    if (!cursoSelect.value || !maestroSelect.value || !dia || !horaEntrada) {
        return '';
    }

    // Obtener código del curso (primeras 2 letras)
    const cursoText = cursoSelect.options[cursoSelect.selectedIndex].textContent;
    const cursoCodigo = cursoText.substring(0, 2).toUpperCase();

    // Obtener iniciales del maestro
    const maestroText = maestroSelect.options[maestroSelect.selectedIndex].textContent;
    const nombres = maestroText.split(' ');
    let iniciales = '';
    nombres.forEach(nombre => {
        if (nombre.length > 0) {
            iniciales += nombre[0].toUpperCase();
        }
    });
    iniciales = iniciales.substring(0, 4); // Máximo 4 letras

    // Obtener hora (solo la hora sin minutos)
    const hora = horaEntrada.split(':')[0];

    return `${cursoCodigo}${iniciales}${dia}${hora}`;
}

// Actualizar clave automáticamente
function updateClave() {
    const clave = generateClave();
    const claveInput = document.getElementById('clave');
    if (claveInput) {
        claveInput.value = clave;
    }
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Event listeners para actualizar clave
    const cursoSelect = document.getElementById('curso');
    const maestroSelect = document.getElementById('maestro');
    const diaInput = document.getElementById('dia');
    const horaEntradaInput = document.getElementById('horaEntrada');

    if (cursoSelect) cursoSelect.addEventListener('change', updateClave);
    if (maestroSelect) maestroSelect.addEventListener('change', updateClave);
    if (diaInput) diaInput.addEventListener('change', updateClave);
    if (horaEntradaInput) horaEntradaInput.addEventListener('change', updateClave);

    // Botón Buscar
    const buscarBtn = document.getElementById('buscarBtn');
    if (buscarBtn) {
        buscarBtn.addEventListener('click', () => {
            const clave = prompt('Proporcione la clave del grupo o inicio de la clave');
            if (clave) {
                const index = grupos.findIndex(g =>
                    g.clave && g.clave.toLowerCase().includes(clave.toLowerCase())
                );
                if (index >= 0) {
                    currentIndex = index;
                    displayGrupo(currentIndex);
                } else {
                    alert('Grupo no encontrado');
                }
            }
        });
    }

    // Botón Borrar
    const borrarBtn = document.getElementById('borrarBtn');
    if (borrarBtn) {
        borrarBtn.addEventListener('click', async () => {
            if (currentIndex < 0 || !grupos[currentIndex]) {
                alert('Seleccione un grupo para eliminar');
                return;
            }

            const grupo = grupos[currentIndex];
            if (!confirm(`¿Esta seguro de querer borrar el grupo ${grupo.clave}?`)) return;

            try {
                const { error } = await supabase
                    .from('grupos')
                    .delete()
                    .eq('id', grupo.id);

                if (error) throw error;

                alert('Grupo eliminado correctamente');
                await loadGrupos();
            } catch (error) {
                console.error('Error eliminando grupo:', error);
                alert('Error al eliminar el grupo: ' + error.message);
            }
        });
    }

    // Botón Edición
    const edicionBtn = document.getElementById('edicionBtn');
    if (edicionBtn) {
        edicionBtn.addEventListener('click', () => {
            if (currentIndex >= 0 && grupos[currentIndex]) {
                window.location.href = `grupos-edicion.html?id=${grupos[currentIndex].id}`;
            } else {
                alert('Seleccione un grupo primero');
            }
        });
    }

    // Botón Altas
    const altasBtn = document.getElementById('altasBtn');
    if (altasBtn) {
        altasBtn.addEventListener('click', () => {
            window.location.href = 'grupos-alta.html';
        });
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', () => {
            window.location.href = 'archivos.html';
        });
    }

    // Botón Info Grupo
    const infoGrupoBtn = document.getElementById('infoGrupoBtn');
    if (infoGrupoBtn) {
        infoGrupoBtn.addEventListener('click', mostrarInfoGrupo);
    }

    // Botón Listado (Sábana de Horarios)
    const listadoBtn = document.getElementById('listadoBtn');
    if (listadoBtn) {
        listadoBtn.addEventListener('click', () => {
            window.open('grupos-listado.html', 'Listado de Grupos', 'width=1400,height=800');
        });
    }
}

// Mostrar información del grupo
function mostrarInfoGrupo() {
    if (currentIndex < 0 || !grupos[currentIndex]) {
        alert('Seleccione un grupo primero');
        return;
    }

    const grupo = grupos[currentIndex];

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
    `;

    modal.innerHTML = `
        <div style="
            background-color: #fefefe;
            margin: 5% auto;
            padding: 30px;
            border: 1px solid #888;
            width: 600px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h2 style="color: #008B8B; margin-bottom: 20px; border-bottom: 2px solid #008B8B; padding-bottom: 10px;">
                Información del Grupo
            </h2>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 15px; font-size: 16px;">
                    <div style="font-weight: bold; color: #333;">Código:</div>
                    <div style="color: #008B8B; font-weight: bold; font-size: 18px;">${grupo.clave || 'N/A'}</div>
                    
                    <div style="font-weight: bold; color: #333;">Nombre del Grupo:</div>
                    <div style="color: #555;">${grupo.clave || 'N/A'}</div>
                    
                    <div style="font-weight: bold; color: #333;">Curso:</div>
                    <div style="color: #555;">${getCursoNombre(grupo.curso_id)}</div>
                    
                    <div style="font-weight: bold; color: #333;">Maestro:</div>
                    <div style="color: #555;">${getMaestroNombre(grupo.maestro_id)}</div>
                    
                    <div style="font-weight: bold; color: #333;">Día:</div>
                    <div style="color: #555;">${getDiaNombre(grupo.dia)}</div>
                    
                    <div style="font-weight: bold; color: #333;">Horario:</div>
                    <div style="color: #555;">${grupo.hora_entrada || 'N/A'} - ${grupo.hora_salida || 'N/A'}</div>
                    
                    <div style="font-weight: bold; color: #333;">Salón:</div>
                    <div style="color: #555;">${getSalonNumero(grupo.salon_id)}</div>
                    
                    <div style="font-weight: bold; color: #333;">Cupo:</div>
                    <div style="color: #555;">${grupo.cupo || 0} alumnos</div>
                    
                    <div style="font-weight: bold; color: #333;">Inscritos:</div>
                    <div style="color: ${grupo.alumnos_inscritos >= grupo.cupo ? '#d9534f' : '#5cb85c'}; font-weight: bold;">
                        ${grupo.alumnos_inscritos || 0} alumnos
                    </div>
                    
                    <div style="font-weight: bold; color: #333;">Disponibles:</div>
                    <div style="color: #555;">${(grupo.cupo || 0) - (grupo.alumnos_inscritos || 0)} lugares</div>
                    
                    <div style="font-weight: bold; color: #333;">Inicio:</div>
                    <div style="color: #555;">${grupo.inicio || 'N/A'}</div>
                    
                    <div style="font-weight: bold; color: #333;">Lección Actual:</div>
                    <div style="color: #555;">${grupo.leccion || 'N/A'}</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="
                    background-color: #008B8B;
                    color: white;
                    padding: 12px 30px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                ">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Funciones auxiliares para obtener nombres
function getCursoNombre(cursoId) {
    const cursoSelect = document.getElementById('curso');
    if (!cursoSelect) return 'N/A';

    const option = Array.from(cursoSelect.options).find(opt => opt.value === cursoId);
    return option ? option.textContent : 'N/A';
}

function getMaestroNombre(maestroId) {
    const maestroSelect = document.getElementById('maestro');
    if (!maestroSelect) return 'N/A';

    const option = Array.from(maestroSelect.options).find(opt => opt.value === maestroId);
    return option ? option.textContent : 'N/A';
}

function getSalonNumero(salonId) {
    const salonSelect = document.getElementById('salon');
    if (!salonSelect) return 'N/A';

    const option = Array.from(salonSelect.options).find(opt => opt.value === salonId);
    return option ? option.textContent : 'N/A';
}

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
    return dias[dia] || dia || 'N/A';
}

// Cargar cursos
async function loadCursos() {
    if (!supabase) return;

    try {
        console.log('Cargando cursos...');
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .order('curso', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('curso');
        if (!select) return;

        select.innerHTML = '<option value="">Seleccione un curso...</option>';

        if (data && data.length > 0) {
            data.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.curso;
                select.appendChild(option);
            });
            console.log(`${data.length} cursos cargados`);
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
    }
}

// Cargar maestros
async function loadMaestros() {
    if (!supabase) return;

    try {
        console.log('Cargando maestros...');
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('maestro');
        if (!select) return;

        select.innerHTML = '<option value="">Seleccione un maestro...</option>';

        if (data && data.length > 0) {
            data.forEach(maestro => {
                const option = document.createElement('option');
                option.value = maestro.id;
                option.textContent = maestro.nombre;
                select.appendChild(option);
            });
            console.log(`${data.length} maestros cargados`);
        }
    } catch (error) {
        console.error('Error cargando maestros:', error);
    }
}

// Cargar salones
async function loadSalones() {
    if (!supabase) return;

    try {
        console.log('Cargando salones...');
        const { data, error } = await supabase
            .from('salones')
            .select('*')
            .order('numero', { ascending: true });

        if (error) throw error;

        const select = document.getElementById('salon');
        if (!select) return;

        select.innerHTML = '<option value="">Seleccione un salón...</option>';

        if (data && data.length > 0) {
            data.forEach(salon => {
                const option = document.createElement('option');
                option.value = salon.id;
                option.textContent = salon.numero;
                select.appendChild(option);
            });
            console.log(`${data.length} salones cargados`);
        }
    } catch (error) {
        console.error('Error cargando salones:', error);
    }
}

// Cargar alumnos del grupo
async function loadAlumnosGrupo(grupoId) {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('nombre', { ascending: true });

        if (error) throw error;

        alumnosGrupo = data || [];
        const tbody = document.getElementById('alumnosTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (alumnosGrupo.length > 0) {
            alumnosGrupo.forEach(alumno => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alumno.credencial1 || ''}</td>
                    <td>${alumno.credencial2 || ''}</td>
                    <td>${alumno.nombre || ''}</td>
                    <td>${alumno.telefono || ''}</td>
                    <td>${alumno.grupo || ''}</td>
                    <td>${alumno.fecha_ingreso || ''}</td>
                `;
                tbody.appendChild(row);
            });

            // Actualizar navegación
            registroActualAlumnos = 0;
            actualizarNavegacionAlumnos();
        }

        // Actualizar contador de alumnos
        const alumnosInput = document.getElementById('alumnos');
        if (alumnosInput) {
            alumnosInput.value = alumnosGrupo.length;
        }
    } catch (error) {
        console.error('Error cargando alumnos:', error);
    }
}

// Cargar grupos
async function loadGrupos() {
    if (!supabase) return;

    try {
        console.log('Cargando grupos...');
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .order('clave', { ascending: true });

        if (error) throw error;

        grupos = data || [];
        console.log(`${grupos.length} grupos cargados`);

        if (grupos.length > 0) {
            currentIndex = 0;
            displayGrupo(currentIndex);
        }
    } catch (error) {
        console.error('Error cargando grupos:', error);
    }
}

// Mostrar grupo
function displayGrupo(index) {
    if (index < 0 || index >= grupos.length) return;

    const grupo = grupos[index];

    const claveInput = document.getElementById('clave');
    const cursoSelect = document.getElementById('curso');
    const diaInput = document.getElementById('dia');
    const maestroSelect = document.getElementById('maestro');
    const horaEntradaInput = document.getElementById('horaEntrada');
    const salonSelect = document.getElementById('salon');
    const cupoInput = document.getElementById('cupo');
    const horaSalidaInput = document.getElementById('horaSalida');
    const inicioInput = document.getElementById('inicio');
    const leccionInput = document.getElementById('leccion');
    const fechaLeccionInput = document.getElementById('fechaLeccion');

    if (claveInput) claveInput.value = grupo.clave || '';
    if (cursoSelect) cursoSelect.value = grupo.curso_id || '';
    if (diaInput) diaInput.value = grupo.dia || '';
    if (maestroSelect) maestroSelect.value = grupo.maestro_id || '';
    if (horaEntradaInput) horaEntradaInput.value = grupo.hora_entrada || '';
    if (salonSelect) salonSelect.value = grupo.salon_id || '';
    if (cupoInput) cupoInput.value = grupo.cupo || 0;
    if (horaSalidaInput) horaSalidaInput.value = grupo.hora_salida || '';
    if (inicioInput) inicioInput.value = grupo.inicio || '';
    if (leccionInput) leccionInput.value = grupo.leccion || 'Null';
    if (fechaLeccionInput) fechaLeccionInput.value = grupo.fecha_leccion || '';

    loadAlumnosGrupo(grupo.id);
}

// Funciones de navegación para tabla de alumnos
let registroActualAlumnos = 0;
let alumnosGrupo = [];

function navegarPrimeroAlumnos() {
    if (alumnosGrupo.length > 0) {
        registroActualAlumnos = 0;
        actualizarNavegacionAlumnos();
    }
}

function navegarAnteriorAlumnos() {
    if (registroActualAlumnos > 0) {
        registroActualAlumnos--;
        actualizarNavegacionAlumnos();
    }
}

function navegarSiguienteAlumnos() {
    if (registroActualAlumnos < alumnosGrupo.length - 1) {
        registroActualAlumnos++;
        actualizarNavegacionAlumnos();
    }
}

function navegarUltimoAlumnos() {
    if (alumnosGrupo.length > 0) {
        registroActualAlumnos = alumnosGrupo.length - 1;
        actualizarNavegacionAlumnos();
    }
}

function navegarRegistroAlumnos() {
    const input = document.getElementById('inputRegistroAlumnos');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= alumnosGrupo.length) {
            registroActualAlumnos = num - 1;
            actualizarNavegacionAlumnos();
        }
    }
}

function actualizarNavegacionAlumnos() {
    const input = document.getElementById('inputRegistroAlumnos');
    if (input) input.value = registroActualAlumnos + 1;
}

// Funciones de navegación para tabla de pagos
let registroActualPagos = 0;
let pagosGrupo = [];

function navegarPrimeroPagos() {
    if (pagosGrupo.length > 0) {
        registroActualPagos = 0;
        actualizarNavegacionPagos();
    }
}

function navegarAnteriorPagos() {
    if (registroActualPagos > 0) {
        registroActualPagos--;
        actualizarNavegacionPagos();
    }
}

function navegarSiguientePagos() {
    if (registroActualPagos < pagosGrupo.length - 1) {
        registroActualPagos++;
        actualizarNavegacionPagos();
    }
}

function navegarUltimoPagos() {
    if (pagosGrupo.length > 0) {
        registroActualPagos = pagosGrupo.length - 1;
        actualizarNavegacionPagos();
    }
}

function navegarRegistroPagos() {
    const input = document.getElementById('inputRegistroPagos');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= pagosGrupo.length) {
            registroActualPagos = num - 1;
            actualizarNavegacionPagos();
        }
    }
}

function actualizarNavegacionPagos() {
    const input = document.getElementById('inputRegistroPagos');
    if (input) input.value = registroActualPagos + 1;
}
