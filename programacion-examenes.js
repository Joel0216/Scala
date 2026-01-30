// Inicializar Supabase
let supabase = null;
let examenes = [];
let registroActual = 0;
let filaSeleccionada = null;

// Referencias a elementos del DOM
const claveInput = document.getElementById('claveExamen');
const fechaInput = document.getElementById('fechaExamen');
const horaInput = document.getElementById('horaExamen');
const tipoSelect = document.getElementById('tipoExamen');
const salonSelect = document.getElementById('salonExamen');
const cursoSelect = document.getElementById('cursoExamen');
const maestroSelect = document.getElementById('maestroBase');
const examinador1Select = document.getElementById('examinador1');
const examinador2Select = document.getElementById('examinador2');
const registroSpan = document.getElementById('registroActual');
const totalSpan = document.getElementById('totalRegistros');
const modalBusqueda = document.getElementById('modalBusqueda');
const modalLista = document.getElementById('modalLista');
const inputBusqueda = document.getElementById('inputBusqueda');
const bodyResultados = document.getElementById('bodyResultados');

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando programación de exámenes...');

    try {
        await new Promise(r => setTimeout(r, 500));
        if (typeof waitForSupabase === 'function') {
            supabase = await waitForSupabase(10000);
            console.log('✓ Supabase conectado');
            await cargarCatalogos();
            await cargarExamenes();
        }
    } catch (e) {
        console.error('Error conectando a Supabase:', e);
    }

    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

// Cargar catálogos (Maestros, Salones, Cursos)
async function cargarCatalogos() {
    if (!supabase) return;

    try {
        // Cargar Maestros
        const { data: maestros, error: errorMaestros } = await supabase
            .from('maestros')
            .select('id, nombre')
            .order('nombre');

        if (errorMaestros) throw errorMaestros;

        // Llenar selects de maestros
        const selectsMaestros = [maestroSelect, examinador1Select, examinador2Select];
        selectsMaestros.forEach(select => {
            if (select) {
                const valorActual = select.value;
                select.innerHTML = '<option value="">Seleccione...</option>';
                maestros.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.nombre; // Guardamos el nombre porque así estaba en el diseño original, idealmente sería ID
                    option.dataset.id = m.id;
                    option.textContent = m.nombre;
                    select.appendChild(option);
                });
                if (valorActual) select.value = valorActual;
            }
        });

        // Cargar Salones
        const { data: salones, error: errorSalones } = await supabase
            .from('salones')
            .select('id, numero')
            .order('numero');

        if (errorSalones) throw errorSalones;

        if (salonSelect) {
            salonSelect.innerHTML = '<option value="">Seleccione...</option>';
            salones.forEach(s => {
                const option = document.createElement('option');
                option.value = s.numero; // Guardamos numero
                option.dataset.id = s.id;
                option.textContent = s.numero;
                salonSelect.appendChild(option);
            });
        }

        // Cargar Cursos
        const { data: cursos, error: errorCursos } = await supabase
            .from('cursos')
            .select('id, curso')
            .order('curso');

        if (errorCursos) throw errorCursos;

        if (cursoSelect) {
            cursoSelect.innerHTML = '<option value="">Seleccione...</option>';
            cursos.forEach(c => {
                const option = document.createElement('option');
                option.value = c.curso;
                option.textContent = c.curso;
                cursoSelect.appendChild(option);
            });
        }

    } catch (error) {
        console.error('Error cargando catálogos:', error);
    }
}

