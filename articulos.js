// Inicializar Supabase

let articulos = [];
let gruposArticulos = [];
let registroActual = 0;
let articuloSeleccionado = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando módulo de artículos...');

    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
            console.log('✓ Supabase conectado');

            // Cargar datos desde la base de datos
            await cargarGruposArticulos();
            await cargarArticulos();
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

    // Setup event listeners para búsqueda inteligente
    setupBusquedaInteligente();

    console.log('Inicialización completa');
});

// Cargar grupos de artículos desde Supabase
async function cargarGruposArticulos() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('grupos_articulos')
            .select('id, nombre')
            .order('nombre', { ascending: true });

        if (error) throw error;

        gruposArticulos = data || [];
        console.log(`✓ ${gruposArticulos.length} grupos de artículos cargados`);

        // Llenar el dropdown
        const select = document.getElementById('grupo');
        select.innerHTML = '<option value="">-- Seleccione un grupo --</option>';

        gruposArticulos.forEach(grupo => {
            const option = document.createElement('option');
            option.value = grupo.id;
            option.textContent = grupo.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando grupos de artículos:', error);
        alert('Error al cargar grupos de artículos: ' + error.message);
    }
}

// Cargar artículos desde Supabase
async function cargarArticulos() {
    if (!supabase) return;

    try {
        const { data, error } = await supabase
            .from('articulos')
            .select(`
                *,
                grupos_articulos (
                    id,
                    nombre
                )
            `)
            .order('clave', { ascending: true });

        if (error) throw error;

        articulos = data || [];
        console.log(`✓ ${articulos.length} artículos cargados`);

        // Mostrar primer registro si hay artículos
        if (articulos.length > 0) {
            mostrarRegistro(0);
        }

        document.getElementById('totalRegistros').textContent = articulos.length;
    } catch (error) {
        console.error('Error cargando artículos:', error);
        alert('Error al cargar artículos: ' + error.message);
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
    const horasStr = String(horas).padStart(2, '0');

    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = `${dia}/${mes}/${anio} ${horasStr}:${minutos}:${segundos} ${ampm}`;
    }
}

// Setup búsqueda inteligente (TypeAhead)
function setupBusquedaInteligente() {
    const inputBusqueda = document.getElementById('inputBusqueda');
    if (!inputBusqueda) return;

    // Crear contenedor de sugerencias si no existe
    let sugerenciasDiv = document.getElementById('sugerencias');
    if (!sugerenciasDiv) {
        sugerenciasDiv = document.createElement('div');
        sugerenciasDiv.id = 'sugerencias';
        sugerenciasDiv.className = 'sugerencias-container';
        inputBusqueda.parentNode.insertBefore(sugerenciasDiv, inputBusqueda.nextSibling);
    }

    // Event listener para búsqueda en tiempo real
    inputBusqueda.addEventListener('input', function () {
        const termino = this.value.trim().toUpperCase();

        if (termino.length === 0) {
            sugerenciasDiv.innerHTML = '';
            sugerenciasDiv.style.display = 'none';
            return;
        }

        // Buscar coincidencias
        const resultados = buscarArticulosInteligente(termino);

        if (resultados.length > 0) {
            mostrarSugerencias(resultados, sugerenciasDiv);
        } else {
            sugerenciasDiv.innerHTML = '<div class="sugerencia-item">No se encontraron resultados</div>';
            sugerenciasDiv.style.display = 'block';
        }
    });

    // Cerrar sugerencias al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!inputBusqueda.contains(e.target) && !sugerenciasDiv.contains(e.target)) {
            sugerenciasDiv.style.display = 'none';
        }
    });
}

// Búsqueda inteligente: por clave o por grupo
function buscarArticulosInteligente(termino) {
    if (!termino) return [];

    const esNumerico = /^\d+$/.test(termino);
    const esSoloLetras = /^[A-Z]+$/.test(termino);

    let resultados = [];

    if (esSoloLetras) {
        // Buscar por nombre de grupo
        resultados = articulos.filter(art => {
            const nombreGrupo = art.grupos_articulos?.nombre || '';
            return nombreGrupo.toUpperCase().startsWith(termino);
        });
    } else {
        // Buscar por clave (puede contener letras y números)
        resultados = articulos.filter(art =>
            art.clave.toUpperCase().includes(termino) ||
            art.clave.toUpperCase().startsWith(termino)
        );
    }

    // También buscar en descripción
    const porDescripcion = articulos.filter(art =>
        art.descripcion.toUpperCase().includes(termino)
    );

    // Combinar resultados sin duplicados
    const idsUnicos = new Set();
    const resultadosFinales = [];

    [...resultados, ...porDescripcion].forEach(art => {
        if (!idsUnicos.has(art.id)) {
            idsUnicos.add(art.id);
            resultadosFinales.push(art);
        }
    });

    return resultadosFinales.slice(0, 10); // Limitar a 10 resultados
}

