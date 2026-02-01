// =====================================================
// MÓDULO DE BAJAS DE ALUMNOS - SCALA
// =====================================================

var db = null;
var alumnoSeleccionado = null;
var gruposCache = [];
var motivosCache = [];

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Inicializando módulo de bajas...');
    
    await new Promise(function(r) { setTimeout(r, 500); });
    
    db = window.supabaseClient || window.supabase;
    if (!db && typeof getSupabase === 'function') {
        db = getSupabase();
    }
    
    if (db) {
        console.log('Supabase conectado en bajas');
        await cargarGrupos();
        await cargarMotivos();
    } else {
        console.error('Supabase NO disponible');
    }
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Configurar Enter en búsqueda
    var inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') ejecutarBusquedaBaja();
        });
    }
    
    if (typeof habilitarInputs === 'function') habilitarInputs();
});

function actualizarFechaHora() {
    var ahora = new Date();
    var datetime = document.getElementById('datetime');
    if (datetime) {
        var dia = String(ahora.getDate()).padStart(2, '0');
        var mes = String(ahora.getMonth() + 1).padStart(2, '0');
        var anio = ahora.getFullYear();
        var horas = ahora.getHours();
        var minutos = String(ahora.getMinutes()).padStart(2, '0');
        var segundos = String(ahora.getSeconds()).padStart(2, '0');
        var ampm = horas >= 12 ? 'p. m.' : 'a. m.';
        horas = horas % 12 || 12;
        datetime.textContent = dia + '/' + mes + '/' + anio + ' ' + 
            String(horas).padStart(2, '0') + ':' + minutos + ':' + segundos + ' ' + ampm;
    }
}

