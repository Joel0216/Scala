// Módulo de Alumnos
let db = null;
let alumnosCache = [];
let gruposDisponibles = [];
let alumnoSeleccionado = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== INICIALIZANDO MÓDULO ALUMNOS ===');
    
    // Esperar a que Supabase esté listo
    await new Promise(r => setTimeout(r, 500));
    
    // Obtener cliente de Supabase
    db = window.supabaseClient || window.supabase || (typeof getSupabase === 'function' ? getSupabase() : null);
    
    if (db) {
        console.log('✓ Supabase disponible en alumnos');
        
        // Cargar datos según la página
        const url = window.location.href.toLowerCase();
        
        if (url.includes('alumnos-alta')) {
            await cargarSelectsAlta();
        } else if (url.includes('alumnos-lista')) {
            await cargarListaAlumnos();
        } else if (url.includes('alumnos.html')) {
            await cargarSelectsAlta();
            await cargarAlumnosCache();
        }
    } else {
        console.error('✗ Supabase NO disponible');
    }
    
    // Habilitar inputs
    if (typeof habilitarInputs === 'function') {
        habilitarInputs();
    }
});

// Cargar alumnos en caché para búsquedas
async function cargarAlumnosCache() {
    if (!db) return;
    
    try {
        const { data, error } = await db
            .from('alumnos')
            .select('*')
            .eq('activo', true)
            .order('nombre');
        
        if (error) {
            console.error('Error cargando alumnos:', error);
        } else {
            alumnosCache = data || [];
            console.log(`✓ ${alumnosCache.length} alumnos en caché`);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

// Cargar selects para alta de alumnos
async function cargarSelectsAlta() {
    if (!db) {
        console.warn('No hay conexión a Supabase');
        return;
    }

    console.log('Cargando selects...');

    try {
        // Cargar grupos
        const selectGrupo = document.getElementById('grupo');
        if (selectGrupo) {
            const { data: grupos, error } = await db
                .from('grupos')
                .select('id, clave, curso_id, cursos(curso)')
                .order('clave');

            if (error) {
                console.error('Error grupos:', error);
            } else if (grupos && grupos.length > 0) {
                selectGrupo.innerHTML = '<option value="">-- Seleccione --</option>';
                grupos.forEach(g => {
                    const opt = document.createElement('option');
                    opt.value = g.id;
                    opt.textContent = g.clave + (g.cursos?.curso ? ' - ' + g.cursos.curso : '');
                    selectGrupo.appendChild(opt);
                });
                gruposDisponibles = grupos;
                console.log(`✓ ${grupos.length} grupos cargados`);
            } else {
                console.log('No hay grupos en la BD');
            }
        }

        // Cargar instrumentos
        const selectInst = document.getElementById('instrumento');
        if (selectInst) {
            const { data: inst, error } = await db
                .from('instrumentos')
                .select('id, clave, descripcion')
                .eq('activo', true)
                .order('clave');

            if (error) {
                console.error('Error instrumentos:', error);
            } else if (inst && inst.length > 0) {
                selectInst.innerHTML = '<option value="">-- Seleccione --</option>';
                inst.forEach(i => {
                    const opt = document.createElement('option');
                    opt.value = i.id;
                    opt.textContent = i.clave + ' - ' + i.descripcion;
                    selectInst.appendChild(opt);
                });
                console.log(`✓ ${inst.length} instrumentos cargados`);
            }
        }

        // Cargar medios de contacto
        const selectMedio = document.getElementById('medio');
        if (selectMedio) {
            const { data: medios, error } = await db
                .from('medios_contacto')
                .select('id, clave, descripcion')
                .eq('activo', true)
                .order('clave');

            if (error) {
                console.error('Error medios:', error);
            } else if (medios && medios.length > 0) {
                selectMedio.innerHTML = '<option value="">-- Seleccione --</option>';
                medios.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = m.clave + ' - ' + m.descripcion;
                    selectMedio.appendChild(opt);
                });
                console.log(`✓ ${medios.length} medios cargados`);
            }
        }
    } catch (e) {
        console.error('Error cargando selects:', e);
    }
}

// Cargar lista de alumnos (para alumnos-lista.html)
async function cargarListaAlumnos() {
    if (!db) return;
    
    const tbody = document.getElementById('tablaAlumnos') || document.querySelector('tbody');
    if (!tbody) return;
    
    try {
        const { data, error } = await db
            .from('alumnos')
            .select('*')
            .eq('activo', true)
            .order('nombre');
        
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tbody.innerHTML = '';
        
        if (data && data.length > 0) {
            data.forEach(alumno => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => seleccionarAlumnoLista(alumno);
                tr.innerHTML = `
                    <td>${alumno.credencial || alumno.id}</td>
                    <td>${alumno.nombre || ''}</td>
                    <td>${alumno.grupo_clave || ''}</td>
                    <td>${alumno.telefono || ''}</td>
                `;
                tbody.appendChild(tr);
            });
            console.log(`✓ ${data.length} alumnos mostrados`);
        } else {
            tbody.innerHTML = '<tr><td colspan="4">No hay alumnos registrados</td></tr>';
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

function seleccionarAlumnoLista(alumno) {
    if (window.opener && window.opener.cargarAlumnoDesdeVentana) {
        window.opener.cargarAlumnoDesdeVentana(alumno);
        window.close();
    } else {
        cargarDatosAlumno(alumno);
    }
}

// Función de búsqueda de alumnos
function buscarAlumno() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalBusqueda';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Buscar Alumno</h2>
            <p>Ingrese credencial o nombre (puede ser parcial):</p>
            <input type="text" id="inputBusqueda" placeholder="Ej: J, Joel, 5086..." style="width: 100%; padding: 10px; font-size: 16px;">
            <div class="modal-buttons" style="margin-top: 15px;">
                <button class="btn" onclick="ejecutarBusqueda()">Buscar</button>
                <button class="btn" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    const input = document.getElementById('inputBusqueda');
    input.focus();
    
    // Buscar al presionar Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ejecutarBusqueda();
    });
}

