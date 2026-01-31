// Módulo de Maestros
let db = null;
let maestros = [];
let maestroSeleccionado = null;
let modoNuevo = false;

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
    
    // Configurar validación de teléfono (solo números)
    configurarValidacionTelefono();
    
    // Configurar generación automática de clave
    const nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.addEventListener('input', generarClaveAutomatica);
    }
    
    // Deshabilitar campos al inicio
    deshabilitarCampos();
    
    if (typeof habilitarInputs === 'function') habilitarInputs();
});

// Cargar maestros desde la base de datos
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

    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = `${dia}/${mes}/${anio} ${String(horas).padStart(2, '0')}:${minutos}:${segundos} ${ampm}`;
    }
}

// Configurar validación de teléfono (solo números)
function configurarValidacionTelefono() {
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            // Remover todo lo que no sea número
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        telefonoInput.addEventListener('keypress', function(e) {
            // Solo permitir números
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    // También para el campo de edición
    const editTelefonoInput = document.getElementById('editTelefono');
    if (editTelefonoInput) {
        editTelefonoInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        editTelefonoInput.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
}

// Generar clave automática basada en el nombre
async function generarClaveAutomatica() {
    const nombreInput = document.getElementById('nombre');
    const claveInput = document.getElementById('clave');
    
    if (!nombreInput || !claveInput) return;
    
    const nombre = nombreInput.value.trim().toUpperCase();
    
    if (!nombre) {
        claveInput.value = '';
        return;
    }
    
    // Dividir el nombre en palabras
    const palabras = nombre.split(' ').filter(p => p.length > 0);
    
    let claveBase = '';
    
    if (palabras.length === 1) {
        // Si solo hay una palabra, tomar las primeras 2 letras
        claveBase = palabras[0].substring(0, 2);
    } else if (palabras.length === 2) {
        // Si hay 2 palabras (nombre y apellido), primera letra de cada una
        // Ejemplo: "Joel Pool" -> "JP"
        claveBase = palabras[0].charAt(0) + palabras[1].charAt(0);
    } else if (palabras.length === 3) {
        // Si hay 3 palabras, primera letra del primer nombre y primer apellido
        // Ejemplo: "Joel Pool Martinez" -> "JP"
        claveBase = palabras[0].charAt(0) + palabras[1].charAt(0);
    } else if (palabras.length >= 4) {
        // Si hay 4+ palabras (2 nombres + 2 apellidos)
        // Ejemplo: "Joel Antonio Pool Martinez" -> "JP" (primer nombre + primer apellido)
        // El primer apellido está en la posición palabras.length - 2
        claveBase = palabras[0].charAt(0) + palabras[palabras.length - 2].charAt(0);
    }
    
    // Verificar si la clave ya existe
    let claveUnica = claveBase;
    let contador = 0;
    
    // Buscar claves duplicadas
    const clavesExistentes = maestros
        .filter(m => m.clave && m.clave.startsWith(claveBase))
        .map(m => m.clave);
    
    if (clavesExistentes.includes(claveBase)) {
        // Si existe, agregar segundo nombre
        if (palabras.length >= 4) {
            // Ejemplo: "Jose Antonio Pool Poot" -> "JAP"
            claveUnica = palabras[0].charAt(0) + palabras[1].charAt(0) + palabras[palabras.length - 2].charAt(0);
        } else if (palabras.length === 3) {
            // Ejemplo: "Jose Antonio Pool" -> "JAP"
            claveUnica = palabras[0].charAt(0) + palabras[1].charAt(0) + palabras[2].charAt(0);
        } else {
            // Si aún existe, agregar número
            contador = 1;
            while (clavesExistentes.includes(claveUnica + contador)) {
                contador++;
            }
            if (contador > 0) {
                claveUnica = claveBase + contador;
            }
        }
        
        // Verificar si la nueva clave también existe
        if (clavesExistentes.includes(claveUnica)) {
            contador = 1;
            while (clavesExistentes.includes(claveUnica + contador)) {
                contador++;
            }
            claveUnica = claveUnica + contador;
        }
    }
    
    claveInput.value = claveUnica;
}

// Deshabilitar campos del formulario
function deshabilitarCampos() {
    const campos = ['nombre', 'direccion1', 'direccion2', 'telefono', 'rfc', 'grado', 'detallesGrado'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });
}

// Habilitar campos del formulario
function habilitarCamposFormulario() {
    const campos = ['nombre', 'direccion1', 'direccion2', 'telefono', 'rfc', 'grado', 'detallesGrado'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
    });
}

// Limpiar formulario
function limpiarFormulario() {
    ['nombre', 'direccion1', 'direccion2', 'telefono', 'clave', 'rfc', 'grado', 'detallesGrado', 'fechaIngreso'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    maestroSeleccionado = null;
    modoNuevo = false;
    
    // Deshabilitar botones de editar y borrar
    document.getElementById('btnEditar').disabled = true;
    document.getElementById('btnBorrar').disabled = true;
}

// Cargar datos de un maestro en el formulario
function cargarDatosMaestro(maestro) {
    maestroSeleccionado = maestro;
    modoNuevo = false;
    
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
    } else {
        document.getElementById('direccion1').value = '';
        document.getElementById('direccion2').value = '';
    }
    
    if (maestro.fecha_ingreso) {
        const fecha = new Date(maestro.fecha_ingreso);
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        document.getElementById('fechaIngreso').value = 
            `${String(fecha.getDate()).padStart(2, '0')}-${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
    }
    
    // Deshabilitar campos (solo lectura)
    deshabilitarCampos();
    
    // Habilitar botones de editar y borrar
    document.getElementById('btnEditar').disabled = false;
    document.getElementById('btnBorrar').disabled = false;
}

// ==================== BOTÓN NUEVO ====================
async function nuevoMaestro() {
    limpiarFormulario();
    modoNuevo = true;
    
    // Habilitar campos para edición
    habilitarCamposFormulario();
    
    // Establecer fecha de ingreso automáticamente
    const ahora = new Date();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    document.getElementById('fechaIngreso').value = 
        `${String(ahora.getDate()).padStart(2, '0')}-${meses[ahora.getMonth()]}-${ahora.getFullYear()}`;
    
    // Enfocar en el campo nombre
    document.getElementById('nombre').focus();
    
    // Cambiar el botón Nuevo a Guardar
    const btnNuevo = document.getElementById('btnNuevo');
    btnNuevo.textContent = 'Guardar';
    btnNuevo.onclick = guardarNuevoMaestro;
    
    // Mostrar botón Cancelar
    document.getElementById('btnCancelarNuevo').style.display = 'inline-block';
    
    // Deshabilitar botones de editar, borrar y buscar
    document.getElementById('btnEditar').disabled = true;
    document.getElementById('btnBorrar').disabled = true;
    document.getElementById('btnBuscar').disabled = true;
}

// Cancelar nuevo maestro
function cancelarNuevo() {
    // Restaurar botón Nuevo
    const btnNuevo = document.getElementById('btnNuevo');
    btnNuevo.textContent = 'Nuevo';
    btnNuevo.onclick = nuevoMaestro;
    
    // Ocultar botón Cancelar
    document.getElementById('btnCancelarNuevo').style.display = 'none';
    
    // Limpiar y deshabilitar campos
    limpiarFormulario();
    deshabilitarCampos();
    
    // Habilitar botón buscar
    document.getElementById('btnBuscar').disabled = false;
    
    modoNuevo = false;
}

// Guardar nuevo maestro
async function guardarNuevoMaestro() {
    if (!db) {
        await mostrarAlerta('Error: Base de datos no conectada');
        return;
    }
    
    // Validar campos obligatorios
    const nombre = document.getElementById('nombre').value.trim();
    const direccion1 = document.getElementById('direccion1').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const clave = document.getElementById('clave').value.trim();
    const detallesGrado = document.getElementById('detallesGrado').value.trim();
    
    const errores = [];
    
    if (!nombre) errores.push('- Nombre');
    if (!direccion1) errores.push('- Dirección');
    if (!telefono) errores.push('- Teléfono');
    if (!clave) errores.push('- Clave (escriba el nombre para generarla)');
    if (!detallesGrado) errores.push('- Detalles Grado');
    
    if (errores.length > 0) {
        await mostrarAlerta('Por favor complete los campos obligatorios:\n\n' + errores.join('\n'));
        return;
    }
    
    // Preparar datos
    const datos = {
        nombre: nombre.toUpperCase(),
        direccion: direccion1 + (document.getElementById('direccion2').value.trim() ? '\n' + document.getElementById('direccion2').value.trim() : ''),
        telefono: telefono,
        clave: clave.toUpperCase(),
        rfc: document.getElementById('rfc').value.trim().toUpperCase() || null,
        grado: document.getElementById('grado').value.trim() || null,
        detalles_grado: detallesGrado.toUpperCase(),
        fecha_ingreso: new Date().toISOString().split('T')[0],
        status: 'activo'
    };
    
    try {
        const { data, error } = await db.from('maestros').insert([datos]).select();
        
        if (error) throw error;
        
        await mostrarAlerta(`Maestro guardado correctamente\n\nNombre: ${datos.nombre}\nClave: ${datos.clave}`);
        
        // Recargar maestros
        await cargarMaestros();
        
        // Restaurar botón Nuevo
        const btnNuevo = document.getElementById('btnNuevo');
        btnNuevo.textContent = 'Nuevo';
        btnNuevo.onclick = nuevoMaestro;
        
        // Ocultar botón Cancelar
        document.getElementById('btnCancelarNuevo').style.display = 'none';
        
        // Habilitar botón buscar
        document.getElementById('btnBuscar').disabled = false;
        
        // Limpiar y deshabilitar
        limpiarFormulario();
        deshabilitarCampos();
        
    } catch (error) {
        await mostrarAlerta('Error al guardar: ' + error.message);
    }
}

// ==================== BOTÓN EDITAR ====================
function editarMaestro() {
    if (!maestroSeleccionado) {
        mostrarAlerta('Primero busque y seleccione un maestro');
        return;
    }
    
    // Cargar datos en el modal de edición
    document.getElementById('editNombre').value = maestroSeleccionado.nombre || '';
    document.getElementById('editTelefono').value = maestroSeleccionado.telefono || '';
    
    if (maestroSeleccionado.direccion) {
        const dirs = maestroSeleccionado.direccion.split('\n');
        document.getElementById('editDireccion1').value = dirs[0] || '';
        document.getElementById('editDireccion2').value = dirs[1] || '';
    } else {
        document.getElementById('editDireccion1').value = '';
        document.getElementById('editDireccion2').value = '';
    }
    
    // Mostrar modal de edición
    document.getElementById('modalEdicion').style.display = 'block';
    document.getElementById('editNombre').focus();
}

// Cancelar edición
function cancelarEdicion() {
    document.getElementById('modalEdicion').style.display = 'none';
}

// Guardar edición
async function guardarEdicion() {
    if (!db || !maestroSeleccionado) {
        await mostrarAlerta('Error: No hay maestro seleccionado');
        return;
    }
    
    const nombre = document.getElementById('editNombre').value.trim();
    const direccion1 = document.getElementById('editDireccion1').value.trim();
    const telefono = document.getElementById('editTelefono').value.trim();
    
    if (!nombre || !direccion1 || !telefono) {
        await mostrarAlerta('Todos los campos son obligatorios');
        return;
    }
    
    const datos = {
        nombre: nombre.toUpperCase(),
        direccion: direccion1 + (document.getElementById('editDireccion2').value.trim() ? '\n' + document.getElementById('editDireccion2').value.trim() : ''),
        telefono: telefono
    };
    
    try {
        const { error } = await db.from('maestros').update(datos).eq('id', maestroSeleccionado.id);
        
        if (error) throw error;
        
        await mostrarAlerta('Maestro actualizado correctamente');
        
        // Cerrar modal
        document.getElementById('modalEdicion').style.display = 'none';
        
        // Recargar maestros
        await cargarMaestros();
        
        // Actualizar datos en pantalla
        maestroSeleccionado = { ...maestroSeleccionado, ...datos };
        cargarDatosMaestro(maestroSeleccionado);
        
    } catch (error) {
        await mostrarAlerta('Error al actualizar: ' + error.message);
    }
}

// ==================== BOTÓN BUSCAR ====================
function buscarMaestro() {
    // Si está en modo nuevo, cancelar primero
    if (modoNuevo) {
        cancelarNuevo();
    }
    
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('modalBusqueda').style.display = 'block';
    document.getElementById('inputBusqueda').focus();
}

function cerrarModalBusqueda() {
    document.getElementById('modalBusqueda').style.display = 'none';
}

async function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();
    
    if (!termino) {
        await mostrarAlerta('Ingrese un nombre o clave para buscar');
        return;
    }
    
    // Buscar maestros que coincidan
    const resultados = maestros.filter(m => 
        (m.nombre && m.nombre.toUpperCase().includes(termino)) ||
        (m.clave && m.clave.toUpperCase().includes(termino))
    );
    
    cerrarModalBusqueda();
    
    if (resultados.length === 0) {
        await mostrarAlerta('No se encontraron maestros con ese criterio');
    } else if (resultados.length === 1) {
        cargarDatosMaestro(resultados[0]);
    } else {
        mostrarResultadosBusqueda(resultados, termino);
    }
}

function mostrarResultadosBusqueda(resultados, termino) {
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';
    
    document.getElementById('tituloResultados').textContent = `Resultados de Búsqueda ('${termino}')`;
    
    resultados.forEach(maestro => {
        const tr = document.createElement('tr');
        tr.onclick = () => {
            // Quitar selección anterior
            tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
            tr.classList.add('selected');
        };
        tr.ondblclick = () => {
            cargarDatosMaestro(maestro);
            cerrarModalResultados();
        };
        tr.innerHTML = `
            <td>${maestro.nombre || ''}</td>
            <td>${maestro.clave || ''}</td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('modalResultados').style.display = 'block';
}

function cerrarModalResultados() {
    document.getElementById('modalResultados').style.display = 'none';
}

// ==================== BOTÓN BORRAR ====================
async function borrarMaestro() {
    if (!maestroSeleccionado) {
        await mostrarAlerta('Primero busque y seleccione un maestro para borrar');
        return;
    }
    
    // Mostrar modal de confirmación
    document.getElementById('mensajeBorrar').textContent = 
        `¿Está seguro de que desea borrar al maestro "${maestroSeleccionado.nombre}"?`;
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
    
    if (!db || !maestroSeleccionado) {
        await mostrarAlerta('Error: No hay maestro seleccionado');
        return;
    }
    
    try {
        // Opción 1: Borrado lógico (cambiar status)
        const { error } = await db.from('maestros')
            .update({ 
                status: 'inactivo',
                observaciones: `BAJA: ${razon} (${new Date().toLocaleDateString()})`
            })
            .eq('id', maestroSeleccionado.id);
        
        // Opción 2: Borrado físico (descomentar si se prefiere)
        // const { error } = await db.from('maestros').delete().eq('id', maestroSeleccionado.id);
        
        if (error) throw error;
        
        await mostrarAlerta('Maestro eliminado correctamente');
        
        // Cerrar modal
        document.getElementById('modalBorrar').style.display = 'none';
        
        // Recargar maestros
        await cargarMaestros();
        
        // Limpiar formulario
        limpiarFormulario();
        deshabilitarCampos();
        
    } catch (error) {
        await mostrarAlerta('Error al eliminar: ' + error.message);
    }
}

// ==================== BOTÓN TERMINAR ====================
function terminar() {
    window.location.href = 'archivos.html';
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Manejar tecla Enter en búsqueda
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('modalBusqueda').style.display === 'block') {
            aceptarBusqueda();
        }
    }
    if (e.key === 'Escape') {
        cerrarModalBusqueda();
        cerrarModalResultados();
        cancelarEdicion();
        cancelarBorrado();
    }
});