// =====================================================
// CARGA DE DATOS
// =====================================================
async function cargarGrupos() {
    if (!db) return;
    
    try {
        var result = await db.from('grupos').select('id, clave, curso_id, cursos(curso)').order('clave');
        if (result.error) {
            console.error('Error cargando grupos:', result.error);
            return;
        }
        
        gruposCache = result.data || [];
        console.log(gruposCache.length + ' grupos cargados');
        
        // Llenar select de nuevo grupo para reingreso
        var selectNuevoGrupo = document.getElementById('selectNuevoGrupo');
        if (selectNuevoGrupo) {
            selectNuevoGrupo.innerHTML = '<option value="">-- Seleccione nuevo grupo --</option>';
            for (var i = 0; i < gruposCache.length; i++) {
                var g = gruposCache[i];
                var opt = document.createElement('option');
                opt.value = g.clave;
                opt.textContent = g.clave + ' - ' + (g.cursos ? g.cursos.curso : '');
                selectNuevoGrupo.appendChild(opt);
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

async function cargarMotivos() {
    if (!db) return;
    
    try {
        var result = await db.from('motivos_baja').select('*').order('clave');
        if (result.error) {
            console.error('Error cargando motivos:', result.error);
            // Usar datos por defecto
            motivosCache = [
                { clave: 'CAC', descripcion: 'CAMBIO DE CIUDAD' },
                { clave: 'ECO', descripcion: 'PROBLEMAS ECONOMICOS' },
                { clave: 'SAL', descripcion: 'PROBLEMAS DE SALUD' },
                { clave: 'TRA', descripcion: 'PROBLEMAS DE TRABAJO' },
                { clave: 'TIE', descripcion: 'FALTA DE TIEMPO' },
                { clave: 'INT', descripcion: 'PERDIDA DE INTERES' },
                { clave: 'OTR', descripcion: 'OTRO MOTIVO' }
            ];
            return;
        }
        motivosCache = result.data || [];
        console.log(motivosCache.length + ' motivos cargados');
    } catch (e) {
        console.error('Error:', e);
        motivosCache = [
            { clave: 'CAC', descripcion: 'CAMBIO DE CIUDAD' },
            { clave: 'ECO', descripcion: 'PROBLEMAS ECONOMICOS' },
            { clave: 'SAL', descripcion: 'PROBLEMAS DE SALUD' },
            { clave: 'TRA', descripcion: 'PROBLEMAS DE TRABAJO' }
        ];
    }
}

function obtenerNombreGrupo(clave) {
    for (var i = 0; i < gruposCache.length; i++) {
        if (gruposCache[i].clave === clave) {
            return gruposCache[i].cursos ? gruposCache[i].cursos.curso : '';
        }
    }
    return '';
}

function obtenerDescripcionMotivo(clave) {
    for (var i = 0; i < motivosCache.length; i++) {
        if (motivosCache[i].clave === clave) {
            return motivosCache[i].descripcion;
        }
    }
    return '';
}

// =====================================================
// BÚSQUEDA DE ALUMNOS DADOS DE BAJA
// =====================================================
function buscarAlumnoBaja() {
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('modalBusqueda').style.display = 'block';
    document.getElementById('inputBusqueda').focus();
}

function cerrarModalBusqueda() {
    document.getElementById('modalBusqueda').style.display = 'none';
}

async function ejecutarBusquedaBaja() {
    var termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        await mostrarAlerta('Ingrese un nombre o credencial para buscar');
        return;
    }
    
    cerrarModalBusqueda();
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var result = await db.from('alumnos')
            .select('*')
            .eq('activo', false)
            .or('nombre.ilike.%' + termino + '%,credencial::text.ilike.%' + termino + '%')
            .order('nombre')
            .limit(50);
        
        if (result.error) {
            await mostrarAlerta('Error en búsqueda: ' + result.error.message);
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            await mostrarAlerta('No se encontraron alumnos dados de baja con ese criterio');
            return;
        }
        
        if (result.data.length === 1) {
            mostrarAlumnoBaja(result.data[0]);
        } else {
            mostrarResultadosBusqueda(result.data, termino);
        }
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function mostrarResultadosBusqueda(resultados, termino) {
    var tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    document.getElementById('tituloResultados').textContent = 
        "Alumnos dados de Baja ('" + termino + "') - " + resultados.length + " encontrados";
    
    window._resultadosBajas = resultados;
    
    for (var i = 0; i < resultados.length; i++) {
        var alumno = resultados[i];
        var tr = document.createElement('tr');
        tr.setAttribute('data-index', i);
        tr.onclick = function() {
            var rows = tbody.querySelectorAll('tr');
            for (var j = 0; j < rows.length; j++) {
                rows[j].classList.remove('selected');
            }
            this.classList.add('selected');
        };
        tr.ondblclick = function() {
            var idx = parseInt(this.getAttribute('data-index'));
            var alumnoSel = window._resultadosBajas[idx];
            cerrarModalResultados();
            mostrarAlumnoBaja(alumnoSel);
        };
        
        tr.innerHTML = '<td>' + (alumno.nombre || '') + '</td>' +
            '<td>' + alumno.credencial + '</td>' +
            '<td>' + formatearFecha(alumno.fecha_ingreso) + '</td>' +
            '<td>' + formatearFecha(alumno.fecha_baja) + '</td>' +
            '<td>' + (alumno.motivo_baja || '') + '</td>';
        tbody.appendChild(tr);
    }
    
    document.getElementById('modalResultados').style.display = 'block';
}

function cerrarModalResultados() {
    document.getElementById('modalResultados').style.display = 'none';
}

// =====================================================
// MOSTRAR DATOS DEL ALUMNO DADO DE BAJA
// =====================================================
function mostrarAlumnoBaja(alumno) {
    alumnoSeleccionado = alumno;
    
    setVal('credencial', alumno.credencial);
    setVal('digito', alumno.dig_ver || 0);
    setVal('nombre', alumno.nombre);
    setVal('direccion1', alumno.direccion1);
    setVal('email', alumno.email);
    setVal('telefono', alumno.telefono);
    setVal('nombrePadre', alumno.nombre_padre || alumno.nombre_madre);
    setVal('celularPadre', alumno.telefono_padre || alumno.telefono_madre);
    setVal('fechaIngreso', formatearFecha(alumno.fecha_ingreso));
    setVal('edad', alumno.edad);
    setVal('grupoClave', alumno.grupo_clave);
    setVal('grupoNombre', obtenerNombreGrupo(alumno.grupo_clave));
    setVal('grado', alumno.grado);
    setVal('porcentaje', (alumno.porcentaje_beca || 0).toFixed(2) + '%');
    setVal('comentario', alumno.comentario);
    setVal('instrumento', alumno.instrumento_clave);
    setVal('medio', alumno.medio_clave);
    setVal('motivoClave', alumno.motivo_baja);
    setVal('motivoDescripcion', obtenerDescripcionMotivo(alumno.motivo_baja));
    setVal('fechaBaja', formatearFecha(alumno.fecha_baja));
    
    var becaCheck = document.getElementById('beca');
    if (becaCheck) becaCheck.checked = alumno.beca || false;
    
    console.log('Alumno dado de baja mostrado:', alumno.nombre);
}

function setVal(id, valor) {
    var el = document.getElementById(id);
    if (el) el.value = valor || '';
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    var d = new Date(fecha);
    var dia = String(d.getDate()).padStart(2, '0');
    var mes = String(d.getMonth() + 1).padStart(2, '0');
    var anio = d.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

// =====================================================
// LISTADO DE BAJAS
// =====================================================
async function listarBajas() {
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var result = await db.from('alumnos')
            .select('*')
            .eq('activo', false)
            .order('fecha_baja', { ascending: false });
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            await mostrarAlerta('No hay alumnos dados de baja');
            return;
        }
        
        mostrarResultadosBusqueda(result.data, 'TODOS');
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

// =====================================================
// REINGRESO DE ALUMNOS
// =====================================================
async function reingresarAlumno() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un alumno dado de baja');
        return;
    }
    
    // Mostrar información en el modal
    document.getElementById('reingresoNombre').textContent = alumnoSeleccionado.nombre;
    document.getElementById('reingresoCredencial').textContent = alumnoSeleccionado.credencial;
    document.getElementById('reingresoUltimoGrupo').textContent = 
        alumnoSeleccionado.grupo_clave + ' - ' + obtenerNombreGrupo(alumnoSeleccionado.grupo_clave);
    
    document.getElementById('selectNuevoGrupo').value = '';
    document.getElementById('observacionesReingreso').value = '';
    
    document.getElementById('modalReingreso').style.display = 'block';
}

function cerrarModalReingreso() {
    document.getElementById('modalReingreso').style.display = 'none';
}

async function confirmarReingreso() {
    var nuevoGrupo = document.getElementById('selectNuevoGrupo').value;
    
    if (!nuevoGrupo) {
        await mostrarAlerta('Debe seleccionar un nuevo grupo para el reingreso');
        return;
    }
    
    var confirma = await mostrarConfirm(
        '¿Confirmar reingreso del alumno ' + alumnoSeleccionado.nombre + 
        ' al grupo ' + nuevoGrupo + '?'
    );
    
    if (!confirma) return;
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var observaciones = document.getElementById('observacionesReingreso').value.trim();
        var fechaHoy = new Date().toISOString().split('T')[0];
        
        var result = await db.from('alumnos').update({
            activo: true,
            reingreso: true,
            grupo_clave: nuevoGrupo,
            fecha_baja: null,
            motivo_baja: null,
            observaciones_baja: null,
            fecha_reingreso: fechaHoy,
            observaciones_reingreso: observaciones || null
        }).eq('id', alumnoSeleccionado.id);
        
        if (result.error) {
            await mostrarAlerta('Error al reingresar: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta(
            'Alumno reingresado correctamente\n\n' +
            'Nombre: ' + alumnoSeleccionado.nombre + '\n' +
            'Credencial: ' + alumnoSeleccionado.credencial + '\n' +
            'Nuevo Grupo: ' + nuevoGrupo
        );
        cerrarModalReingreso();
        limpiarFormulario();
        alumnoSeleccionado = null;
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

// =====================================================
// UTILIDADES
// =====================================================
function limpiarFormulario() {
    var inputs = document.querySelectorAll('input[type="text"]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    var becaCheck = document.getElementById('beca');
    if (becaCheck) becaCheck.checked = false;
}

// Cerrar modales con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalBusqueda();
        cerrarModalResultados();
        cerrarModalReingreso();
    }
});

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal-windows') || 
        event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