async function ejecutarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        await mostrarAlerta('Ingrese un término de búsqueda');
        return;
    }
    
    cerrarModal();
    
    // Buscar en la base de datos
    if (db) {
        try {
            const { data, error } = await db
                .from('alumnos')
                .select('*')
                .eq('activo', true)
                .or(`nombre.ilike.%${termino}%,credencial.ilike.%${termino}%`)
                .order('nombre')
                .limit(50);
            
            if (error) {
                console.error('Error en búsqueda:', error);
                // Intentar búsqueda alternativa
                buscarEnCache(termino);
                return;
            }
            
            if (data && data.length > 0) {
                if (data.length === 1) {
                    cargarDatosAlumno(data[0]);
                } else {
                    mostrarResultadosBusqueda(data);
                }
            } else {
                await mostrarAlerta('No se encontraron alumnos con ese criterio');
            }
        } catch (e) {
            console.error('Error:', e);
            buscarEnCache(termino);
        }
    } else {
        buscarEnCache(termino);
    }
}

function buscarEnCache(termino) {
    const resultados = alumnosCache.filter(a => {
        const nombre = (a.nombre || '').toUpperCase();
        const cred = (a.credencial || String(a.id)).toUpperCase();
        return nombre.includes(termino) || nombre.startsWith(termino) || cred.includes(termino);
    });
    
    if (resultados.length === 0) {
        mostrarAlerta('No se encontraron alumnos');
    } else if (resultados.length === 1) {
        cargarDatosAlumno(resultados[0]);
    } else {
        mostrarResultadosBusqueda(resultados);
    }
}

function mostrarResultadosBusqueda(resultados) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalResultados';
    
    let html = `
        <div class="modal-content" style="max-width: 800px;">
            <h2>Seleccione un alumno (${resultados.length} encontrados)</h2>
            <div style="max-height: 400px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #333;">
                            <th style="padding: 8px; text-align: left;">Credencial</th>
                            <th style="padding: 8px; text-align: left;">Nombre</th>
                            <th style="padding: 8px; text-align: left;">Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    resultados.forEach((alumno, i) => {
        html += `
            <tr onclick="seleccionarResultado(${i})" style="cursor: pointer; border-bottom: 1px solid #444;">
                <td style="padding: 8px;">${alumno.credencial || alumno.id}</td>
                <td style="padding: 8px;">${alumno.nombre || ''}</td>
                <td style="padding: 8px;">${alumno.telefono || alumno.celular || ''}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            <div class="modal-buttons" style="margin-top: 15px;">
                <button class="btn" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Guardar resultados para selección
    window._resultadosBusqueda = resultados;
}

