// Inicializar Supabase

let examenes = [];
let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const claveInput = document.getElementById('claveExamen');
const fechaInput = document.getElementById('fechaExamen');
const horaInput = document.getElementById('horaExamen');
const tipoInput = document.getElementById('tipoExamen');
const salonInput = document.getElementById('salonExamen');
const maestroInput = document.getElementById('maestroBase');
const examinador1Input = document.getElementById('examinador1');
const examinador2Input = document.getElementById('examinador2');

const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const inputBusqueda = document.getElementById('inputBusqueda');
const bodyResultados = document.getElementById('bodyResultados');
const bodyAlumnos = document.getElementById('bodyAlumnos');

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando relación de exámenes...');

    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');

            // Cargar exámenes
            await cargarExamenes();
        } else {
            console.error('✗ Error al conectar con Supabase');
            alert('Error: No se pudo conectar a la base de datos');
        }
    } else {
        console.error('✗ initSupabase no está disponible');
        alert('Error: initSupabase no está disponible');
    }

    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

// Cargar exámenes (Solo encabezados o agrupados)
async function cargarExamenes() {
    if (!supabase) return;

    try {
        // Traer todos y agrupar por clave
        const { data, error } = await supabase
            .from('programacion_examenes')
            .select(`
                *,
                salones (numero),
                mb:maestros!maestro_base_id (nombre),
                e1:maestros!examinador1_id (nombre),
                e2:maestros!examinador2_id (nombre)
            `)
            .order('clave_examen')
            .order('created_at'); // Para tener determinismo

        if (error) throw error;

        // Agrupar
        const map = new Map();
        if (data) {
            data.forEach(row => {
                if (!map.has(row.clave_examen)) {
                    map.set(row.clave_examen, {
                        clave: row.clave_examen,
                        fecha: row.fecha,
                        hora: row.hora,
                        tipo: row.tipo_examen,
                        salon: row.salones?.numero || '',
                        maestroBase: row.mb?.nombre || '',
                        examinador1: row.e1?.nombre || '',
                        examinador2: row.e2?.nombre || ''
                    });
                }
            });
        }

        examenes = Array.from(map.values());

        if (totalSpan) totalSpan.textContent = examenes.length;
        const inputReg = document.getElementById('inputRegistro');
        if (inputReg) inputReg.max = examenes.length || 1;

        if (examenes.length > 0) {
            mostrarRegistro(0);
        }

    } catch (error) {
        console.error('Error cargando exámenes:', error);
    }
}

// Mostrar registro actual
async function mostrarRegistro(index) {
    if (index >= 0 && index < examenes.length) {
        registroActual = index;
        const examen = examenes[index];

        if (claveInput) claveInput.value = examen.clave || '';
        if (fechaInput) fechaInput.value = examen.fecha || '';
        if (horaInput) horaInput.value = examen.hora || '';
        if (tipoInput) tipoInput.value = examen.tipo || '';
        if (salonInput) salonInput.value = examen.salon || '';
        if (maestroInput) maestroInput.value = examen.maestroBase || '';
        if (examinador1Input) examinador1Input.value = examen.examinador1 || '';
        if (examinador2Input) examinador2Input.value = examen.examinador2 || '';

        actualizarContador();

        // Cargar alumnos para este examen
        await cargarAlumnosExamen(examen.clave);
    }
}

// Cargar alumnos de un examen específico
async function cargarAlumnosExamen(clave) {
    if (!supabase || !bodyAlumnos) return;

    bodyAlumnos.innerHTML = '<tr><td colspan="12">Cargando...</td></tr>';

    try {
        const { data, error } = await supabase
            .from('programacion_examenes')
            .select('*')
            .eq('clave_examen', clave)
            .not('alumno_id', 'is', null) // Solo registros con alumno
            .order('credencial'); // Ordenar por credencial

        if (error) throw error;

        mostrarAlumnosTabla(data || []);

    } catch (error) {
        console.error('Error cargando alumnos:', error);
        bodyAlumnos.innerHTML = '<tr><td colspan="12">Error al cargar alumnos</td></tr>';
    }
}

