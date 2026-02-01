// =====================================================
// LISTADO DE BAJAS - SCALA
// =====================================================

var db = null;
var bajasCache = [];
var motivosCache = [];

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Inicializando listado de bajas...');
    
    await new Promise(function(r) { setTimeout(r, 500); });
    
    db = window.supabaseClient || window.supabase;
    if (!db && typeof getSupabase === 'function') {
        db = getSupabase();
    }
    
    if (db) {
        await cargarMotivos();
        await cargarBajas();
    } else {
        document.getElementById('bodyBajas').innerHTML = 
            '<tr><td colspan="5" style="text-align:center;color:red;">Error: No hay conexión a la base de datos</td></tr>';
    }
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

function actualizarFechaHora() {
    var ahora = new Date();
    var datetime = document.getElementById('datetime');
    if (datetime) {
        var dia = String(ahora.getDate()).padStart(2, '0');
        var mes = String(ahora.getMonth() + 1).padStart(2, '0');
        var anio = ahora.getFullYear();
        datetime.textContent = dia + '/' + mes + '/' + anio;
    }
}

async function cargarMotivos() {
    try {
        var result = await db.from('motivos_baja').select('*').order('clave');
        if (result.error) {
            motivosCache = [
                { clave: 'CAC', descripcion: 'CAMBIO DE CIUDAD' },
                { clave: 'ECO', descripcion: 'PROBLEMAS ECONOMICOS' },
                { clave: 'SAL', descripcion: 'PROBLEMAS DE SALUD' },
                { clave: 'TRA', descripcion: 'PROBLEMAS DE TRABAJO' }
            ];
        } else {
            motivosCache = result.data || [];
        }
        
        // Llenar select de filtro
        var select = document.getElementById('filtroMotivo');
        if (select) {
            for (var i = 0; i < motivosCache.length; i++) {
                var m = motivosCache[i];
                var opt = document.createElement('option');
                opt.value = m.clave;
                opt.textContent = m.clave + ' - ' + m.descripcion;
                select.appendChild(opt);
            }
        }
    } catch (e) {
        console.error('Error cargando motivos:', e);
    }
}

async function cargarBajas() {
    var tbody = document.getElementById('bodyBajas');
    
    try {
        var result = await db.from('alumnos')
            .select('*')
            .eq('activo', false)
            .order('fecha_baja', { ascending: false });
        
        if (result.error) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;">Error: ' + result.error.message + '</td></tr>';
            return;
        }
        
        bajasCache = result.data || [];
        mostrarBajas(bajasCache);
        
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;">Error: ' + e.message + '</td></tr>';
    }
}

function mostrarBajas(bajas) {
    var tbody = document.getElementById('bodyBajas');
    tbody.innerHTML = '';
    
    if (!bajas || bajas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay alumnos dados de baja</td></tr>';
        document.getElementById('totalRegistros').textContent = '0 registros';
        return;
    }
    
    for (var i = 0; i < bajas.length; i++) {
        var alumno = bajas[i];
        var tr = document.createElement('tr');
        tr.innerHTML = 
            '<td>' + alumno.credencial + '</td>' +
            '<td>' + (alumno.nombre || '') + '</td>' +
            '<td>' + formatearFecha(alumno.fecha_ingreso) + '</td>' +
            '<td>' + formatearFecha(alumno.fecha_baja) + '</td>' +
            '<td>' + obtenerDescripcionMotivo(alumno.motivo_baja) + '</td>';
        tbody.appendChild(tr);
    }
    
    document.getElementById('totalRegistros').textContent = bajas.length + ' registro(s)';
}

function filtrarPorMotivo() {
    var motivo = document.getElementById('filtroMotivo').value;
    
    if (!motivo) {
        mostrarBajas(bajasCache);
    } else {
        var filtrados = bajasCache.filter(function(a) {
            return a.motivo_baja === motivo;
        });
        mostrarBajas(filtrados);
    }
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    var d = new Date(fecha);
    var dia = String(d.getDate()).padStart(2, '0');
    var mes = String(d.getMonth() + 1).padStart(2, '0');
    var anio = d.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

function obtenerDescripcionMotivo(clave) {
    if (!clave) return '';
    for (var i = 0; i < motivosCache.length; i++) {
        if (motivosCache[i].clave === clave) {
            return clave + ' - ' + motivosCache[i].descripcion;
        }
    }
    return clave;
}