// Mostrar sugerencias en el dropdown
function mostrarSugerencias(resultados, contenedor) {
    contenedor.innerHTML = '';

    resultados.forEach(articulo => {
        const div = document.createElement('div');
        div.className = 'sugerencia-item';

        const nombreGrupo = articulo.grupos_articulos?.nombre || 'Sin grupo';

        div.innerHTML = `
            <div class="sugerencia-grupo">[${nombreGrupo}]</div>
            <div class="sugerencia-clave">${articulo.clave}</div>
            <div class="sugerencia-desc">${articulo.descripcion}</div>
            <div class="sugerencia-precio">$${articulo.precio.toFixed(2)}</div>
        `;

        div.onclick = function () {
            // Auto-fill: cargar el artículo seleccionado
            const index = articulos.findIndex(a => a.id === articulo.id);
            if (index !== -1) {
                mostrarRegistro(index);
                cerrarModal();
            }
        };

        contenedor.appendChild(div);
    });

    contenedor.style.display = 'block';
}

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('clave').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('iva').value = '0.00';
    document.getElementById('stock').value = '';
    articuloSeleccionado = null;
}

// Función para cargar datos del artículo
function cargarDatosArticulo(articulo) {
    articuloSeleccionado = articulo;
    document.getElementById('clave').value = articulo.clave || '';
    document.getElementById('descripcion').value = articulo.descripcion || '';
    document.getElementById('grupo').value = articulo.grupo_articulo_id || '';
    document.getElementById('precio').value = articulo.precio ? articulo.precio.toFixed(2) : '';
    document.getElementById('iva').value = '0.16'; // IVA fijo
    document.getElementById('stock').value = articulo.existencia || 0;

    // Ocultar botón guardar inicialmente
    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) btnGuardar.style.display = 'none';

    // Agregar listeners para mostrar botón guardar cuando se modifique
    const descripcionInput = document.getElementById('descripcion');
    const grupoSelect = document.getElementById('grupo');
    const precioInput = document.getElementById('precio');
    const stockInput = document.getElementById('stock');

    const mostrarBtnGuardar = () => {
        if (btnGuardar) btnGuardar.style.display = 'inline-block';
    };

    if (descripcionInput) descripcionInput.addEventListener('input', mostrarBtnGuardar);
    if (grupoSelect) grupoSelect.addEventListener('change', mostrarBtnGuardar);
    if (precioInput) precioInput.addEventListener('input', mostrarBtnGuardar);
    if (stockInput) stockInput.addEventListener('input', mostrarBtnGuardar);
}

// Mostrar registro actual
function mostrarRegistro(index) {
    if (index >= 0 && index < articulos.length) {
        registroActual = index;
        cargarDatosArticulo(articulos[index]);
        document.getElementById('registroActual').textContent = index + 1;
        document.getElementById('inputRegistro').value = index + 1;
        document.getElementById('inputRegistro').max = articulos.length;
    }
}

// Botón Nuevo - Redirigir a página de alta
function nuevoArticulo() {
    window.location.href = 'articulos-new.html';
}

// Botón Buscar
function buscarArticulo() {
    const modal = document.getElementById('modalBusqueda');
    modal.style.display = 'block';
    document.getElementById('inputBusqueda').value = '';
    document.getElementById('inputBusqueda').focus();
}

// Aceptar búsqueda
async function aceptarBusqueda() {
    const termino = document.getElementById('inputBusqueda').value.trim().toUpperCase();

    if (!termino) {
        alert('Por favor ingrese una clave o grupo');
        return;
    }

    const resultados = buscarArticulosInteligente(termino);

    cerrarModal();

    if (resultados.length === 0) {
        alert('No se encontraron artículos');
    } else if (resultados.length === 1) {
        const index = articulos.findIndex(a => a.id === resultados[0].id);
        if (index !== -1) {
            mostrarRegistro(index);
        }
    } else {
        mostrarListaArticulos(resultados);
    }
}