// Renderizar tabla de alumnos
function mostrarAlumnosTabla(alumnos) {
    bodyAlumnos.innerHTML = '';

    if (alumnos.length === 0) {
        bodyAlumnos.innerHTML = '<tr><td colspan="12">No hay alumnos registrados para este examen</td></tr>';
        return;
    }

    alumnos.forEach(alumno => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>►</td>
            <td>${alumno.hora || ''}</td>
            <td>${alumno.credencial || ''}</td>
            <td>${alumno.nombre_alumno || ''}</td>
            <td>${alumno.grado_alumno || ''}</td>
            <td>${alumno.recibo_pago || ''}</td>
            <td>${alumno.fecha || ''}</td>
            <td>1</td>
            <td>${alumno.monto_pago || ''}</td>
            <td style="text-align: center;"><input type="checkbox" class="check-presento" data-id="${alumno.id}" ${alumno.presento ? 'checked' : ''}></td>
            <td style="text-align: center;"><input type="checkbox" class="check-aprobo" data-id="${alumno.id}" ${alumno.aprobo ? 'checked' : ''}></td>
            <td>${alumno.certificado || ''}</td>
        `;

        bodyAlumnos.appendChild(tr);
    });

    // Agregar event listeners a los checkboxes para auto-save
    document.querySelectorAll('.check-presento').forEach(chk => {
        chk.addEventListener('change', (e) => actualizarEstado(e.target.dataset.id, 'presento', e.target.checked));
    });

    document.querySelectorAll('.check-aprobo').forEach(chk => {
        chk.addEventListener('change', (e) => actualizarEstado(e.target.dataset.id, 'aprobo', e.target.checked));
    });
}

// Actualizar estado (checkboxes)
async function actualizarEstado(id, campo, valor) {
    if (!supabase) return;

    try {
        const updateObj = {};
        updateObj[campo] = valor;

        const { error } = await supabase
            .from('programacion_examenes')
            .update(updateObj)
            .eq('id', id);

        if (error) throw error;
        console.log(`Actualizado ${campo} a ${valor} para ID ${id}`);

    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('No se pudo guardar el cambio: ' + error.message);
        // Revertir checkbox si falla? Sería ideal.
    }
}

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    let horas = ahora.getHours();
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12 || 12;
    const horasStr = String(horas).padStart(2, '0');
    const el = document.getElementById('fechaHora');
    if (el) el.textContent = `${dia}/${mes}/${anio} ${horasStr}:${minutos}:${segundos} ${ampm}`;
}

function actualizarContador() {
    if (registroSpan) registroSpan.textContent = examenes.length > 0 ? registroActual + 1 : 0;
    const input = document.getElementById('inputRegistro');
    if (input) input.value = registroActual + 1;
}

// Botón Buscar
if (document.getElementById('btnBuscar')) document.getElementById('btnBuscar').addEventListener('click', () => {
    inputBusqueda.value = '';
    modalBusqueda.style.display = 'block';
    inputBusqueda.focus();
});

// Aceptar Búsqueda
if (document.getElementById('btnAceptarBusqueda')) document.getElementById('btnAceptarBusqueda').addEventListener('click', () => {
    const termino = inputBusqueda.value.trim().toUpperCase();
    if (!termino) return;

    const index = examenes.findIndex(e => e.clave.includes(termino));

    modalBusqueda.style.display = 'none';

    if (index !== -1) {
        mostrarRegistro(index);
    } else {
        alert('No se encontraron resultados');
    }
});

if (document.getElementById('btnCancelarBusqueda')) document.getElementById('btnCancelarBusqueda').addEventListener('click', () => {
    modalBusqueda.style.display = 'none';
});

// Navegación
if (document.getElementById('btnPrimero')) document.getElementById('btnPrimero').addEventListener('click', () => mostrarRegistro(0));
if (document.getElementById('btnUltimo')) document.getElementById('btnUltimo').addEventListener('click', () => mostrarRegistro(examenes.length - 1));
if (document.getElementById('btnAnterior')) document.getElementById('btnAnterior').addEventListener('click', () => mostrarRegistro(registroActual - 1));
if (document.getElementById('btnSiguiente')) document.getElementById('btnSiguiente').addEventListener('click', () => mostrarRegistro(registroActual + 1));

// Botón Terminar
if (document.getElementById('btnTerminar')) document.getElementById('btnTerminar').addEventListener('click', () => {
    window.location.href = 'examenes-menu.html';
});
