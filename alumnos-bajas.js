// Inicializar Supabase
let supabase = null;
let bajas = [];
let instrumentos = [];
let medios = [];
let motivos = [];
let registroActual = 0;
let bajaSeleccionada = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de bajas...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');
            
            // Cargar catálogos y bajas
            await cargarCatalogos();
            await cargarBajas();
        } else {
            console.error('✗ Error al conectar con Supabase');
            alert('Error: No se pudo conectar a la base de datos');
        }
    } else {
        console.error('✗ initSupabase no está disponible');
        alert('Error: initSupabase no está disponible');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Inicialización completa');
});

// Setup event listeners
function setupEventListeners() {
    // Búsqueda inteligente en tiempo real
    const inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function() {
            buscarEnTiempoReal(this.value);
        });
    }
    
    // Checkbox de beca
    const checkBeca = document.getElementById('beca');
    const inputPorcentaje = document.getElementById('porcentajeBeca');
    if (checkBeca && inputPorcentaje) {
        checkBeca.addEventListener('change', function() {
            if (this.checked) {
                inputPorcentaje.disabled = false;
                inputPorcentaje.focus();
            } else {
                inputPorcentaje.disabled = true;
                inputPorcentaje.value = '0.00';
            }
        });
    }
}

// Cargar catálogos (Instrumentos, Medios, Motivos)
async function cargarCatalogos() {
    if (!supabase) return;
    
    try {
        // Cargar instrumentos
        const { data: dataInstrumentos, error: errorInstrumentos } = await supabase
            .from('instrumentos')
            .select('*')
            .eq('activo', true)
            .order('clave', { ascending: true });
        
        if (errorInstrumentos) throw errorInstrumentos;
        instrumentos = dataInstrumentos || [];
        
        // Cargar medios de contacto
        const { data: dataMedios, error: errorMedios } = await supabase
            .from('medios_contacto')
            .select('*')
            .eq('activo', true)
            .order('clave', { ascending: true });
        
        if (errorMedios) throw errorMedios;
        medios = dataMedios || [];
        
        // Cargar motivos de baja
        const { data: dataMotivos, error: errorMotivos } = await supabase
            .from('motivos_baja')
            .select('*')
            .eq('activo', true)
            .order('clave', { ascending: true });
        
        if (errorMotivos) throw errorMotivos;
        motivos = dataMotivos || [];
        
        console.log(`✓ Catálogos cargados: ${instrumentos.length} instrumentos, ${medios.length} medios, ${motivos.length} motivos`);
        
        // Llenar dropdowns
        llenarDropdowns();
    } catch (error) {
        console.error('Error cargando catálogos:', error);
        alert('Error al cargar catálogos: ' + error.message);
    }
}

// Llenar dropdowns con los catálogos
function llenarDropdowns() {
    // Dropdown de instrumentos
    const selectInstrumento = document.getElementById('instrumento');
    if (selectInstrumento) {
        selectInstrumento.innerHTML = '<option value="">-- Seleccione --</option>';
        instrumentos.forEach(inst => {
            const option = document.createElement('option');
            option.value = inst.id;
            option.textContent = `${inst.clave} - ${inst.descripcion}`;
            selectInstrumento.appendChild(option);
        });
    }
    
    // Dropdown de medios
    const selectMedio = document.getElementById('medio');
    if (selectMedio) {
        selectMedio.innerHTML = '<option value="">-- Seleccione --</option>';
        medios.forEach(medio => {
            const option = document.createElement('option');
            option.value = medio.id;
            option.textContent = `${medio.clave} - ${medio.descripcion}`;
            selectMedio.appendChild(option);
        });
    }
    
    // Dropdown de motivos
    const selectMotivo = document.getElementById('motivo');
    if (selectMotivo) {
        selectMotivo.innerHTML = '<option value="">-- Seleccione --</option>';
        motivos.forEach(motivo => {
            const option = document.createElement('option');
            option.value = motivo.id;
            option.textContent = `${motivo.clave} - ${motivo.descripcion}`;
            selectMotivo.appendChild(option);
        });
    }
}