// Cargar exámenes desde Supabase
async function cargarExamenes() {
    if (!supabase) return;

    try {
        // Obtenemos los encabezados de exámenes (filas donde alumno_id es null O distinct on clave)
        // Usaremos distinct on clave para mostrar uno solo por examen
        const { data, error } = await supabase
            .from('programacion_examenes')
            .select('*')
            .order('clave_examen', { ascending: true });

        // Filtrar duplicados en JS (agrupar por clave)
        const examenesMap = new Map();
        if (data) {
            data.forEach(row => {
                if (!examenesMap.has(row.clave_examen)) {
                    examenesMap.set(row.clave_examen, {
                        id: row.id,
                        clave: row.clave_examen,
                        fecha: row.fecha, // Debería ser YYYY-MM-DD
                        hora: row.hora,
                        tipo: row.tipo_examen,
                        salon: null, // Necesitamos recuperar numero de salon si tenemos ID
                        // Como guardamos IDs en tabla pero nombres en UI, necesitamos hacer match o guardar nombres directos
                        // Para simplificar y compatibilidad, asumiremos que guardamos nombres O IDs si modificamos.
                        // En la tabla guardamos IDs. Así que aquí deberíamos hacer joins.
                        // Simplificación: Guardaremos los textos en la tabla auxiliar o asumiremos mapeo.
                        // El diseño de tabla tiene IDs. Vamos a intentar hacer fetch con joins.
                        maestroBaseId: row.maestro_base_id,
                        examinador1Id: row.examinador1_id,
                        examinador2Id: row.examinador2_id,
                        salonId: row.salon_id,
                        curso: row.curso_nombre // No esta en tabla, está implicitamente en el grupo o manual?
                        // El HTML tiene un select cursoExamen.
                    });
                }
            });
        }

        // Recargar con Joins para obtener nombres
        const { data: dataCompleta, error: errorCompleta } = await supabase
            .from('programacion_examenes')
            .select(`
                id,
                clave_examen,
                fecha,
                hora,
                tipo_examen,
                salon_id,
                salones (numero),
                maestro_base_id,
                mb:maestros!maestro_base_id (nombre),
                examinador1_id,
                e1:maestros!examinador1_id (nombre),
                examinador2_id,
                e2:maestros!examinador2_id (nombre)
            `)
            .order('clave_examen');

        if (errorCompleta) throw errorCompleta;

        // Procesar data completa
        const examenesUnicos = [];
        const clavesVistas = new Set();

        if (dataCompleta) {
            dataCompleta.forEach(row => {
                if (!clavesVistas.has(row.clave_examen)) {
                    clavesVistas.add(row.clave_examen);
                    examenesUnicos.push({
                        id: row.id,
                        clave: row.clave_examen,
                        fecha: row.fecha,
                        hora: row.hora,
                        tipo: row.tipo_examen,
                        salon: row.salones?.numero || '',
                        maestroBase: row.mb?.nombre || '',
                        examinador1: row.e1?.nombre || '',
                        examinador2: row.e2?.nombre || '',
                        curso: '' // Este campo no estaba en la tabla 'programacion_examenes' explicitamente como curso_id
                        // Si es critico, agregar a tabla. Por ahora string vacio.
                    });
                }
            });
        }

        examenes = examenesUnicos;
        totalSpan.textContent = examenes.length;
        document.getElementById('inputRegistro').max = examenes.length || 1;

        if (examenes.length > 0) {
            mostrarRegistro(0);
        } else {
            // Limpiar
            nuevoExamen();
        }

    } catch (error) {
        console.error('Error cargando exámenes:', error);
        // alert('Error cargando exámenes: ' + error.message);
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

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < examenes.length) {
        registroActual = index;
        const examen = examenes[index];

        if (claveInput) claveInput.value = examen.clave || '';
        if (fechaInput) fechaInput.value = examen.fecha || '';
        if (horaInput) horaInput.value = examen.hora || '';
        if (tipoSelect) tipoSelect.value = examen.tipo || '';
        if (salonSelect) salonSelect.value = examen.salon || '';
        // cursoSelect ?
        if (maestroSelect) maestroSelect.value = examen.maestroBase || '';
        if (examinador1Select) examinador1Select.value = examen.examinador1 || '';
        if (examinador2Select) examinador2Select.value = examen.examinador2 || '';

        actualizarContador();
    }
}

// Actualizar contador
function actualizarContador() {
    if (registroSpan) registroSpan.textContent = examenes.length > 0 ? registroActual + 1 : 0;
    if (totalSpan) totalSpan.textContent = examenes.length;
    const input = document.getElementById('inputRegistro');
    if (input) input.value = registroActual + 1;
}

// Botón Nuevo
function nuevoExamen() {
    if (claveInput) {
        claveInput.value = '';
        claveInput.focus();
    }
    if (fechaInput) fechaInput.value = '';
    if (horaInput) horaInput.value = '19:00';
    if (tipoSelect) tipoSelect.value = '';
    if (salonSelect) salonSelect.value = '';
    if (cursoSelect) cursoSelect.value = '';
    if (maestroSelect) maestroSelect.value = '';
    if (examinador1Select) examinador1Select.value = '';
    if (examinador2Select) examinador2Select.value = '';
}

