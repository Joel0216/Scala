// Inicializar Supabase

let maestros = [];
let maestroSeleccionado = null;

// Esperar a que se cargue la librería de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando maestros...');

    // Inicializar Supabase de forma robusta
    let dbConnected = false;
    if (typeof initSupabase === 'function') {
        dbConnected = initSupabase();
        if (dbConnected) {
            supabase = window.supabase;
        } else {
            console.warn('Esperando conexión a base de datos (Maestros)');
        }
    }

    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Cargar maestros si hay conexión
    if (dbConnected) {
        await cargarMaestros();
    } else {
        setTimeout(async () => {
            if (window.supabase) {
                supabase = window.supabase;
                await cargarMaestros();
            }
        }, 2000);
    }

    // Asegurar que los inputs estén habilitados por si acaso
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.disabled = false);

    console.log('Inicialización de maestros completa');
});

console.log('Inicialización de maestros completa');
});

// Cargar maestros desde Supabase
async function cargarMaestros() {
    if (!supabase) return;

    try {
        console.log('Cargando maestros desde Supabase...');
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        maestros = data || [];
        console.log(`${maestros.length} maestros cargados`);
    } catch (error) {
        console.error('Error cargando maestros:', error);
        // Si hay error, usar datos de ejemplo
        maestros = [
            {
                nombre: 'AARON GONZALEZ',
                direccion: 'CALLE 51 #246 X 44 Y 46 ALTOS\nMERIDA, YUCATAN',
                telefono: '9 19 40 39',
                clave: 'AG',
                rfc: '',
                grado: '',
                detalles_grado: 'GUITARRA ELETRICA',
                fecha_ingreso: '2015-10-26'
            }
        ];
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

    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = `${dia}/${mes}/${anio} ${horasStr}:${minutos}:${segundos} ${ampm}`;
    }
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// Función para limpiar formulario
function limpiarFormulario() {
    const nombreInput = document.getElementById('nombre');
    const direccion1Input = document.getElementById('direccion1');
    const direccion2Input = document.getElementById('direccion2');
    const telefonoInput = document.getElementById('telefono');
    const claveInput = document.getElementById('clave');
    const rfcInput = document.getElementById('rfc');
    const gradoInput = document.getElementById('grado');
    const detallesGradoInput = document.getElementById('detallesGrado');
    const fechaIngresoInput = document.getElementById('fechaIngreso');

    if (nombreInput) nombreInput.value = '';
    if (direccion1Input) direccion1Input.value = '';
    if (direccion2Input) direccion2Input.value = '';
    if (telefonoInput) telefonoInput.value = '';
    if (claveInput) claveInput.value = '';
    if (rfcInput) rfcInput.value = '';
    if (gradoInput) gradoInput.value = '';
    if (detallesGradoInput) detallesGradoInput.value = '';
    if (fechaIngresoInput) fechaIngresoInput.value = '';

    maestroSeleccionado = null;
}

// Función para cargar datos del maestro
function cargarDatosMaestro(maestro) {
    maestroSeleccionado = maestro;

    const nombreInput = document.getElementById('nombre');
    const direccion1Input = document.getElementById('direccion1');
    const direccion2Input = document.getElementById('direccion2');
    const telefonoInput = document.getElementById('telefono');
    const claveInput = document.getElementById('clave');
    const rfcInput = document.getElementById('rfc');
    const gradoInput = document.getElementById('grado');
    const detallesGradoInput = document.getElementById('detallesGrado');
    const fechaIngresoInput = document.getElementById('fechaIngreso');

    if (nombreInput) nombreInput.value = maestro.nombre || '';

    // Dividir dirección si viene en una sola línea
    if (maestro.direccion) {
        const direcciones = maestro.direccion.split('\n');
        if (direccion1Input) direccion1Input.value = direcciones[0] || '';
        if (direccion2Input) direccion2Input.value = direcciones[1] || '';
    } else {
        if (direccion1Input) direccion1Input.value = '';
        if (direccion2Input) direccion2Input.value = '';
    }

    if (telefonoInput) telefonoInput.value = maestro.telefono || '';
    if (claveInput) claveInput.value = maestro.clave || '';
    if (rfcInput) rfcInput.value = maestro.rfc || '';
    if (gradoInput) gradoInput.value = maestro.grado || '';
    if (detallesGradoInput) detallesGradoInput.value = maestro.detalles_grado || '';

    // Formatear fecha
    if (fechaIngresoInput && maestro.fecha_ingreso) {
        const fecha = new Date(maestro.fecha_ingreso);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const mes = meses[fecha.getMonth()];
        const anio = fecha.getFullYear();
        fechaIngresoInput.value = `${dia}-${mes}-${anio}`;
    }
}

// Botón Nuevo - Limpiar formulario
function nuevoMaestro() {
    limpiarFormulario();
    // Habilitar todos los campos explícitamente
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.disabled = false);

    document.getElementById('nombre').focus();
}

