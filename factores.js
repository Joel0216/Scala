// Inicializar Supabase
let supabase = null;
let factores = [];
let maestros = [];
let cursos = [];
let currentIndex = 0;
let modoEdicion = false;
let factorActual = null;

// Esperar a que se cargue la libreria de Supabase y el DOM
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de Factores...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
        } else {
            alert('Error: No se pudo conectar a la base de datos');
            return;
        }
    } else {
        alert('Error: initSupabase no está disponible');
        return;
    }
    
    // Inicializar fecha/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Cargar datos
    await loadMaestros();
    await loadCursos();
    await loadFactores();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar primer factor si existe
    if (factores.length > 0) {
        mostrarFactor(0);
    }
    
    console.log('Inicialización completa');
});

// Actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = formatted;
    }
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Actualizar detalles del maestro al seleccionar
    const maestroSelect = document.getElementById('maestro');
    if (maestroSelect) {
        maestroSelect.addEventListener('change', function() {
            actualizarDetallesMaestro(this.value);
        });
        
        // Búsqueda alfabética rápida (TypeAhead)
        maestroSelect.addEventListener('keypress', function(e) {
            const letra = e.key.toUpperCase();
            if (letra.length === 1 && letra.match(/[A-Z]/)) {
                buscarPorLetra(this, letra);
            }
        });
    }

    // Búsqueda alfabética rápida para cursos
    const cursoSelect = document.getElementById('curso');
    if (cursoSelect) {
        cursoSelect.addEventListener('keypress', function(e) {
            const letra = e.key.toUpperCase();
            if (letra.length === 1 && letra.match(/[A-Z]/)) {
                buscarPorLetra(this, letra);
            }
        });
    }

    // Calcular porcentaje automáticamente
    const factorInput = document.getElementById('factor');
    if (factorInput) {
        factorInput.addEventListener('input', function() {
            const factor = parseFloat(this.value) || 0;
            const porcentaje = (factor / 100).toFixed(2);
            document.getElementById('porcentaje').value = porcentaje + '%';
        });
    }

    // Botón Nuevo - Activar modo edición
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', activarModoEdicion);
    }

    // Botón Buscar X Maestro
    const buscarMaestroBtn = document.getElementById('buscarMaestroBtn');
    if (buscarMaestroBtn) {
        buscarMaestroBtn.addEventListener('click', abrirModalBusqueda);
    }

    // Botón Aceptar búsqueda
    const aceptarBtn = document.getElementById('aceptarBtn');
    if (aceptarBtn) {
        aceptarBtn.addEventListener('click', buscarPorMaestro);
    }

    // Botón Cancelar búsqueda
    const cancelarBtn = document.getElementById('cancelarBtn');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModalBusqueda);
    }

    // Botón Borrar
    const borrarBtn = document.getElementById('borrarBtn');
    if (borrarBtn) {
        borrarBtn.addEventListener('click', borrarFactor);
    }

    // Botón Terminar
    const terminarBtn = document.getElementById('terminarBtn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', () => {
            if (confirm('¿Desea salir del módulo de Factores?')) {
                window.location.href = 'archivos.html';
            }
        });
    }

    // Navegación
    const firstBtn = document.getElementById('firstBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const lastBtn = document.getElementById('lastBtn');

    if (firstBtn) firstBtn.addEventListener('click', () => mostrarFactor(0));
    if (prevBtn) prevBtn.addEventListener('click', () => mostrarFactor(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => mostrarFactor(currentIndex + 1));
    if (lastBtn) lastBtn.addEventListener('click', () => mostrarFactor(factores.length - 1));
}

// Cargar maestros
async function loadMaestros() {
    if (!supabase) {
        console.error('Supabase no inicializado');
        return;
    }
    
    try {
        console.log('Cargando maestros...');
        const { data, error } = await supabase
            .from('maestros')
            .select('*')
            .eq('status', 'activo')
            .order('nombre', { ascending: true });

        if (error) throw error;

        maestros = data || [];
        const select = document.getElementById('maestro');
        if (!select) {
            console.error('Elemento maestro no encontrado');
            return;
        }
        
        select.innerHTML = '<option value="">-- Seleccione un maestro --</option>';
        
        if (maestros.length > 0) {
            maestros.forEach(maestro => {
                const option = document.createElement('option');
                option.value = maestro.id;
                option.textContent = maestro.nombre;
                option.dataset.grado = maestro.grado || '';
                option.dataset.detallesGrado = maestro.detalles_grado || '';
                option.dataset.fechaIngreso = maestro.fecha_ingreso || '';
                select.appendChild(option);
            });
            console.log(`✓ ${maestros.length} maestros cargados`);
        } else {
            console.log('No hay maestros en la base de datos');
        }
    } catch (error) {
        console.error('Error cargando maestros:', error);
        alert('Error al cargar maestros: ' + error.message);
    }
}

// Cargar cursos
async function loadCursos() {
    if (!supabase) {
        console.error('Supabase no inicializado');
        return;
    }
    
    try {
        console.log('Cargando cursos...');
        const { data, error } = await supabase
            .from('cursos')
            .select('*')
            .eq('activo', true)
            .order('curso', { ascending: true });

        if (error) throw error;

        cursos = data || [];
        const select = document.getElementById('curso');
        if (!select) {
            console.error('Elemento curso no encontrado');
            return;
        }
        
        select.innerHTML = '<option value="">-- Seleccione un curso --</option>';
        
        if (cursos.length > 0) {
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.curso;
                select.appendChild(option);
            });
            console.log(`✓ ${cursos.length} cursos cargados`);
        } else {
            console.log('No hay cursos en la base de datos');
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
        alert('Error al cargar cursos: ' + error.message);
    }
}

