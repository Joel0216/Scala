// Módulo de Bajas de Alumnos
var db = null;
var alumnoSeleccionado = null;

document.addEventListener('DOMContentLoaded', async function() {
    await new Promise(function(r) { setTimeout(r, 500); });
    
    db = window.supabaseClient || window.supabase;
    if (!db && typeof getSupabase === 'function') {
        db = getSupabase();
    }
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

function actualizarFechaHora() {
    var ahora = new Date();
    var datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = ahora.toLocaleDateString('es-MX') + ' ' + ahora.toLocaleTimeString('es-MX');
    }
}

function buscarAlumnoBaja() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content">' +
        '<h2>Buscar Alumno Dado de Baja</h2>' +
        '<input type="text" id="inputBusqueda" style="width:100%;padding:10px;" placeholder="Credencial o nombre">' +
        '<div class="modal-buttons" style="margin-top:15px;">' +
        '<button class="btn" onclick="ejecutarBusquedaBaja()">Buscar</button>' +
        '<button class="btn" onclick="cerrarModal()">Cancelar</button>' +
        '</div></div>';
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').focus();
}

async function ejecutarBusquedaBaja() {
    var termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    if (!termino) {
        await mostrarAlerta('Ingrese un término');
        return;
    }
    
    cerrarModal();
    
    if (!db) {
        await mostrarAlerta('No hay conexión');
        return;
    }
    
    try {
        var result = await db.from('alumnos')
            .select('*')
            .eq('activo', false)
            .or('nombre.ilike.%' + termino + '%,credencial::text.ilike.%' + termino + '%')
            .order('nombre');
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            await mostrarAlerta('No se encontraron alumnos dados de baja');
            return;
        }
        
        if (result.data.length === 1) {
            mostrarAlumnoBaja(result.data[0]);
        } else {
            mostrarListaBajas(result.data);
        }
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function mostrarListaBajas(resultados) {
    var modal = document.createElement('div');
    modal.className = 'modal';
    
    var html = '<div class="modal-content" style="max-width:700px;">' +
        '<h2>Alumnos dados de baja (' + resultados.length + ')</h2>' +
        '<div style="max-height:400px;overflow-y:auto;">' +
        '<table style="width:100%;border-collapse:collapse;">' +
        '<thead><tr style="background:#333;color:#fff;">' +
        '<th style="padding:8px;">Cred.</th><th style="padding:8px;">Nombre</th><th style="padding:8px;">F. Baja</th>' +
        '</tr></thead><tbody>';
    
    window._bajas = resultados;
    
    for (var i = 0; i < resultados.length; i++) {
        var a = resultados[i];
        html += '<tr onclick="seleccionarBaja(' + i + ')" style="cursor:pointer;border-bottom:1px solid #ddd;">' +
            '<td style="padding:8px;">' + a.credencial + '</td>' +
            '<td style="padding:8px;">' + (a.nombre || '') + '</td>' +
            '<td style="padding:8px;">' + (a.fecha_baja || '') + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table></div>' +
        '<div class="modal-buttons"><button class="btn" onclick="cerrarModal()">Cerrar</button></div></div>';
    
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function seleccionarBaja(index) {
    cerrarModal();
    mostrarAlumnoBaja(window._bajas[index]);
}

function mostrarAlumnoBaja(alumno) {
    alumnoSeleccionado = alumno;
    
    document.getElementById('credencial').value = alumno.credencial || '';
    document.getElementById('digito').value = alumno.dig_ver || 0;
    document.getElementById('nombre').value = alumno.nombre || '';
    document.getElementById('celular').value = alumno.celular || '';
    document.getElementById('direccion1').value = alumno.direccion1 || '';
    document.getElementById('fechaBaja').value = alumno.fecha_baja || '';
    document.getElementById('grupo').value = alumno.grupo_clave || '';
    document.getElementById('grupoNombre').value = '';
    document.getElementById('motivoBaja').value = alumno.motivo_baja || '';
    document.getElementById('observaciones').value = alumno.observaciones_baja || '';
}

async function listarBajas() {
    if (!db) {
        await mostrarAlerta('No hay conexión');
        return;
    }
    
    try {
        var result = await db.from('alumnos').select('*').eq('activo', false).order('nombre');
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            await mostrarAlerta('No hay alumnos dados de baja');
            return;
        }
        
        mostrarListaBajas(result.data);
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

async function reingresarAlumno() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un alumno');
        return;
    }
    
    var confirma = await mostrarConfirm('¿Reingresar al alumno ' + alumnoSeleccionado.nombre + '?');
    if (!confirma) return;
    
    try {
        var result = await db.from('alumnos').update({
            activo: true,
            fecha_baja: null,
            reingreso: true
        }).eq('id', alumnoSeleccionado.id);
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta('Alumno reingresado correctamente');
        limpiarFormulario();
        alumnoSeleccionado = null;
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function limpiarFormulario() {
    var inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function cerrarModal() {
    var modales = document.querySelectorAll('.modal');
    for (var i = 0; i < modales.length; i++) {
        modales[i].remove();
    }
}
