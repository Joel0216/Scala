// Módulo de Maestros
let db = null;
let maestros = [];
let maestroSeleccionado = null;

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== INICIALIZANDO MÓDULO MAESTROS ===');
    
    await new Promise(r => setTimeout(r, 500));
    
    db = window.supabaseClient || window.supabase || (typeof getSupabase === 'function' ? getSupabase() : null);
    
    if (db) {
        console.log('✓ Supabase disponible en maestros');
        await cargarMaestros();
    } else {
        console.error('✗ Supabase NO disponible');
    }
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    if (typeof habilitarInputs === 'function') habilitarInputs();
});

async function cargarMaestros() {
    if (!db) return;
    
    try {
        const { data, error } = await db
            .from('maestros')
            .select('*')
            .order('nombre');
        
        if (error) {
            console.error('Error cargando maestros:', error);
        } else {
            maestros = data || [];
            console.log(`✓ ${maestros.length} maestros cargados`);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

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

    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = `${dia}/${mes}/${anio} ${String(horas).padStart(2, '0')}:${minutos}:${segundos} ${ampm}`;
    }
}

function limpiarFormulario() {
    ['nombre', 'direccion1', 'direccion2', 'telefono', 'clave', 'rfc', 'grado', 'detallesGrado', 'fechaIngreso'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    maestroSeleccionado = null;
}

function cargarDatosMaestro(maestro) {
    maestroSeleccionado = maestro;
    
    document.getElementById('nombre').value = maestro.nombre || '';
    document.getElementById('telefono').value = maestro.telefono || '';
    document.getElementById('clave').value = maestro.clave || '';
    document.getElementById('rfc').value = maestro.rfc || '';
    document.getElementById('grado').value = maestro.grado || '';
    document.getElementById('detallesGrado').value = maestro.detalles_grado || '';
    
    if (maestro.direccion) {
        const dirs = maestro.direccion.split('\n');
        document.getElementById('direccion1').value = dirs[0] || '';
        document.getElementById('direccion2').value = dirs[1] || '';
    }
    
    if (maestro.fecha_ingreso) {
        const fecha = new Date(maestro.fecha_ingreso);
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        document.getElementById('fechaIngreso').value = 
            `${String(fecha.getDate()).padStart(2, '0')}-${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
    }
}

function nuevoMaestro() {
    limpiarFormulario();
    document.querySelectorAll('input').forEach(i => i.disabled = false);
    document.getElementById('nombre').focus();
}

async function guardarMaestro() {
    if (!db) {
        await mostrarAlerta('Error: Base de datos no conectada');
        return;
    }
    
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        await mostrarAlerta('El nombre es obligatorio');
        document.getElementById('nombre').focus();
        return;
    }
    
    const datos = {
        nombre: nombre.toUpperCase(),
        direccion: document.getElementById('direccion1').value + 
                   (document.getElementById('direccion2').value ? '\n' + document.getElementById('direccion2').value : ''),
        telefono: document.getElementById('telefono').value,
        clave: document.getElementById('clave').value,
        rfc: document.getElementById('rfc').value,
        grado: document.getElementById('grado').value,
        detalles_grado: document.getElementById('detallesGrado').value,
        status: 'activo'
    };
    
    try {
        if (maestroSeleccionado && maestroSeleccionado.id) {
            const { error } = await db.from('maestros').update(datos).eq('id', maestroSeleccionado.id);
            if (error) throw error;
            await mostrarAlerta('Maestro actualizado correctamente');
        } else {
            const { error } = await db.from('maestros').insert([datos]);
            if (error) throw error;
            await mostrarAlerta('Maestro guardado correctamente');
        }
        
        await cargarMaestros();
        limpiarFormulario();
    } catch (error) {
        await mostrarAlerta('Error al guardar: ' + error.message);
    }
}

function buscarMaestro() {
    const modal = document.getElementById('modalBusqueda');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('inputBusqueda').value = '';
        document.getElementById('inputBusqueda').focus();
    }
}

async function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        await mostrarAlerta('Ingrese un nombre o clave');
        return;
    }
    
    const resultados = maestros.filter(m => 
        (m.nombre && m.nombre.toUpperCase().includes(termino)) ||
        (m.clave && m.clave.toUpperCase().includes(termino))
    );
    
    cerrarModal();
    
    if (resultados.length === 0) {
        await mostrarAlerta('No se encontraron maestros');
    } else if (resultados.length === 1) {
        cargarDatosMaestro(resultados[0]);
    } else {
        mostrarListaMaestros(resultados);
    }
}

function mostrarListaMaestros(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    resultados.forEach(maestro => {
        const tr = document.createElement('tr');
        tr.onclick = () => { cargarDatosMaestro(maestro); cerrarModal(); };
        tr.innerHTML = `
            <td>${maestro.nombre || ''}</td>
            <td>${maestro.clave || ''}</td>
            <td>${maestro.telefono || ''}</td>
            <td>${maestro.detalles_grado || ''}</td>
        `;
        tbody.appendChild(tr);
    });
    
    modal.style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalBusqueda').style.display = 'none';
    document.getElementById('modalLista').style.display = 'none';
}

async function borrarMaestro() {
    if (!maestroSeleccionado) {
        await mostrarAlerta('Primero seleccione un maestro');
        return;
    }
    
    const confirma = await mostrarConfirm(`¿Eliminar al maestro ${maestroSeleccionado.nombre}?`);
    if (!confirma) return;
    
    if (!db) {
        await mostrarAlerta('Error: Base de datos no conectada');
        return;
    }
    
    try {
        const { error } = await db.from('maestros').delete().eq('id', maestroSeleccionado.id);
        if (error) throw error;
        
        await mostrarAlerta('Maestro eliminado');
        limpiarFormulario();
        await cargarMaestros();
    } catch (error) {
        await mostrarAlerta('Error: ' + error.message);
    }
}

function terminar() {
    window.location.href = 'archivos.html';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        cerrarModal();
    }
};
