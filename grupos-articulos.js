// Inicializar Supabase
let supabase = null;
let grupos = [];
let grupoSeleccionado = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de grupos de artículos...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
            
            // Cargar grupos desde la base de datos
            await cargarGrupos();
        } else {
            console.error('✗ Error al conectar con Supabase');
            alert('Error: No se pudo conectar a la base de datos');
        }
    } else {
        console.error('✗ initSupabase no está disponible');
        alert('Error: initSupabase no está disponible');
    }
    
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    console.log('Inicialización completa');
});

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

// Cargar grupos desde Supabase
async function cargarGrupos() {
    if (!supabase) return;
    
    try {
        // Cargar grupos con conteo de artículos
        const { data, error } = await supabase
            .from('grupos_articulos')
            .select(`
                *,
                articulos (count)
            `)
            .order('nombre', { ascending: true });
        
        if (error) throw error;
        
        grupos = data || [];
        console.log(`✓ ${grupos.length} grupos cargados`);
        
        // Mostrar en la tabla
        mostrarGruposEnTabla();
    } catch (error) {
        console.error('Error cargando grupos:', error);
        alert('Error al cargar grupos: ' + error.message);
    }
}

// Mostrar grupos en la tabla
function mostrarGruposEnTabla() {
    const tbody = document.getElementById('bodyGrupos');
    tbody.innerHTML = '';
    
    grupos.forEach(grupo => {
        const tr = document.createElement('tr');
        tr.onclick = function() {
            seleccionarGrupo(grupo);
        };
        
        const cantidadArticulos = grupo.articulos?.[0]?.count || 0;
        
        tr.innerHTML = `
            <td>${grupo.nombre}</td>
            <td>${grupo.descripcion || ''}</td>
            <td style="text-align: center;">${cantidadArticulos}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Seleccionar grupo
function seleccionarGrupo(grupo) {
    grupoSeleccionado = grupo;
    
    // Resaltar fila seleccionada
    const tbody = document.getElementById('bodyGrupos');
    Array.from(tbody.children).forEach(tr => tr.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Cargar datos en el formulario
    document.getElementById('nombre').value = grupo.nombre;
    document.getElementById('descripcion').value = grupo.descripcion || '';
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    grupoSeleccionado = null;
    
    // Quitar selección de la tabla
    const tbody = document.getElementById('bodyGrupos');
    Array.from(tbody.children).forEach(tr => tr.classList.remove('selected'));
}

// Nuevo grupo
function nuevoGrupo() {
    limpiarFormulario();
    document.getElementById('nombre').focus();
}

// Guardar grupo
async function guardarGrupo() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!nombre) {
        alert('Por favor ingrese el nombre del grupo');
        document.getElementById('nombre').focus();
        return;
    }
    
    try {
        if (grupoSeleccionado) {
            // Actualizar grupo existente
            const { error } = await supabase
                .from('grupos_articulos')
                .update({
                    nombre: nombre.toUpperCase(),
                    descripcion: descripcion
                })
                .eq('id', grupoSeleccionado.id);
            
            if (error) throw error;
            
            alert('Grupo actualizado correctamente');
        } else {
            // Insertar nuevo grupo
            const { error } = await supabase
                .from('grupos_articulos')
                .insert([{
                    nombre: nombre.toUpperCase(),
                    descripcion: descripcion
                }]);
            
            if (error) throw error;
            
            alert('Grupo creado correctamente');
        }
        
        // Recargar grupos
        await cargarGrupos();
        limpiarFormulario();
    } catch (error) {
        console.error('Error guardando grupo:', error);
        
        if (error.code === '23505') {
            alert('Error: Ya existe un grupo con ese nombre');
        } else {
            alert('Error al guardar grupo: ' + error.message);
        }
    }
}

// Borrar grupo
async function borrarGrupo() {
    if (!grupoSeleccionado) {
        alert('Primero debe seleccionar un grupo');
        return;
    }
    
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    // Verificar si tiene artículos
    const cantidadArticulos = grupoSeleccionado.articulos?.[0]?.count || 0;
    
    if (cantidadArticulos > 0) {
        alert(`No se puede eliminar el grupo "${grupoSeleccionado.nombre}" porque tiene ${cantidadArticulos} artículo(s) asociado(s).\n\nPrimero debe eliminar o reasignar los artículos.`);
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el grupo "${grupoSeleccionado.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        try {
            const { error } = await supabase
                .from('grupos_articulos')
                .delete()
                .eq('id', grupoSeleccionado.id);
            
            if (error) throw error;
            
            alert('Grupo eliminado correctamente');
            
            // Recargar grupos
            await cargarGrupos();
            limpiarFormulario();
        } catch (error) {
            console.error('Error eliminando grupo:', error);
            alert('Error al eliminar grupo: ' + error.message);
        }
    }
}

// Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de grupos de artículos?')) {
        window.location.href = 'otros-catalogos.html';
    }
}