// Cargar bajas desde Supabase
async function cargarBajas() {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('alumnos_bajas')
            .select(`
                *,
                instrumentos (clave, descripcion),
                medios_contacto (clave, descripcion),
                motivos_baja (clave, descripcion)
            `)
            .order('fecha_baja', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        bajas = data || [];
        console.log(`✓ ${bajas.length} bajas cargadas`);
        
        // Mostrar primer registro si hay bajas
        if (bajas.length > 0) {
            mostrarBaja(0);
        }
    } catch (error) {
        console.error('Error cargando bajas:', error);
        alert('Error al cargar bajas: ' + error.message);
    }
}

// Mostrar baja
function mostrarBaja(index) {
    if (index < 0 || index >= bajas.length) return;
    
    registroActual = index;
    bajaSeleccionada = bajas[index];
    
    // Actualizar campos
    document.getElementById('credencial1').value = bajaSeleccionada.credencial1 || '';
    document.getElementById('credencial2').value = bajaSeleccionada.credencial2 || '';
    document.getElementById('nombre').value = bajaSeleccionada.nombre || '';
    document.getElementById('direccion1').value = bajaSeleccionada.direccion1 || '';
    document.getElementById('direccion2').value = bajaSeleccionada.direccion2 || '';
    document.getElementById('telefono').value = bajaSeleccionada.telefono || '';
    document.getElementById('celular').value = bajaSeleccionada.celular || '';
    document.getElementById('email').value = bajaSeleccionada.email || '';
    document.getElementById('nombrePadre').value = bajaSeleccionada.nombre_padre || '';
    document.getElementById('celularPadre').value = bajaSeleccionada.celular_padre || '';
    document.getElementById('nombreMadre').value = bajaSeleccionada.nombre_madre || '';
    document.getElementById('celularMadre').value = bajaSeleccionada.celular_madre || '';
    document.getElementById('grupo').value = bajaSeleccionada.grupo || '';
    document.getElementById('grado').value = bajaSeleccionada.grado || '';
    document.getElementById('fechaIngreso').value = bajaSeleccionada.fecha_ingreso || '';
    document.getElementById('fechaBaja').value = bajaSeleccionada.fecha_baja || '';
    document.getElementById('edad').value = bajaSeleccionada.edad || '';
    document.getElementById('comentario').value = bajaSeleccionada.comentario || '';
    document.getElementById('observaciones').value = bajaSeleccionada.observaciones || '';
    
    // Beca
    const tieneBeca = bajaSeleccionada.beca || false;
    document.getElementById('beca').checked = tieneBeca;
    document.getElementById('porcentajeBeca').value = bajaSeleccionada.porcentaje_beca || '0.00';
    document.getElementById('porcentajeBeca').disabled = !tieneBeca;
    
    // Dropdowns
    document.getElementById('instrumento').value = bajaSeleccionada.instrumento_id || '';
    document.getElementById('medio').value = bajaSeleccionada.medio_entero_id || '';
    document.getElementById('motivo').value = bajaSeleccionada.motivo_baja_id || '';
    
    // Actualizar navegación
    const inputPagos = document.getElementById('inputRegistroPagos');
    if (inputPagos) inputPagos.value = index + 1;
}

// Búsqueda inteligente en tiempo real
function buscarEnTiempoReal(termino) {
    const contenedor = document.getElementById('sugerenciasBusqueda');
    
    if (!termino || termino.length < 1) {
        contenedor.innerHTML = '';
        contenedor.style.display = 'none';
        return;
    }
    
    const terminoUpper = termino.toUpperCase();
    const esNumero = /^\d+$/.test(termino);
    
    let resultados = [];
    
    if (esNumero) {
        // Buscar por credencial
        resultados = bajas.filter(b =>
            b.credencial1.includes(termino) ||
            (b.credencial2 && b.credencial2.includes(termino))
        );
    } else {
        // Buscar por nombre
        resultados = bajas.filter(b =>
            b.nombre.toUpperCase().includes(terminoUpper)
        );
    }
    
    resultados = resultados.slice(0, 10);
    
    contenedor.innerHTML = '';
    
    if (resultados.length === 0) {
        contenedor.innerHTML = '<div class="sugerencia-item">No se encontraron resultados</div>';
        contenedor.style.display = 'block';
        return;
    }
    
    resultados.forEach(baja => {
        const div = document.createElement('div');
        div.className = 'sugerencia-item';
        div.innerHTML = `
            <div class="sugerencia-nombre">${baja.nombre}</div>
            <div class="sugerencia-credencial">Cred: ${baja.credencial1}-${baja.credencial2 || '0'}</div>
            <div class="sugerencia-fecha">Baja: ${baja.fecha_baja}</div>
        `;
        
        div.onclick = function() {
            const index = bajas.findIndex(b => b.id === baja.id);
            if (index !== -1) {
                mostrarBaja(index);
                contenedor.style.display = 'none';
                document.getElementById('inputBusqueda').value = '';
            }
        };
        
        contenedor.appendChild(div);
    });
    
    contenedor.style.display = 'block';
}