// Cargar factores
async function loadFactores() {
    if (!supabase) {
        console.error('Supabase no inicializado');
        return;
    }
    
    try {
        console.log('Cargando factores...');
        const { data, error } = await supabase
            .from('factores')
            .select(`
                *,
                maestros (id, nombre, grado, detalles_grado, fecha_ingreso),
                cursos (id, curso)
            `)
            .order('id', { ascending: true });

        if (error) throw error;

        factores = data || [];
        const totalElement = document.getElementById('totalRecords');
        if (totalElement) {
            totalElement.textContent = factores.length;
        }
        console.log(`✓ ${factores.length} factores cargados`);
    } catch (error) {
        console.error('Error cargando factores:', error);
    }
}


// Búsqueda alfabética rápida (TypeAhead)
function buscarPorLetra(selectElement, letra) {
    const options = Array.from(selectElement.options);
    
    // Buscar la primera opción que empiece con la letra
    const match = options.find(opt => 
        opt.textContent.toUpperCase().startsWith(letra) && opt.value !== ''
    );
    
    if (match) {
        selectElement.value = match.value;
        selectElement.dispatchEvent(new Event('change'));
        
        // Resaltar visualmente
        selectElement.focus();
    }
}

// Actualizar detalles del maestro
function actualizarDetallesMaestro(maestroId) {
    if (!maestroId) {
        document.getElementById('nombreMaestro').value = '';
        document.getElementById('grado').value = '';
        document.getElementById('detallesGrado').value = '';
        document.getElementById('fechaIngreso').value = '';
        return;
    }
    
    const maestro = maestros.find(m => m.id === maestroId);
    if (maestro) {
        document.getElementById('nombreMaestro').value = maestro.nombre || '';
        document.getElementById('grado').value = maestro.grado || '';
        document.getElementById('detallesGrado').value = maestro.detalles_grado || '';
        document.getElementById('fechaIngreso').value = maestro.fecha_ingreso || '';
    }
}