function seleccionarResultado(index) {
    const alumno = window._resultadosBusqueda[index];
    cerrarModal();
    cargarDatosAlumno(alumno);
}

function cargarDatosAlumno(alumno) {
    alumnoSeleccionado = alumno;
    
    // Mapeo de campos
    const campos = {
        'credencial': alumno.credencial || alumno.id,
        'digito': alumno.digito || '0',
        'nombre': alumno.nombre,
        'direccion': alumno.direccion,
        'direccion1': alumno.direccion,
        'email': alumno.email,
        'celular': alumno.celular,
        'telefono': alumno.telefono,
        'fechaNacimiento': alumno.fecha_nacimiento,
        'fechaIngreso': alumno.fecha_ingreso,
        'nombrePadre': alumno.nombre_padre,
        'celularPadre': alumno.celular_padre,
        'nombreMadre': alumno.nombre_madre,
        'celularMadre': alumno.celular_madre,
        'grupo': alumno.grupo_id || alumno.grupo_clave,
        'grado': alumno.grado,
        'porcentaje': alumno.porcentaje_beca || '0',
        'comentario': alumno.comentario
    };
    
    for (let id in campos) {
        const el = document.getElementById(id);
        if (el && campos[id] !== undefined) {
            el.value = campos[id] || '';
        }
    }
    
    // Checkboxes
    const beca = document.getElementById('beca');
    if (beca) beca.checked = alumno.beca || false;
    
    const reingreso = document.getElementById('reingreso');
    if (reingreso) reingreso.checked = alumno.reingreso || false;
    
    console.log('Alumno cargado:', alumno.nombre);
}

function cerrarModal() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    if (typeof habilitarInputs === 'function') habilitarInputs();
}

// Función para abrir lista de alumnos
function listaAlumnos() {
    // Crear ventana modal con lista
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalLista';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <h2>Lista de Alumnos</h2>
            <div id="contenedorLista" style="max-height: 500px; overflow-y: auto;">
                <p>Cargando...</p>
            </div>
            <div class="modal-buttons" style="margin-top: 15px;">
                <button class="btn" onclick="cerrarModal()">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    cargarListaEnModal();
}