// Botón Buscar (abre modal)
function buscar() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Cerrar modal de búsqueda
function cerrarModalBusqueda() {
    document.getElementById('modalBusqueda').style.display = 'none';
    document.getElementById('sugerenciasBusqueda').innerHTML = '';
    document.getElementById('sugerenciasBusqueda').style.display = 'none';
}

// Botón Listado (mostrar reporte de bajas)
function mostrarListado() {
    window.open('listado-bajas.html', 'Listado de Bajas', 'width=900,height=700');
}

// Botón Reingreso
function irAReingreso() {
    if (!bajaSeleccionada) {
        alert('Primero debe seleccionar un alumno dado de baja');
        return;
    }
    
    if (bajaSeleccionada.reingresado) {
        alert('Este alumno ya fue reingresado anteriormente el ' + bajaSeleccionada.fecha_reingreso);
        return;
    }
    
    // Guardar ID de la baja en localStorage para usarlo en la página de reingreso
    localStorage.setItem('bajaParaReingreso', JSON.stringify({
        id: bajaSeleccionada.id,
        credencial1: bajaSeleccionada.credencial1,
        credencial2: bajaSeleccionada.credencial2,
        nombre: bajaSeleccionada.nombre,
        grupo: bajaSeleccionada.grupo,
        beca: bajaSeleccionada.beca,
        porcentaje_beca: bajaSeleccionada.porcentaje_beca
    }));
    
    window.location.href = 'alumnos-reingreso.html';
}

// Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de bajas?')) {
        window.location.href = 'alumnos.html';
    }
}

// Navegación
function navegarPrimero() {
    if (bajas.length > 0) mostrarBaja(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarBaja(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < bajas.length - 1) mostrarBaja(registroActual + 1);
}

function navegarUltimo() {
    if (bajas.length > 0) mostrarBaja(bajas.length - 1);
}

function navegarRegistro() {
    const input = document.getElementById('inputRegistroPagos');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= bajas.length) {
            mostrarBaja(num - 1);
        }
    }
}

// Funciones de navegación para tabla de exámenes (placeholder)
let registroActualExamenes = 0;
let examenes = [];

function navegarPrimeroExamenes() {
    if (examenes.length > 0) {
        registroActualExamenes = 0;
        actualizarNavegacionExamenes();
    }
}

function navegarAnteriorExamenes() {
    if (registroActualExamenes > 0) {
        registroActualExamenes--;
        actualizarNavegacionExamenes();
    }
}

function navegarSiguienteExamenes() {
    if (registroActualExamenes < examenes.length - 1) {
        registroActualExamenes++;
        actualizarNavegacionExamenes();
    }
}

function navegarUltimoExamenes() {
    if (examenes.length > 0) {
        registroActualExamenes = examenes.length - 1;
        actualizarNavegacionExamenes();
    }
}

function navegarRegistroExamenes() {
    const input = document.getElementById('inputRegistroExamenes');
    if (input) {
        const num = parseInt(input.value);
        if (num > 0 && num <= examenes.length) {
            registroActualExamenes = num - 1;
            actualizarNavegacionExamenes();
        }
    }
}

function actualizarNavegacionExamenes() {
    const input = document.getElementById('inputRegistroExamenes');
    if (input) {
        input.value = registroActualExamenes + 1;
    }
}