// Activar modo edición (Botón "Nuevo")
function activarModoEdicion() {
    modoEdicion = true;
    factorActual = null;
    
    // Cambiar estilo a azul
    const form = document.getElementById('factoresForm');
    if (form) {
        form.style.border = '3px solid #4169E1';
        form.style.backgroundColor = '#E6F2FF';
    }
    
    // Limpiar campos
    document.getElementById('maestro').value = '';
    document.getElementById('curso').value = '';
    document.getElementById('factor').value = '0';
    document.getElementById('porcentaje').value = '0.00%';
    document.getElementById('nombreMaestro').value = '';
    document.getElementById('grado').value = '';
    document.getElementById('detallesGrado').value = '';
    document.getElementById('fechaIngreso').value = '';
    
    // Habilitar campos
    document.getElementById('maestro').disabled = false;
    document.getElementById('curso').disabled = false;
    document.getElementById('factor').disabled = false;
    
    // Cambiar texto del botón
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.textContent = 'Guardar';
        nuevoBtn.onclick = guardarFactor;
    }
    
    // Focus en maestro
    document.getElementById('maestro').focus();
    
    console.log('Modo edición activado');
}

// Desactivar modo edición
function desactivarModoEdicion() {
    modoEdicion = false;
    
    // Restaurar estilo
    const form = document.getElementById('factoresForm');
    if (form) {
        form.style.border = '';
        form.style.backgroundColor = '';
    }
    
    // Cambiar texto del botón
    const nuevoBtn = document.getElementById('nuevoBtn');
    if (nuevoBtn) {
        nuevoBtn.textContent = 'Nuevo';
        nuevoBtn.onclick = activarModoEdicion;
    }
    
    console.log('Modo edición desactivado');
}

// Guardar factor
async function guardarFactor() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const maestroId = document.getElementById('maestro').value;
    const cursoId = document.getElementById('curso').value;
    const factor = parseInt(document.getElementById('factor').value) || 0;

    // Validaciones
    if (!maestroId) {
        alert('Debe seleccionar un maestro');
        document.getElementById('maestro').focus();
        return;
    }

    if (!cursoId) {
        alert('Debe seleccionar un curso');
        document.getElementById('curso').focus();
        return;
    }

    if (factor <= 0) {
        alert('El factor debe ser mayor a 0');
        document.getElementById('factor').focus();
        return;
    }

    const factorData = {
        maestro_id: maestroId,
        curso_id: cursoId,
        factor: factor
    };

    try {
        console.log('Guardando factor:', factorData);
        
        // Verificar si ya existe
        const { data: existente, error: errorCheck } = await supabase
            .from('factores')
            .select('id')
            .eq('maestro_id', maestroId)
            .eq('curso_id', cursoId)
            .single();
        
        if (existente) {
            if (!confirm('Ya existe un factor para este maestro y curso.\n¿Desea actualizarlo?')) {
                return;
            }
            
            // Actualizar
            const { error } = await supabase
                .from('factores')
                .update(factorData)
                .eq('id', existente.id);
            
            if (error) throw error;
            alert('Factor actualizado correctamente');
        } else {
            // Insertar nuevo
            const { error } = await supabase
                .from('factores')
                .insert([factorData]);
            
            if (error) throw error;
            alert('Factor guardado correctamente');
        }
        
        // Recargar factores
        await loadFactores();
        
        // Desactivar modo edición
        desactivarModoEdicion();
        
        // Mostrar el factor recién guardado
        if (factores.length > 0) {
            mostrarFactor(factores.length - 1);
        }
    } catch (error) {
        console.error('Error guardando factor:', error);
        alert('Error al guardar el factor: ' + error.message);
    }
}

// Mostrar factor
function mostrarFactor(index) {
    if (index < 0 || index >= factores.length) return;
    
    currentIndex = index;
    factorActual = factores[index];
    
    // Actualizar campos
    document.getElementById('maestro').value = factorActual.maestros?.id || '';
    document.getElementById('curso').value = factorActual.cursos?.id || '';
    document.getElementById('factor').value = factorActual.factor || 0;
    
    const porcentaje = (factorActual.factor / 100).toFixed(2);
    document.getElementById('porcentaje').value = porcentaje + '%';
    
    // Actualizar detalles del maestro
    if (factorActual.maestros) {
        document.getElementById('nombreMaestro').value = factorActual.maestros.nombre || '';
        document.getElementById('grado').value = factorActual.maestros.grado || '';
        document.getElementById('detallesGrado').value = factorActual.maestros.detalles_grado || '';
        document.getElementById('fechaIngreso').value = factorActual.maestros.fecha_ingreso || '';
    }
    
    // Actualizar navegación
    document.getElementById('currentRecord').textContent = index + 1;
    
    console.log(`Mostrando factor ${index + 1} de ${factores.length}`);
}

