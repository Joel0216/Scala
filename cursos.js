// Módulo de Cursos
let db = null;
let cursos = [];
let cursoSeleccionado = null;
let modoNuevo = false;

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== INICIALIZANDO MÓDULO CURSOS ===');
    
    await new Promise(r => setTimeout(r, 500));
    
    db = window.supabaseClient || window.supabase || (typeof getSupabase === 'function' ? getSupabase() : null);
    
    if (db) {
        console.log('✓ Supabase disponible en cursos');
        await cargarCursos();
    } else {
        console.error('✗ Supabase NO disponible');
    }
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    configurarValidaciones();
    
    const cursoInput = document.getElementById('curso');
    if (cursoInput) {
        cursoInput.addEventListener('input', generarClaveAutomatica);
    }
    
    if (typeof habilitarInputs === 'function') habilitarInputs();
});

async function cargarCursos() {
    if (!db) return;
    try {
        const { data, error } = await db.from('cursos').select('*').order('curso');
        if (error) {
            console.error('Error cargando cursos:', error);
        } else {
            cursos = data || [];
            console.log(`✓ ${cursos.length} cursos cargados`);
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

function configurarValidaciones() {
    const costoInput = document.getElementById('costo');
    if (costoInput) {
        costoInput.addEventListener('input', function() { validarCampoMoneda(this); });
        costoInput.addEventListener('keypress', function(e) {
            if (!/[0-9.]/.test(e.key)) e.preventDefault();
        });
    }
    const recargoInput = document.getElementById('recargo');
    if (recargoInput) {
        recargoInput.addEventListener('input', function() { validarCampoMoneda(this); });
        recargoInput.addEventListener('keypress', function(e) {
            if (!/[0-9.]/.test(e.key)) e.preventDefault();
        });
    }
}

function validarCampoMoneda(input) {
    let valor = input.value.replace(/[^0-9.]/g, '');
    const partes = valor.split('.');
    if (partes.length > 2) valor = partes[0] + '.' + partes.slice(1).join('');
    if (partes.length === 2 && partes[1].length > 2) valor = partes[0] + '.' + partes[1].substring(0, 2);
    input.value = valor;
}

function generarClaveAutomatica() {
    const cursoInput = document.getElementById('curso');
    const claveInput = document.getElementById('clave');
    if (!cursoInput || !claveInput) return;
    const curso = cursoInput.value.trim().toUpperCase();
    if (!curso) { claveInput.value = ''; return; }
    const palabras = curso.split(' ').filter(p => p.length > 0 && isNaN(p));
    let clave = '';
    if (palabras.length === 1) {
        clave = palabras[0].substring(0, 2);
    } else if (palabras.length >= 2) {
        clave = palabras[0].charAt(0) + palabras[1].charAt(0);
    }
    claveInput.value = clave;
}


function limpiarFormulario() {
    ['curso', 'cursoSiguiente', 'costo', 'clave', 'recargo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('iva').value = '0.16';
    cursoSeleccionado = null;
    modoNuevo = false;
    document.getElementById('btnBorrar').disabled = true;
}

function deshabilitarCampos() {
    ['curso', 'cursoSiguiente', 'costo', 'recargo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });
}

function habilitarCamposFormulario() {
    ['curso', 'cursoSiguiente', 'costo', 'recargo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
    });
}

function cargarDatosCurso(curso) {
    cursoSeleccionado = curso;
    modoNuevo = false;
    document.getElementById('curso').value = curso.curso || '';
    document.getElementById('cursoSiguiente').value = curso.curso_siguiente || '';
    document.getElementById('costo').value = curso.precio_mensual ? curso.precio_mensual.toFixed(2) : '';
    document.getElementById('clave').value = curso.clave || '';
    document.getElementById('iva').value = '0.16';
    document.getElementById('recargo').value = curso.precio_inscripcion ? curso.precio_inscripcion.toFixed(2) : '';
    deshabilitarCampos();
    document.getElementById('btnBorrar').disabled = false;
}

function nuevoCurso() {
    limpiarFormulario();
    modoNuevo = true;
    habilitarCamposFormulario();
    document.getElementById('curso').focus();
    const btnNuevo = document.getElementById('btnNuevo');
    btnNuevo.textContent = 'Guardar';
    btnNuevo.onclick = guardarNuevoCurso;
    document.getElementById('btnCancelarNuevo').style.display = 'inline-block';
    document.getElementById('btnBorrar').disabled = true;
    document.getElementById('btnBuscar').disabled = true;
    document.getElementById('btnReporte').disabled = true;
}

function cancelarNuevo() {
    const btnNuevo = document.getElementById('btnNuevo');
    btnNuevo.textContent = 'Nuevo';
    btnNuevo.onclick = nuevoCurso;
    document.getElementById('btnCancelarNuevo').style.display = 'none';
    limpiarFormulario();
    deshabilitarCampos();
    document.getElementById('btnBuscar').disabled = false;
    document.getElementById('btnReporte').disabled = false;
    modoNuevo = false;
}

async function guardarNuevoCurso() {
    if (!db) { await mostrarAlerta('Error: Base de datos no conectada'); return; }
    const curso = document.getElementById('curso').value.trim();
    const costo = document.getElementById('costo').value.trim();
    const clave = document.getElementById('clave').value.trim();
    const errores = [];
    if (!curso) errores.push('- Curso');
    if (!costo) errores.push('- Costo');
    if (!clave) errores.push('- Clave');
    if (errores.length > 0) {
        await mostrarAlerta('Complete los campos obligatorios:\n\n' + errores.join('\n'));
        return;
    }
    const datos = {
        curso: curso.toUpperCase(),
        curso_siguiente: document.getElementById('cursoSiguiente').value.trim().toUpperCase() || null,
        precio_mensual: parseFloat(costo) || 0,
        clave: clave.toUpperCase(),
        iva: 0.16,
        precio_inscripcion: parseFloat(document.getElementById('recargo').value) || 0
    };
    try {
        const { error } = await db.from('cursos').insert([datos]);
        if (error) throw error;
        await mostrarAlerta(`Curso guardado\n\nCurso: ${datos.curso}\nClave: ${datos.clave}`);
        await cargarCursos();
        cancelarNuevo();
    } catch (error) {
        await mostrarAlerta('Error al guardar: ' + error.message);
    }
}


function buscarCurso() {
    if (modoNuevo) cancelarNuevo();
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('modalBusqueda').style.display = 'block';
    document.getElementById('inputBusqueda').focus();
}

function cerrarModalBusqueda() {
    document.getElementById('modalBusqueda').style.display = 'none';
}

function cerrarModalResultados() {
    document.getElementById('modalResultados').style.display = 'none';
}

async function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    if (!termino) {
        await mostrarAlerta('Ingrese un nombre de curso o clave para buscar');
        return;
    }
    const resultados = cursos.filter(c => 
        (c.curso && c.curso.toUpperCase().includes(termino)) ||
        (c.clave && c.clave.toUpperCase().includes(termino))
    );
    cerrarModalBusqueda();
    if (resultados.length === 0) {
        await mostrarAlerta('No se encontraron cursos con ese criterio');
    } else if (resultados.length === 1) {
        cargarDatosCurso(resultados[0]);
    } else {
        mostrarResultadosBusqueda(resultados, termino);
    }
}

function mostrarResultadosBusqueda(resultados, termino) {
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    document.getElementById('tituloResultados').textContent = `Resultados de Búsqueda ('${termino}')`;
    resultados.forEach(curso => {
        const tr = document.createElement('tr');
        tr.onclick = () => {
            tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
            tr.classList.add('selected');
        };
        tr.ondblclick = () => {
            cargarDatosCurso(curso);
            cerrarModalResultados();
        };
        tr.innerHTML = `<td>${curso.curso || ''}</td><td>${curso.clave || ''}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('modalResultados').style.display = 'block';
}

async function borrarCurso() {
    if (!cursoSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un curso para borrar');
        return;
    }
    document.getElementById('mensajeBorrar').textContent = 
        `¿Está seguro de que desea borrar el curso "${cursoSeleccionado.curso}"?`;
    document.getElementById('razonBorrado').value = '';
    document.getElementById('modalBorrar').style.display = 'block';
    document.getElementById('razonBorrado').focus();
}

function cancelarBorrado() {
    document.getElementById('modalBorrar').style.display = 'none';
}

async function confirmarBorrado() {
    const razon = document.getElementById('razonBorrado').value.trim();
    if (!razon) {
        await mostrarAlerta('Debe proporcionar una razón para el borrado');
        return;
    }
    if (!db || !cursoSeleccionado) {
        await mostrarAlerta('Error: No hay curso seleccionado');
        return;
    }
    try {
        const { error } = await db.from('cursos').delete().eq('id', cursoSeleccionado.id);
        if (error) throw error;
        await mostrarAlerta('Curso eliminado correctamente');
        document.getElementById('modalBorrar').style.display = 'none';
        await cargarCursos();
        limpiarFormulario();
        deshabilitarCampos();
    } catch (error) {
        await mostrarAlerta('Error al eliminar: ' + error.message);
    }
}

function generarReporte() {
    window.location.href = 'reportes-cursos.html';
}

function terminar() {
    window.location.href = 'archivos.html';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('modalBusqueda').style.display === 'block') {
        aceptarBusqueda();
    }
    if (e.key === 'Escape') {
        cerrarModalBusqueda();
        cerrarModalResultados();
        cancelarBorrado();
    }
});
