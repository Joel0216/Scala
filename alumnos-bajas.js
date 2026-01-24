import { supabase } from './supabase-config.js';

let alumnosBaja = [];
let currentAlumno = null;

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
    document.getElementById('datetime').textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Cargar alumnos dados de baja
async function loadAlumnosBaja() {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*')
            .eq('status', 'baja')
            .order('nombre', { ascending: true });

        if (error) throw error;

        alumnosBaja = data || [];
    } catch (error) {
        console.error('Error cargando alumnos de baja:', error);
    }
}

// Mostrar datos del alumno
function displayAlumno(alumno) {
    currentAlumno = alumno;
    
    document.getElementById('credencial1').value = alumno.credencial1 || '';
    document.getElementById('credencial2').value = alumno.credencial2 || '';
    document.getElementById('celular').value = alumno.celular || '';
    document.getElementById('nombre').value = alumno.nombre || '';
    document.getElementById('telefono').value = alumno.telefono || '';
    document.getElementById('direccion').value = alumno.direccion1 || '';
    document.getElementById('direccion2').value = alumno.direccion2 || '';
    document.getElementById('fechaIngreso').value = alumno.fecha_ingreso || '';
    document.getElementById('email').value = alumno.email || '';
    document.getElementById('edad').value = alumno.edad || '';
    document.getElementById('nombrePadre').value = alumno.nombre_padre || '';
    document.getElementById('celularPadre').value = alumno.celular_padre || '';
    document.getElementById('nombreMadre').value = alumno.nombre_madre || '';
    document.getElementById('celularMadre').value = alumno.celular_madre || '';
    document.getElementById('grupo').value = alumno.grupo || '';
    document.getElementById('curso').value = alumno.curso || '';
    document.getElementById('grado').value = alumno.grado || '';
    document.getElementById('beca').checked = alumno.beca || false;
    document.getElementById('porcentaje').value = alumno.porcentaje || '';
    document.getElementById('comentario').value = alumno.comentario || '';
    document.getElementById('fechaBaja').value = alumno.fecha_baja || '';
    document.getElementById('observaciones').value = alumno.observaciones || '';

    loadPagos(alumno.id);
    loadExamenes(alumno.id);
}

// Cargar pagos del alumno
async function loadPagos(alumnoId) {
    try {
        const { data, error } = await supabase
            .from('pagos')
            .select('*')
            .eq('alumno_id', alumnoId)
            .order('fecha', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('pagosTableBody');
        tbody.innerHTML = '';

        data.forEach(pago => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pago.anio || ''}</td>
                <td>${pago.mes || ''}</td>
                <td>${pago.descuento || ''}</td>
                <td>${pago.precio || ''}</td>
                <td>${pago.recibo || ''}</td>
                <td>${pago.fecha || ''}</td>
                <td>${pago.grupo || ''}</td>
                <td>${pago.curso || ''}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando pagos:', error);
    }
}

// Cargar exámenes del alumno
async function loadExamenes(alumnoId) {
    try {
        const { data, error } = await supabase
            .from('examenes')
            .select('*')
            .eq('alumno_id', alumnoId)
            .order('fecha', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('examenesTableBody');
        tbody.innerHTML = '';

        data.forEach(examen => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${examen.credencial || ''}</td>
                <td>${examen.clave_examen || ''}</td>
                <td>${examen.fecha || ''}</td>
                <td>${examen.hora || ''}</td>
                <td>${examen.maestro_baja || ''}</td>
                <td>${examen.gn || ''}</td>
                <td>${examen.certificado || ''}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando exámenes:', error);
    }
}

// Buscar por credencial
document.getElementById('buscarBtn').addEventListener('click', () => {
    const modal = document.getElementById('searchModal');
    document.getElementById('modalTitle').textContent = 'Proporcione el numero de Credencial';
    document.getElementById('searchInput').value = '';
    modal.style.display = 'block';
});

// Buscar por nombre
document.getElementById('buscarNombreBtn').addEventListener('click', () => {
    const modal = document.getElementById('searchModal');
    document.getElementById('modalTitle').textContent = 'Proporcione la parte del nombre que desea buscar';
    document.getElementById('searchInput').value = '';
    modal.style.display = 'block';
});

// Aceptar búsqueda
document.getElementById('aceptarBtn').addEventListener('click', async () => {
    const searchValue = document.getElementById('searchInput').value;
    const isCredencial = document.getElementById('modalTitle').textContent.includes('Credencial');
    
    document.getElementById('searchModal').style.display = 'none';

    if (isCredencial) {
        // Buscar por credencial
        const alumno = alumnosBaja.find(a => a.credencial1 === searchValue);
        if (alumno) {
            displayAlumno(alumno);
        } else {
            alert('Alumno no encontrado');
        }
    } else {
        // Buscar por nombre
        const resultados = alumnosBaja.filter(a => 
            a.nombre.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron alumnos');
        } else if (resultados.length === 1) {
            displayAlumno(resultados[0]);
        } else {
            showSelectModal(resultados);
        }
    }
});

// Mostrar modal de selección
function showSelectModal(alumnos) {
    const modal = document.getElementById('selectModal');
    const list = document.getElementById('alumnosList');
    list.innerHTML = '';

    alumnos.forEach(alumno => {
        const div = document.createElement('div');
        div.className = 'alumno-item';
        div.textContent = `${alumno.credencial1} - ${alumno.nombre}`;
        div.onclick = () => {
            displayAlumno(alumno);
            modal.style.display = 'none';
        };
        list.appendChild(div);
    });

    modal.style.display = 'block';
}

// Cancelar búsqueda
document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'none';
});

// Cerrar modal de selección
document.getElementById('cerrarSelectBtn').addEventListener('click', () => {
    document.getElementById('selectModal').style.display = 'none';
});

// Reingreso
document.getElementById('reingresoBtn').addEventListener('click', () => {
    if (currentAlumno) {
        window.location.href = `alumnos-reingreso.html?id=${currentAlumno.id}`;
    } else {
        alert('Seleccione un alumno primero');
    }
});

// Listado
document.getElementById('listadoBtn').addEventListener('click', () => {
    window.open('listado-bajas.html', '_blank');
});

// Terminar
document.getElementById('terminarBtn').addEventListener('click', () => {
    if (confirm('¿Desea salir del módulo de Bajas?')) {
        window.location.href = 'archivos.html';
    }
});

// Cargar datos al iniciar
loadAlumnosBaja();