// Abrir modal de búsqueda
function abrirModalBusqueda() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'block';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
    }
}

// Cerrar modal de búsqueda
function cerrarModalBusqueda() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Buscar por maestro
async function buscarPorMaestro() {
    const searchValue = document.getElementById('searchInput').value.trim().toUpperCase();
    
    cerrarModalBusqueda();
    
    if (!searchValue) {
        alert('Debe ingresar un nombre o letras iniciales');
        return;
    }
    
    // Buscar en factores existentes
    const resultados = factores.filter(f => 
        f.maestros?.nombre.toUpperCase().includes(searchValue) ||
        f.maestros?.nombre.toUpperCase().startsWith(searchValue)
    );
    
    if (resultados.length === 0) {
        alert('No se encontraron factores para el maestro: ' + searchValue);
        return;
    }
    
    if (resultados.length === 1) {
        // Mostrar directamente
        const index = factores.findIndex(f => f.id === resultados[0].id);
        if (index !== -1) {
            mostrarFactor(index);
        }
    } else {
        // Mostrar lista de resultados
        let mensaje = `Se encontraron ${resultados.length} factores:\n\n`;
        resultados.forEach((f, i) => {
            mensaje += `${i + 1}. ${f.maestros?.nombre} - ${f.cursos?.curso} (Factor: ${f.factor})\n`;
        });
        mensaje += '\nMostrando el primero...';
        
        alert(mensaje);
        
        // Mostrar el primero
        const index = factores.findIndex(f => f.id === resultados[0].id);
        if (index !== -1) {
            mostrarFactor(index);
        }
    }
}

// Borrar factor
async function borrarFactor() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    // Validación estricta: todos los campos deben estar llenos
    const maestroId = document.getElementById('maestro').value;
    const cursoId = document.getElementById('curso').value;
    const factor = parseInt(document.getElementById('factor').value) || 0;
    
    if (!maestroId || !cursoId || factor <= 0) {
        alert('Para borrar un factor, debe tener todos los campos completos.\n\nUse "Buscar X Maestro" para cargar un factor existente.');
        return;
    }
    
    // Verificar que el factor existe
    if (!factorActual || !factorActual.id) {
        alert('No hay un factor seleccionado para borrar.\n\nUse "Buscar X Maestro" para cargar un factor existente.');
        return;
    }
    
    // Confirmación
    const maestroNombre = document.getElementById('nombreMaestro').value;
    const cursoNombre = document.getElementById('curso').options[document.getElementById('curso').selectedIndex].text;
    
    if (!confirm(`¿Está seguro de eliminar el factor?\n\nMaestro: ${maestroNombre}\nCurso: ${cursoNombre}\nFactor: ${factor}`)) {
        return;
    }
    
    try {
        console.log('Eliminando factor:', factorActual.id);
        
        const { error } = await supabase
            .from('factores')
            .delete()
            .eq('id', factorActual.id);
        
        if (error) throw error;
        
        alert('Factor eliminado correctamente');
        
        // Recargar factores
        await loadFactores();
        
        // Limpiar formulario
        document.getElementById('maestro').value = '';
        document.getElementById('curso').value = '';
        document.getElementById('factor').value = '0';
        document.getElementById('porcentaje').value = '0.00%';
        document.getElementById('nombreMaestro').value = '';
        document.getElementById('grado').value = '';
        document.getElementById('detallesGrado').value = '';
        document.getElementById('fechaIngreso').value = '';
        
        factorActual = null;
        
        // Mostrar primer factor si existe
        if (factores.length > 0) {
            mostrarFactor(0);
        }
    } catch (error) {
        console.error('Error eliminando factor:', error);
        alert('Error al eliminar el factor: ' + error.message);
    }
}