// Guardar Examen (NUEVO)
async function guardarExamen() {
    if (!supabase) return;

    const clave = claveInput.value.trim();
    if (!clave) {
        alert('La clave es obligatoria');
        return;
    }

    try {
        // Buscar IDs correspondientes a los nombres seleccionados
        // (Esto es ineficiente, idealmente los selects tendrían IDs como value)
        // Pero mantenemos compatibilidad con el diseño visual si es necesario.
        // Mejor: Vamos a modificar cargarCatalogos para poner nombres en value (como hicimos),
        // pero necesitamos los IDs para guardar en BD.
        // Usaremos dataset.id si es posible, o buscaremos.

        const getSelectedId = (selectElement) => {
            const option = selectElement.options[selectElement.selectedIndex];
            return option && option.dataset.id ? option.dataset.id : null;
        };

        const maestroId = getSelectedId(maestroSelect);
        const examiner1Id = getSelectedId(examinador1Select);
        const examiner2Id = getSelectedId(examinador2Select);
        const salonId = getSelectedId(salonSelect);

        const examenData = {
            clave_examen: clave,
            fecha: fechaInput.value, // Asegurarse que es YYYY-MM-DD o compatible
            hora: horaInput.value,
            tipo_examen: tipoSelect.value,
            salon_id: salonId,
            maestro_base_id: maestroId,
            examinador1_id: examiner1Id,
            examinador2_id: examiner2Id
            // alumno_id se deja null para el encabezado
        };

        // Verificar si ya existe un registro con esa clave
        const { data: existente } = await supabase
            .from('programacion_examenes')
            .select('id')
            .eq('clave_examen', clave)
            .limit(1);

        if (existente && existente.length > 0) {
            // Actualizar TODOS los registros con esa clave (encabezado y alumnos)
            // para mantener consistencia en fecha/hora/maestros
            const { error: errorUpdate } = await supabase
                .from('programacion_examenes')
                .update(examenData)
                .eq('clave_examen', clave);

            if (errorUpdate) throw errorUpdate;
            alert('Examen actualizado correctamente');
        } else {
            // Insertar nuevo encabezado
            const { error: errorInsert } = await supabase
                .from('programacion_examenes')
                .insert([examenData]);

            if (errorInsert) throw errorInsert;
            alert('Examen guardado correctamente');
        }

        await cargarExamenes();

    } catch (error) {
        console.error('Error guardando:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// Funciones de botones
if (document.getElementById('btnNuevo')) document.getElementById('btnNuevo').addEventListener('click', nuevoExamen);
if (document.getElementById('btnGuardar')) document.getElementById('btnGuardar').addEventListener('click', guardarExamen);

if (document.getElementById('btnBorrar')) document.getElementById('btnBorrar').addEventListener('click', async () => {
    if (!claveInput.value) return;
    if (confirm('¿Eliminar este examen y toda su programación?')) {
        try {
            const { error } = await supabase
                .from('programacion_examenes')
                .delete()
                .eq('clave_examen', claveInput.value);
            if (error) throw error;
            alert('Eliminado correctamente');
            await cargarExamenes();
        } catch (e) {
            alert('Error eliminando: ' + e.message);
        }
    }
});

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

    // Filtrar localmente (ya cargamos todo) o buscar en BD si son muchos
    const resultados = examenes.filter(e => e.clave.includes(termino));

    modalBusqueda.style.display = 'none';

    if (resultados.length === 1) {
        const index = examenes.findIndex(e => e.clave === resultados[0].clave);
        mostrarRegistro(index);
    } else if (resultados.length > 1) {
        mostrarListaResultados(resultados);
    } else {
        alert('No se encontraron resultados');
    }
});

function mostrarListaResultados(resultados) {
    if (!bodyResultados) return;
    bodyResultados.innerHTML = '';
    resultados.forEach(ex => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${ex.clave}</td><td>${ex.fecha}</td><td>${ex.tipo}</td>`;
        tr.onclick = () => {
            const index = examenes.findIndex(e => e.clave === ex.clave);
            mostrarRegistro(index);
            modalLista.style.display = 'none';
        };
        bodyResultados.appendChild(tr);
    });
    modalLista.style.display = 'block';
}

if (document.getElementById('btnCancelarBusqueda')) document.getElementById('btnCancelarBusqueda').addEventListener('click', () => {
    modalBusqueda.style.display = 'none';
});
if (document.getElementById('btnCancelarLista')) document.getElementById('btnCancelarLista').addEventListener('click', () => {
    modalLista.style.display = 'none';
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
