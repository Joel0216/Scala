// =====================================================
// MÓDULO DE ALUMNOS - SCALA
// =====================================================

var db = null;
var alumnosCache = [];
var gruposCache = [];
var salonesCache = [];
var motivosCache = [];
var alumnoSeleccionado = null;
var alumnoEditando = null;

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Inicializando módulo de alumnos...');
    
    await new Promise(function(r) { setTimeout(r, 500); });
    
    db = window.supabaseClient || window.supabase;
    if (!db && typeof getSupabase === 'function') {
        db = getSupabase();
    }
    
    if (db) {
        console.log('Supabase conectado');
        await cargarGrupos();
        await cargarInstrumentos();
        await cargarMedios();
        await cargarSalones();
        await cargarMotivos();
    } else {
        console.error('Supabase NO disponible');
    }
    
    if (typeof habilitarInputs === 'function') {
        habilitarInputs();
    }
});

// =====================================================
// FUNCIONES DE CARGA DE DATOS
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
        
        // Llenar selects de grupo
        var selectGrupo = document.getElementById('grupo');
        var selectNuevoGrupo = document.getElementById('selectNuevoGrupo');
        
        if (selectGrupo) {
            selectGrupo.innerHTML = '<option value="">-- Seleccione Grupo --</option>';
            for (var i = 0; i < gruposCache.length; i++) {
                var g = gruposCache[i];
                var opt = document.createElement('option');
                opt.value = g.clave;
                opt.textContent = g.clave + ' - ' + (g.cursos ? g.cursos.curso : '');
                selectGrupo.appendChild(opt);
            }
        }
        
        if (selectNuevoGrupo) {
            selectNuevoGrupo.innerHTML = '<option value="">-- Seleccione nuevo grupo --</option>';
            for (var j = 0; j < gruposCache.length; j++) {
                var gr = gruposCache[j];
                var opt2 = document.createElement('option');
                opt2.value = gr.clave;
                opt2.textContent = gr.clave + ' - ' + (gr.cursos ? gr.cursos.curso : '');
                selectNuevoGrupo.appendChild(opt2);
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

async function cargarInstrumentos() {
    if (!db) return;
    var select = document.getElementById('instrumento');
    if (!select) return;
    
    try {
        var result = await db.from('instrumentos').select('id, clave, descripcion').eq('activo', true).order('clave');
        if (result.error) return;
        
        select.innerHTML = '<option value="">-- Seleccione --</option>';
        for (var i = 0; i < result.data.length; i++) {
            var inst = result.data[i];
            var opt = document.createElement('option');
            opt.value = inst.clave;
            opt.textContent = inst.clave + ' - ' + inst.descripcion;
            select.appendChild(opt);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

async function cargarMedios() {
    if (!db) return;
    var select = document.getElementById('medio');
    if (!select) return;
    
    try {
        var result = await db.from('medios_contacto').select('id, clave, descripcion').eq('activo', true).order('clave');
        if (result.error) return;
        
        select.innerHTML = '<option value="">-- Seleccione --</option>';
        for (var i = 0; i < result.data.length; i++) {
            var m = result.data[i];
            var opt = document.createElement('option');
            opt.value = m.clave;
            opt.textContent = m.clave + ' - ' + m.descripcion;
            select.appendChild(opt);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

async function cargarSalones() {
    if (!db) return;
    
    try {
        var result = await db.from('salones').select('*').order('numero');
        if (result.error) {
            console.error('Error cargando salones:', result.error);
            // Usar datos de ejemplo si no hay tabla
            salonesCache = [
                { numero: '1', ubicacion: 'Planta Baja' },
                { numero: '2', ubicacion: 'Planta Baja' },
                { numero: '3', ubicacion: 'Primer Piso' },
                { numero: '4', ubicacion: 'Primer Piso' },
                { numero: '5', ubicacion: 'Segundo Piso' }
            ];
            return;
        }
        salonesCache = result.data || [];
        console.log(salonesCache.length + ' salones cargados');
    } catch (e) {
        console.error('Error:', e);
        // Datos de ejemplo
        salonesCache = [
            { numero: '1', ubicacion: 'Planta Baja' },
            { numero: '2', ubicacion: 'Planta Baja' },
            { numero: '3', ubicacion: 'Primer Piso' }
        ];
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
        } else {
            motivosCache = result.data || [];
        }
        console.log(motivosCache.length + ' motivos cargados');
        
        // Llenar select de motivos
        var selectMotivo = document.getElementById('selectMotivoBaja');
        if (selectMotivo) {
            selectMotivo.innerHTML = '<option value="">-- Seleccione el motivo --</option>';
            for (var i = 0; i < motivosCache.length; i++) {
                var m = motivosCache[i];
                var opt = document.createElement('option');
                opt.value = m.clave;
                opt.textContent = m.clave + ' - ' + m.descripcion;
                selectMotivo.appendChild(opt);
            }
        }
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

// =====================================================
// SELECTOR DE SALÓN
// =====================================================
function abrirSelectorSalon() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalSalon';
    
    var html = '<div class="modal-content" style="max-width:500px;">' +
        '<h2>Seleccionar Salón</h2>' +
        '<div style="max-height:350px;overflow-y:auto;">' +
        '<table style="width:100%;border-collapse:collapse;">' +
        '<thead><tr style="background:#008B8B;color:#fff;">' +
        '<th style="padding:10px;">Salón</th>' +
        '<th style="padding:10px;">Ubicación</th>' +
        '</tr></thead><tbody>';
    
    for (var i = 0; i < salonesCache.length; i++) {
        var s = salonesCache[i];
        html += '<tr onclick="seleccionarSalon(\'' + s.numero + '\', \'' + (s.ubicacion || '') + '\')" ' +
            'style="cursor:pointer;border-bottom:1px solid #ddd;" ' +
            'onmouseover="this.style.background=\'#e0f7fa\'" onmouseout="this.style.background=\'#fff\'">' +
            '<td style="padding:10px;text-align:center;font-weight:bold;">' + s.numero + '</td>' +
            '<td style="padding:10px;">' + (s.ubicacion || '') + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table></div>' +
        '<div class="modal-buttons" style="margin-top:15px;">' +
        '<button class="btn" onclick="cerrarModal()">Cancelar</button>' +
        '</div></div>';
    
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function seleccionarSalon(numero, ubicacion) {
    var salonInput = document.getElementById('salon');
    var ubicacionInput = document.getElementById('salonUbicacion');
    
    if (salonInput) salonInput.value = numero;
    if (ubicacionInput) ubicacionInput.value = ubicacion;
    
    cerrarModal();
}

// =====================================================
// VALIDACIONES
// =====================================================
function soloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function validarPorcentaje(input) {
    var valor = input.value.replace(/[^0-9.]/g, '');
    var partes = valor.split('.');
    
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes.slice(1).join('');
    }
    
    if (partes[1] && partes[1].length > 2) {
        valor = partes[0] + '.' + partes[1].substring(0, 2);
    }
    
    var num = parseFloat(valor);
    if (num > 100) {
        valor = '100';
    }
    
    input.value = valor;
}

function togglePorcentaje() {
    var beca = document.getElementById('beca');
    var porcentaje = document.getElementById('porcentaje');
    if (beca && porcentaje) {
        porcentaje.disabled = !beca.checked;
        if (!beca.checked) {
            porcentaje.value = '0.00%';
        }
    }
}

function calcularEdad() {
    var fechaNac = document.getElementById('fechaNacimiento');
    var edadInput = document.getElementById('edad');
    if (fechaNac && fechaNac.value && edadInput) {
        var hoy = new Date();
        var nacimiento = new Date(fechaNac.value);
        var edad = hoy.getFullYear() - nacimiento.getFullYear();
        var m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        edadInput.value = edad;
    }
}

// =====================================================
// BÚSQUEDA DE ALUMNOS (ESTILO WINDOWS)
// =====================================================
function buscarAlumno() {
    document.getElementById('inputBusquedaAlumno').value = '';
    document.getElementById('modalBusquedaAlumno').style.display = 'block';
    document.getElementById('inputBusquedaAlumno').focus();
    
    // Agregar evento Enter
    document.getElementById('inputBusquedaAlumno').onkeypress = function(e) {
        if (e.key === 'Enter') ejecutarBusquedaAlumno();
    };
}

function cerrarModalBusquedaAlumno() {
    document.getElementById('modalBusquedaAlumno').style.display = 'none';
}

function cerrarModalResultadosAlumno() {
    document.getElementById('modalResultadosAlumno').style.display = 'none';
}

async function ejecutarBusquedaAlumno() {
    var termino = document.getElementById('inputBusquedaAlumno').value.trim().toUpperCase();
    
    if (!termino) {
        await mostrarAlerta('Ingrese un nombre o credencial para buscar');
        return;
    }
    
    cerrarModalBusquedaAlumno();
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var result = await db.from('alumnos')
            .select('*')
            .eq('activo', true)
            .or('nombre.ilike.%' + termino + '%,credencial::text.ilike.%' + termino + '%')
            .order('nombre')
            .limit(50);
        
        if (result.error) {
            await mostrarAlerta('Error en búsqueda: ' + result.error.message);
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            await mostrarAlerta('No se encontraron alumnos con ese criterio');
            return;
        }
        
        if (result.data.length === 1) {
            mostrarAlumno(result.data[0]);
        } else {
            mostrarResultadosAlumnoWindows(result.data, termino);
        }
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function mostrarResultadosAlumnoWindows(resultados, termino) {
    var tbody = document.getElementById('bodyResultadosAlumno');
    tbody.innerHTML = '';
    
    document.getElementById('tituloResultadosAlumno').textContent = "Resultados de Búsqueda ('" + termino + "')";
    
    window._resultadosBusquedaAlumno = resultados;
    
    for (var i = 0; i < resultados.length; i++) {
        var alumno = resultados[i];
        var tr = document.createElement('tr');
        tr.setAttribute('data-index', i);
        tr.onclick = function() {
            // Quitar selección anterior
            var rows = tbody.querySelectorAll('tr');
            for (var j = 0; j < rows.length; j++) {
                rows[j].classList.remove('selected');
            }
            this.classList.add('selected');
        };
        tr.ondblclick = function() {
            var idx = parseInt(this.getAttribute('data-index'));
            var alumnoSel = window._resultadosBusquedaAlumno[idx];
            cerrarModalResultadosAlumno();
            mostrarAlumno(alumnoSel);
        };
        tr.innerHTML = '<td>' + (alumno.nombre || '') + '</td><td>' + alumno.credencial + '</td>';
        tbody.appendChild(tr);
    }
    
    document.getElementById('modalResultadosAlumno').style.display = 'block';
}

function mostrarAlumno(alumno) {
    alumnoSeleccionado = alumno;
    
    setVal('credencial', alumno.credencial);
    setVal('digito', alumno.dig_ver || 0);
    setVal('nombre', alumno.nombre);
    setVal('direccion1', alumno.direccion1);
    setVal('direccion2', alumno.direccion2);
    setVal('celular', alumno.celular);
    setVal('telefono', alumno.telefono);
    setVal('email', alumno.email);
    setVal('fechaNacimiento', formatearFecha(alumno.fecha_nacimiento));
    setVal('fechaIngreso', formatearFecha(alumno.fecha_ingreso));
    setVal('edad', alumno.edad);
    setVal('nombrePadre', alumno.nombre_padre);
    setVal('celularPadre', alumno.telefono_padre);
    setVal('nombreMadre', alumno.nombre_madre);
    setVal('celularMadre', alumno.telefono_madre);
    setVal('grupoClave', alumno.grupo_clave);
    setVal('grupoNombre', obtenerNombreGrupo(alumno.grupo_clave));
    setVal('salon', alumno.salon);
    setVal('salonUbicacion', obtenerUbicacionSalon(alumno.salon));
    setVal('grado', alumno.grado);
    setVal('porcentaje', (alumno.porcentaje_beca || 0).toFixed(2) + '%');
    setVal('comentario', alumno.comentario);
    setVal('instrumento', alumno.instrumento_clave);
    setVal('medio', alumno.medio_clave);
    
    setCheck('beca', alumno.beca);
    setCheck('reingreso', alumno.reingreso);
    
    console.log('Alumno mostrado:', alumno.nombre);
}

function obtenerUbicacionSalon(numero) {
    if (!numero) return '';
    for (var i = 0; i < salonesCache.length; i++) {
        if (salonesCache[i].numero == numero) {
            return salonesCache[i].ubicacion || '';
        }
    }
    return '';
}

function setVal(id, valor) {
    var el = document.getElementById(id);
    if (el) el.value = valor || '';
}

function setCheck(id, valor) {
    var el = document.getElementById(id);
    if (el) el.checked = valor || false;
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    var d = new Date(fecha);
    var dia = String(d.getDate()).padStart(2, '0');
    var mes = String(d.getMonth() + 1).padStart(2, '0');
    var anio = d.getFullYear();
    return dia + '/' + mes + '/' + anio;
}

function obtenerNombreGrupo(clave) {
    for (var i = 0; i < gruposCache.length; i++) {
        if (gruposCache[i].clave === clave) {
            return gruposCache[i].cursos ? gruposCache[i].cursos.curso : '';
        }
    }
    return '';
}

function cerrarModal() {
    var modales = document.querySelectorAll('.modal');
    for (var i = 0; i < modales.length; i++) {
        modales[i].remove();
    }
    if (typeof habilitarInputs === 'function') habilitarInputs();
}

// =====================================================
// LISTA DE ALUMNOS
// =====================================================
function listaAlumnos() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalLista';
    modal.innerHTML = '<div class="modal-content" style="max-width:900px;">' +
        '<h2>Lista de Alumnos</h2>' +
        '<div id="contenedorLista" style="max-height:500px;overflow-y:auto;"><p>Cargando...</p></div>' +
        '<div class="modal-buttons" style="margin-top:15px;">' +
        '<button class="btn" onclick="cerrarModal()">Cerrar</button>' +
        '</div></div>';
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    cargarListaCompleta();
}

async function cargarListaCompleta() {
    var contenedor = document.getElementById('contenedorLista');
    
    if (!db) {
        contenedor.innerHTML = '<p>No hay conexión a la base de datos</p>';
        return;
    }
    
    try {
        var result = await db.from('alumnos').select('*').eq('activo', true).order('nombre');
        
        if (result.error) {
            contenedor.innerHTML = '<p>Error: ' + result.error.message + '</p>';
            return;
        }
        
        if (!result.data || result.data.length === 0) {
            contenedor.innerHTML = '<p>No hay alumnos registrados</p>';
            return;
        }
        
        window._listaAlumnos = result.data;
        
        var html = '<table style="width:100%;border-collapse:collapse;">' +
            '<thead><tr style="background:#333;color:#fff;position:sticky;top:0;">' +
            '<th style="padding:8px;">Cred.</th>' +
            '<th style="padding:8px;">Nombre</th>' +
            '<th style="padding:8px;">Grupo</th>' +
            '<th style="padding:8px;">Celular</th>' +
            '</tr></thead><tbody>';
        
        for (var i = 0; i < result.data.length; i++) {
            var a = result.data[i];
            html += '<tr onclick="seleccionarDeLista(' + i + ')" style="cursor:pointer;border-bottom:1px solid #ddd;">' +
                '<td style="padding:6px;">' + a.credencial + '</td>' +
                '<td style="padding:6px;">' + (a.nombre || '') + '</td>' +
                '<td style="padding:6px;">' + (a.grupo_clave || '') + '</td>' +
                '<td style="padding:6px;">' + (a.celular || '') + '</td>' +
                '</tr>';
        }
        
        html += '</tbody></table>';
        contenedor.innerHTML = html;
        
    } catch (e) {
        contenedor.innerHTML = '<p>Error: ' + e.message + '</p>';
    }
}

function seleccionarDeLista(index) {
    var alumno = window._listaAlumnos[index];
    cerrarModal();
    mostrarAlumno(alumno);
}

// =====================================================
// ALTA DE ALUMNOS
// =====================================================
async function guardarAlta() {
    var nombre = document.getElementById('nombre');
    if (!nombre || !nombre.value.trim()) {
        await mostrarAlerta('El nombre es obligatorio');
        return;
    }
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    // Obtener siguiente credencial
    var maxResult = await db.from('alumnos').select('credencial').order('credencial', { ascending: false }).limit(1);
    var nuevaCredencial = 3779;
    if (maxResult.data && maxResult.data.length > 0) {
        nuevaCredencial = maxResult.data[0].credencial + 1;
    }
    
    var porcentajeVal = document.getElementById('porcentaje') ? document.getElementById('porcentaje').value.replace('%', '') : '0';
    
    var datos = {
        credencial: nuevaCredencial,
        dig_ver: 0,
        nombre: nombre.value.trim().toUpperCase(),
        direccion1: getVal('direccion1'),
        direccion2: getVal('direccion2'),
        celular: getVal('celular'),
        telefono: getVal('telefono'),
        email: getVal('email'),
        fecha_nacimiento: getVal('fechaNacimiento') || null,
        edad: parseInt(getVal('edad')) || null,
        fecha_ingreso: getVal('fechaIngreso') || new Date().toISOString().split('T')[0],
        nombre_padre: getVal('nombrePadre'),
        telefono_padre: getVal('celularPadre'),
        nombre_madre: getVal('nombreMadre'),
        telefono_madre: getVal('celularMadre'),
        grupo_clave: getVal('grupo'),
        salon: getVal('salon'),
        grado: getVal('grado'),
        beca: document.getElementById('beca') ? document.getElementById('beca').checked : false,
        porcentaje_beca: parseFloat(porcentajeVal) || 0,
        comentario: getVal('comentario'),
        reingreso: document.getElementById('reingreso') ? document.getElementById('reingreso').checked : false,
        instrumento_clave: getVal('instrumento'),
        medio_clave: getVal('medio'),
        activo: true
    };
    
    try {
        var result = await db.from('alumnos').insert([datos]).select();
        
        if (result.error) {
            await mostrarAlerta('Error al guardar: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta('Alumno registrado con credencial: ' + nuevaCredencial);
        window.location.href = 'alumnos.html';
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

async function cancelarAlta() {
    var confirma = await mostrarConfirm('¿Cancelar el alta del alumno?');
    if (confirma) {
        window.location.href = 'alumnos.html';
    }
}

// =====================================================
// EDICIÓN DE ALUMNOS
// =====================================================
function irAEdicion() {
    if (!alumnoSeleccionado) {
        mostrarAlerta('Primero busque y seleccione un alumno');
        return;
    }
    sessionStorage.setItem('alumnoEditar', JSON.stringify(alumnoSeleccionado));
    window.location.href = 'alumnos-edicion.html';
}

function buscarParaEditar() {
    buscarAlumno();
}

async function guardarEdicion() {
    if (!alumnoEditando) {
        await mostrarAlerta('No hay alumno seleccionado para editar');
        return;
    }
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    var porcentajeVal = document.getElementById('porcentaje') ? document.getElementById('porcentaje').value.replace('%', '') : '0';
    
    var datos = {
        nombre: getVal('nombre').toUpperCase(),
        direccion1: getVal('direccion1'),
        direccion2: getVal('direccion2'),
        celular: getVal('celular'),
        telefono: getVal('telefono'),
        email: getVal('email'),
        fecha_nacimiento: getVal('fechaNacimiento') || null,
        nombre_padre: getVal('nombrePadre'),
        telefono_padre: getVal('celularPadre'),
        nombre_madre: getVal('nombreMadre'),
        telefono_madre: getVal('celularMadre'),
        grado: getVal('grado'),
        beca: document.getElementById('beca') ? document.getElementById('beca').checked : false,
        porcentaje_beca: parseFloat(porcentajeVal) || 0,
        comentario: getVal('comentario'),
        reingreso: document.getElementById('reingreso') ? document.getElementById('reingreso').checked : false,
        instrumento_clave: getVal('instrumento'),
        medio_clave: getVal('medio')
    };
    
    try {
        var result = await db.from('alumnos').update(datos).eq('id', alumnoEditando.id);
        
        if (result.error) {
            await mostrarAlerta('Error al guardar: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta('Datos actualizados correctamente');
        window.location.href = 'alumnos.html';
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

async function cancelarEdicion() {
    var confirma = await mostrarConfirm('¿Cancelar la edición?');
    if (confirma) {
        window.location.href = 'alumnos.html';
    }
}

// =====================================================
// BAJA DE ALUMNOS CON MOTIVO
// =====================================================
async function confirmarBaja() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un alumno');
        return;
    }
    
    // Mostrar información en el modal
    document.getElementById('bajaNombreAlumno').textContent = alumnoSeleccionado.nombre;
    document.getElementById('bajaCredencial').textContent = alumnoSeleccionado.credencial;
    document.getElementById('bajaGrupo').textContent = 
        alumnoSeleccionado.grupo_clave + ' - ' + obtenerNombreGrupo(alumnoSeleccionado.grupo_clave);
    
    document.getElementById('selectMotivoBaja').value = '';
    document.getElementById('descripcionBaja').value = '';
    
    document.getElementById('modalBaja').style.display = 'block';
}

function cerrarModalBaja() {
    document.getElementById('modalBaja').style.display = 'none';
}

async function ejecutarBaja() {
    var motivoClave = document.getElementById('selectMotivoBaja').value;
    
    if (!motivoClave) {
        await mostrarAlerta('Debe seleccionar un motivo para la baja');
        return;
    }
    
    var descripcion = document.getElementById('descripcionBaja').value.trim();
    
    var confirma = await mostrarConfirm(
        '¿Confirmar la BAJA del alumno ' + alumnoSeleccionado.nombre + '?\n\n' +
        'Esta acción moverá al alumno a la sección de Bajas.'
    );
    
    if (!confirma) return;
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var result = await db.from('alumnos').update({
            activo: false,
            fecha_baja: new Date().toISOString().split('T')[0],
            motivo_baja: motivoClave,
            observaciones_baja: descripcion || null
        }).eq('id', alumnoSeleccionado.id);
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta('Alumno dado de baja correctamente');
        cerrarModalBaja();
        limpiarFormulario();
        alumnoSeleccionado = null;
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

function limpiarFormulario() {
    var inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    var checks = document.querySelectorAll('input[type="checkbox"]');
    for (var j = 0; j < checks.length; j++) {
        checks[j].checked = false;
    }
}

// =====================================================
// CAMBIO DE GRUPO
// =====================================================
async function abrirCambioGrupo() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un alumno');
        return;
    }
    
    document.getElementById('cambioAlumnoNombre').textContent = alumnoSeleccionado.nombre;
    document.getElementById('cambioAlumnoCred').textContent = alumnoSeleccionado.credencial;
    document.getElementById('cambioGrupoActual').textContent = alumnoSeleccionado.grupo_clave || 'Sin grupo';
    
    document.getElementById('modalCambioGrupo').style.display = 'block';
}

function cerrarModalCambio() {
    document.getElementById('modalCambioGrupo').style.display = 'none';
}

async function guardarCambioGrupo() {
    var nuevoGrupo = document.getElementById('selectNuevoGrupo').value;
    
    if (!nuevoGrupo) {
        await mostrarAlerta('Seleccione un nuevo grupo');
        return;
    }
    
    if (!db) {
        await mostrarAlerta('No hay conexión a la base de datos');
        return;
    }
    
    try {
        var result = await db.from('alumnos').update({
            grupo_clave: nuevoGrupo
        }).eq('id', alumnoSeleccionado.id);
        
        if (result.error) {
            await mostrarAlerta('Error: ' + result.error.message);
            return;
        }
        
        await mostrarAlerta('Grupo cambiado correctamente');
        cerrarModalCambio();
        
        // Actualizar vista
        alumnoSeleccionado.grupo_clave = nuevoGrupo;
        setVal('grupoClave', nuevoGrupo);
        setVal('grupoNombre', obtenerNombreGrupo(nuevoGrupo));
        
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

// =====================================================
// CARGAR ALUMNO PARA EDICIÓN
// =====================================================
if (window.location.href.indexOf('alumnos-edicion') >= 0) {
    document.addEventListener('DOMContentLoaded', function() {
        var alumnoStr = sessionStorage.getItem('alumnoEditar');
        if (alumnoStr) {
            alumnoEditando = JSON.parse(alumnoStr);
            sessionStorage.removeItem('alumnoEditar');
            
            setTimeout(function() {
                setVal('credencial', alumnoEditando.credencial);
                setVal('digito', alumnoEditando.dig_ver || 0);
                setVal('nombre', alumnoEditando.nombre);
                setVal('direccion1', alumnoEditando.direccion1);
                setVal('direccion2', alumnoEditando.direccion2);
                setVal('celular', alumnoEditando.celular);
                setVal('telefono', alumnoEditando.telefono);
                setVal('email', alumnoEditando.email);
                setVal('fechaNacimiento', alumnoEditando.fecha_nacimiento);
                setVal('fechaIngreso', formatearFecha(alumnoEditando.fecha_ingreso));
                setVal('edad', alumnoEditando.edad);
                setVal('nombrePadre', alumnoEditando.nombre_padre);
                setVal('celularPadre', alumnoEditando.telefono_padre);
                setVal('nombreMadre', alumnoEditando.nombre_madre);
                setVal('celularMadre', alumnoEditando.telefono_madre);
                setVal('grupoClave', alumnoEditando.grupo_clave);
                setVal('grupoNombre', obtenerNombreGrupo(alumnoEditando.grupo_clave));
                setVal('salon', alumnoEditando.salon);
                setVal('grado', alumnoEditando.grado);
                setVal('porcentaje', (alumnoEditando.porcentaje_beca || 0).toFixed(2) + '%');
                setVal('comentario', alumnoEditando.comentario);
                
                var instSelect = document.getElementById('instrumento');
                if (instSelect) instSelect.value = alumnoEditando.instrumento_clave || '';
                
                var medioSelect = document.getElementById('medio');
                if (medioSelect) medioSelect.value = alumnoEditando.medio_clave || '';
                
                setCheck('beca', alumnoEditando.beca);
                setCheck('reingreso', alumnoEditando.reingreso);
                
                var info = document.getElementById('infoAlumno');
                var editandoNombre = document.getElementById('editandoNombre');
                if (info && editandoNombre) {
                    editandoNombre.textContent = alumnoEditando.nombre;
                    info.style.display = 'block';
                }
                
                calcularEdad();
            }, 600);
        }
    });
}