// Guardar maestro
async function guardarMaestro() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const direccion1 = document.getElementById('direccion1').value.trim();
    const direccion2 = document.getElementById('direccion2').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const clave = document.getElementById('clave').value.trim();
    const rfc = document.getElementById('rfc').value.trim();
    const grado = document.getElementById('grado').value.trim();
    const detallesGrado = document.getElementById('detallesGrado').value.trim();
    const fechaIngreso = document.getElementById('fechaIngreso').value.trim();

    if (!nombre) {
        alert('El nombre es obligatorio');
        document.getElementById('nombre').focus();
        return;
    }

    // Convertir fecha de formato DD-MMM-YYYY a YYYY-MM-DD
    let fechaIngresoFormato = null;
    if (fechaIngreso) {
        const meses = {
            'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04',
            'may': '05', 'jun': '06', 'jul': '07', 'ago': '08',
            'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
        };
        const partes = fechaIngreso.split('-');
        if (partes.length === 3) {
            const mes = meses[partes[1].toLowerCase()] || partes[1];
            fechaIngresoFormato = `${partes[2]}-${mes}-${partes[0].padStart(2, '0')}`;
        }
    }

    const maestroData = {
        nombre: nombre.toUpperCase(),
        direccion: direccion1 + (direccion2 ? '\n' + direccion2 : ''),
        telefono: telefono,
        clave: clave,
        rfc: rfc,
        grado: grado,
        detalles_grado: detallesGrado,
        fecha_ingreso: fechaIngresoFormato,
        status: 'activo'
    };

    try {
        if (maestroSeleccionado && maestroSeleccionado.id) {
            // Actualizar maestro existente
            const { error } = await supabase
                .from('maestros')
                .update(maestroData)
                .eq('id', maestroSeleccionado.id);

            if (error) throw error;
            alert('Maestro actualizado correctamente');
        } else {
            // Insertar nuevo maestro
            const { error } = await supabase
                .from('maestros')
                .insert([maestroData]);

            if (error) throw error;
            alert('Maestro guardado correctamente');
        }

        // Recargar maestros
        await cargarMaestros();
        limpiarFormulario();
    } catch (error) {
        console.error('Error guardando maestro:', error);
        alert('Error al guardar el maestro: ' + error.message);
    }
}

// Botón Buscar
function buscarMaestro() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();

    if (!termino) {
        alert('Por favor ingrese un nombre o clave');
        return;
    }

    // Buscar por nombre o clave
    const resultados = maestros.filter(m => {
        const nombreMatch = m.nombre && m.nombre.toUpperCase().includes(termino);
        const claveMatch = m.clave && m.clave.toUpperCase().includes(termino);
        const nombreStartsWith = m.nombre && m.nombre.toUpperCase().startsWith(termino);
        const claveStartsWith = m.clave && m.clave.toUpperCase().startsWith(termino);

        return nombreMatch || claveMatch || nombreStartsWith || claveStartsWith;
    });

    cerrarModal();

    if (resultados.length === 0) {
        alert('No se encontraron maestros con ese nombre o clave');
    } else if (resultados.length === 1) {
        cargarDatosMaestro(resultados[0]);
    } else {
        mostrarListaMaestros(resultados);
    }
}

// Mostrar lista de maestros
function mostrarListaMaestros(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';

    resultados.forEach((maestro, index) => {
        const tr = document.createElement('tr');
        tr.onclick = function () {
            cargarDatosMaestro(maestro);
            cerrarModal();
        };
        tr.innerHTML = `
            <td>${maestro.nombre || ''}</td>
            <td>${maestro.clave || 'N/A'}</td>
            <td>${maestro.telefono || ''}</td>
            <td>${maestro.detalles_grado || ''}</td>
        `;
        tbody.appendChild(tr);
    });

    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalBusqueda').style.display = 'none';
    document.getElementById('modalLista').style.display = 'none';
}

// Botón Borrar
async function borrarMaestro() {
    if (!maestroSeleccionado) {
        alert('Primero debe seleccionar un maestro');
        return;
    }

    if (!confirm(`¿Está seguro de eliminar al maestro ${maestroSeleccionado.nombre}?`)) {
        return;
    }

    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    try {
        const { error } = await supabase
            .from('maestros')
            .delete()
            .eq('id', maestroSeleccionado.id);

        if (error) throw error;

        alert('Maestro eliminado correctamente');
        limpiarFormulario();
        await cargarMaestros();
    } catch (error) {
        console.error('Error eliminando maestro:', error);
        alert('Error al eliminar el maestro: ' + error.message);
    }
}

// Botón Terminar
function terminar() {
    window.location.href = 'archivos.html';
}

// Cerrar modales al hacer clic fuera
window.onclick = function (event) {
    const modalBusqueda = document.getElementById('modalBusqueda');
    const modalLista = document.getElementById('modalLista');

    if (event.target === modalBusqueda) {
        modalBusqueda.style.display = 'none';
    }
    if (event.target === modalLista) {
        modalLista.style.display = 'none';
    }
}

// Agregar script de Supabase
const script = document.createElement('script');
script.src = 'supabase-config.js';
document.head.appendChild(script);