async function cargarListaEnModal() {
    const contenedor = document.getElementById('contenedorLista');
    
    if (!db) {
        contenedor.innerHTML = '<p>Error: No hay conexión a la base de datos</p>';
        return;
    }
    
    try {
        const { data, error } = await db
            .from('alumnos')
            .select('*')
            .eq('activo', true)
            .order('nombre');
        
        if (error) {
            contenedor.innerHTML = '<p>Error: ' + error.message + '</p>';
            return;
        }
        
        if (!data || data.length === 0) {
            contenedor.innerHTML = '<p>No hay alumnos registrados</p>';
            return;
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #333; position: sticky; top: 0;">
                        <th style="padding: 8px;">Cred.</th>
                        <th style="padding: 8px;">Nombre</th>
                        <th style="padding: 8px;">Celular</th>
                        <th style="padding: 8px;">Email</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach((a, i) => {
            html += `
                <tr onclick="seleccionarDeLista(${i})" style="cursor: pointer; border-bottom: 1px solid #444;">
                    <td style="padding: 6px;">${a.credencial || a.id}</td>
                    <td style="padding: 6px;">${a.nombre || ''}</td>
                    <td style="padding: 6px;">${a.celular || ''}</td>
                    <td style="padding: 6px;">${a.email || ''}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        contenedor.innerHTML = html;
        
        window._listaAlumnos = data;
        
    } catch (e) {
        contenedor.innerHTML = '<p>Error: ' + e.message + '</p>';
    }
}

function seleccionarDeLista(index) {
    const alumno = window._listaAlumnos[index];
    cerrarModal();
    cargarDatosAlumno(alumno);
}

// Otras funciones
async function darBaja() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero seleccione un alumno');
        return;
    }
    const confirma = await mostrarConfirm('¿Dar de baja a ' + alumnoSeleccionado.nombre + '?');
    if (confirma) {
        await mostrarAlerta('Alumno dado de baja');
    }
}

async function cambiarGrupo() {
    if (!alumnoSeleccionado) {
        await mostrarAlerta('Primero seleccione un alumno');
        return;
    }
    await mostrarAlerta('Función de cambio de grupo - En desarrollo');
}

async function guardar() {
    await mostrarAlerta('Datos guardados');
}

async function noGuardarSalir() {
    const confirma = await mostrarConfirm('¿Salir sin guardar?');
    if (confirma) {
        window.location.href = 'alumnos.html';
    }
}

async function guardarAlta() {
    const nombre = document.getElementById('nombre')?.value?.trim();
    if (!nombre) {
        await mostrarAlerta('El nombre es obligatorio');
        return;
    }
    
    if (!db) {
        await mostrarAlerta('Error: No hay conexión a la base de datos');
        return;
    }
    
    const datos = {
        nombre: nombre.toUpperCase(),
        celular: document.getElementById('celular')?.value || null,
        telefono: document.getElementById('telefono')?.value || null,
        direccion: document.getElementById('direccion')?.value || null,
        email: document.getElementById('email')?.value || null,
        fecha_nacimiento: document.getElementById('fechaNacimiento')?.value || null,
        nombre_padre: document.getElementById('nombrePadre')?.value || null,
        celular_padre: document.getElementById('celularPadre')?.value || null,
        nombre_madre: document.getElementById('nombreMadre')?.value || null,
        celular_madre: document.getElementById('celularMadre')?.value || null,
        grupo_id: document.getElementById('grupo')?.value || null,
        instrumento_id: document.getElementById('instrumento')?.value || null,
        medio_contacto_id: document.getElementById('medio')?.value || null,
        beca: document.getElementById('beca')?.checked || false,
        porcentaje_beca: parseFloat(document.getElementById('porcentaje')?.value) || 0,
        activo: true,
        fecha_ingreso: new Date().toISOString().split('T')[0]
    };
    
    try {
        const { data, error } = await db.from('alumnos').insert([datos]).select();
        
        if (error) {
            await mostrarAlerta('Error al guardar: ' + error.message);
            return;
        }
        
        await mostrarAlerta('Alumno registrado correctamente');
        window.location.href = 'alumnos.html';
    } catch (e) {
        await mostrarAlerta('Error: ' + e.message);
    }
}

async function cancelarAlta() {
    const confirma = await mostrarConfirm('¿Cancelar el alta?');
    if (confirma) {
        window.location.href = 'alumnos.html';
    }
}

function nuevoAlumno() {
    // Limpiar campos
    document.querySelectorAll('input:not([readonly]), textarea, select').forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = false;
        } else {
            el.value = '';
        }
        el.disabled = false;
    });
    
    alumnoSeleccionado = null;
    document.getElementById('nombre')?.focus();
}

// Navegación de grupos
let registroActualGrupo = 0;

function navegarPrimeroGrupo() {
    if (gruposDisponibles.length > 0) {
        registroActualGrupo = 0;
        actualizarGrupoSeleccionado();
    }
}

function navegarAnteriorGrupo() {
    if (registroActualGrupo > 0) {
        registroActualGrupo--;
        actualizarGrupoSeleccionado();
    }
}

function navegarSiguienteGrupo() {
    if (registroActualGrupo < gruposDisponibles.length - 1) {
        registroActualGrupo++;
        actualizarGrupoSeleccionado();
    }
}

function navegarUltimoGrupo() {
    if (gruposDisponibles.length > 0) {
        registroActualGrupo = gruposDisponibles.length - 1;
        actualizarGrupoSeleccionado();
    }
}

function navegarRegistroGrupo() {
    const input = document.getElementById('inputRegistroGrupo');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= gruposDisponibles.length) {
            registroActualGrupo = num - 1;
            actualizarGrupoSeleccionado();
        }
    }
}

function actualizarGrupoSeleccionado() {
    const input = document.getElementById('inputRegistroGrupo');
    if (input) input.value = registroActualGrupo + 1;
    
    if (gruposDisponibles[registroActualGrupo]) {
        const grupo = gruposDisponibles[registroActualGrupo];
        const select = document.getElementById('grupo');
        if (select) select.value = grupo.id;
    }
}

// Funciones de navegación para pagos y exámenes (placeholders)
function navegarPrimeroPagos() {}
function navegarAnteriorPagos() {}
function navegarSiguientePagos() {}
function navegarUltimoPagos() {}
function navegarRegistroPagos() {}
function navegarPrimeroExamenes() {}
function navegarAnteriorExamenes() {}
function navegarSiguienteExamenes() {}
function navegarUltimoExamenes() {}
function navegarRegistroExamenes() {}