// Mostrar lista de artículos
function mostrarListaArticulos(resultados) {
    const modal = document.getElementById('modalLista');
    const tbody = document.getElementById('bodyResultados');
    tbody.innerHTML = '';

    resultados.forEach((articulo) => {
        const tr = document.createElement('tr');
        tr.onclick = function () {
            const index = articulos.findIndex(a => a.id === articulo.id);
            if (index !== -1) {
                mostrarRegistro(index);
            }
            cerrarModal();
        };

        const nombreGrupo = articulo.grupos_articulos?.nombre || 'Sin grupo';

        tr.innerHTML = `
            <td>${articulo.clave}</td>
            <td>${articulo.descripcion}</td>
            <td>${nombreGrupo}</td>
            <td>$${articulo.precio ? articulo.precio.toFixed(2) : '0.00'}</td>
            <td>${articulo.existencia || 0}</td>
        `;
        tbody.appendChild(tr);
    });

    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalBusqueda').style.display = 'none';
    document.getElementById('modalLista').style.display = 'none';

    // Limpiar sugerencias
    const sugerenciasDiv = document.getElementById('sugerencias');
    if (sugerenciasDiv) {
        sugerenciasDiv.style.display = 'none';
    }
}

// Botón Borrar
async function borrarArticulo() {
    if (!articuloSeleccionado) {
        alert('Primero debe seleccionar un artículo');
        return;
    }

    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    if (confirm(`¿Está seguro de eliminar este artículo?\n\nClave: ${articuloSeleccionado.clave}\nDescripción: ${articuloSeleccionado.descripcion}\n\nEsta acción no se puede deshacer.`)) {
        try {
            const { error } = await supabase
                .from('articulos')
                .delete()
                .eq('id', articuloSeleccionado.id);

            if (error) throw error;

            alert('Artículo eliminado correctamente');

            // Recargar artículos
            await cargarArticulos();
        } catch (error) {
            console.error('Error eliminando artículo:', error);
            alert('Error al eliminar artículo: ' + error.message);
        }
    }
}

// Botón Terminar
function terminar() {
    if (confirm('¿Desea salir del módulo de artículos?')) {
        window.location.href = 'archivos.html';
    }
}

// Navegación
function navegarPrimero() {
    if (articulos.length > 0) mostrarRegistro(0);
}

function navegarAnterior() {
    if (registroActual > 0) mostrarRegistro(registroActual - 1);
}

function navegarSiguiente() {
    if (registroActual < articulos.length - 1) mostrarRegistro(registroActual + 1);
}

function navegarUltimo() {
    if (articulos.length > 0) mostrarRegistro(articulos.length - 1);
}

function navegarRegistro() {
    const num = parseInt(document.getElementById('inputRegistro').value);
    if (num > 0 && num <= articulos.length) {
        mostrarRegistro(num - 1);
    }
}

// Guardar cambios en artículo
async function guardarCambios() {
    if (!articuloSeleccionado) {
        alert('Primero debe seleccionar un artículo');
        return;
    }

    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }

    const descripcion = document.getElementById('descripcion').value.trim();
    const grupoId = document.getElementById('grupo').value;
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const stock = parseInt(document.getElementById('stock').value) || 0;

    if (!descripcion) {
        alert('La descripción es obligatoria');
        document.getElementById('descripcion').focus();
        return;
    }

    if (!grupoId) {
        alert('Debe seleccionar un grupo');
        document.getElementById('grupo').focus();
        return;
    }

    if (precio <= 0) {
        alert('El precio debe ser mayor a 0');
        document.getElementById('precio').focus();
        return;
    }

    try {
        const { error } = await supabase
            .from('articulos')
            .update({
                descripcion: descripcion,
                grupo_articulo_id: grupoId,
                precio: precio,
                existencia: stock
            })
            .eq('id', articuloSeleccionado.id);

        if (error) throw error;

        alert('Artículo actualizado correctamente');

        // Ocultar botón guardar
        const btnGuardar = document.getElementById('btnGuardar');
        if (btnGuardar) btnGuardar.style.display = 'none';

        // Recargar artículos
        await cargarArticulos();

        // Mostrar el artículo actualizado
        const index = articulos.findIndex(a => a.id === articuloSeleccionado.id);
        if (index !== -1) {
            mostrarRegistro(index);
        }
    } catch (error) {
        console.error('Error guardando artículo:', error);
        alert('Error al guardar artículo: ' + error.message);
    }
}
