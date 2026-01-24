// Obtener cursos del localStorage o usar datos de ejemplo
let cursos = [
    { curso: 'ANUALIDAD', costo: 300.00, clave: 'AN', iva: 0.16, recargo: 0.00 },
    { curso: 'ARTES MARCIALES', costo: 400.00, clave: 'AM', iva: 0.16, recargo: 0.00 },
    { curso: 'Baby Music', costo: 770.00, clave: 'BM', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 1', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 2', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 3', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 4', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 5', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Electrico 6', costo: 770.00, clave: 'BE', iva: 0.15, recargo: 550.00 },
    { curso: 'Bajo Individual 1', costo: 1280.00, clave: 'BI', iva: 0.15, recargo: 850.00 },
    { curso: 'Bajo Individual 2', costo: 1280.00, clave: 'BE', iva: 0.15, recargo: 850.00 },
    { curso: 'Bajo Individual 3', costo: 1150.00, clave: 'BI', iva: 0.15, recargo: 850.00 },
    { curso: 'Bajo Individual 4', costo: 1280.00, clave: 'BI', iva: 0.15, recargo: 850.00 },
    { curso: 'Bajo Individual 5', costo: 1280.00, clave: 'BI', iva: 0.15, recargo: 850.00 },
    { curso: 'Bajo Individual 6', costo: 1280.00, clave: 'BI', iva: 0.15, recargo: 850.00 },
    { curso: 'BALLET', costo: 400.00, clave: 'BA', iva: 0.16, recargo: 0.00 },
    { curso: 'BALLET SCALA NIÑOS', costo: 400.00, clave: 'BS', iva: 0, recargo: 0.00 },
    { curso: 'Bateria 1', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00 },
    { curso: 'Bateria 2', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00 },
    { curso: 'Bateria 3', costo: 770.00, clave: 'BA', iva: 0.15, recargo: 550.00 }
];

// Mostrar fecha actual
function mostrarFecha() {
    const ahora = new Date();
    const dia = ahora.getDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[ahora.getMonth()];
    const anio = ahora.getFullYear();
    
    document.getElementById('fecha').textContent = `${dia}-${mes}-${anio}`;
}

// Cargar cursos en la tabla
function cargarCursos() {
    const tbody = document.getElementById('tablaCursos');
    tbody.innerHTML = '';
    
    cursos.forEach(curso => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curso.curso}</td>
            <td>$${curso.costo.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>${curso.clave}</td>
            <td>${curso.iva.toFixed(2)}</td>
            <td>$${curso.recargo.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar
mostrarFecha();
cargarCursos();
