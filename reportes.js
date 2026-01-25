// reportes.js - Módulo de Reportes

// Inicializar Supabase
let supabase = null;

// Esperar a que se cargue la librería de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando reportes...');
    
    // Inicializar Supabase
    if (typeof initSupabase === 'function') {
        const success = initSupabase();
        if (success) {
            supabase = window.supabase;
        } else {
            alert('Error: No se pudo conectar a la base de datos');
            return;
        }
    } else {
        alert('Error: initSupabase no está disponible');
        return;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    console.log('Inicialización de reportes completa');
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');
    
    const dateTimeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = dateTimeString;
    }
}

async function imprimirReporte() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const select = document.getElementById('reporteSelect');
    if (!select) {
        alert('Error: No se encontró el selector de reportes');
        return;
    }
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || !selectedOption.value) {
        alert('Por favor seleccione un reporte');
        return;
    }
    
    const reporteId = selectedOption.value;
    const reporteNombre = selectedOption.text;
    
    try {
        // Generar reporte según el tipo seleccionado
        let datos = null;
        
        switch(reporteId) {
            case 'alumnos_instrumento':
                datos = await generarReporteAlumnosInstrumento();
                break;
            case 'alumnos_medios':
                datos = await generarReporteAlumnosMedios();
                break;
            case 'colegiaturas_cobradas':
                datos = await generarReporteColegiaturas();
                break;
            case 'horarios':
                datos = await generarReporteHorarios();
                break;
            default:
                alert(`Reporte "${reporteNombre}" en desarrollo.\n\nEste reporte estará disponible próximamente.`);
                return;
        }
        
        if (datos) {
            mostrarReporte(reporteNombre, datos);
        }
    } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Error al generar reporte: ' + error.message);
    }
}

// Generar reporte de alumnos por instrumento
async function generarReporteAlumnosInstrumento() {
    if (!supabase) throw new Error('Base de datos no conectada');
    
    const { data, error } = await supabase
        .from('alumnos')
        .select('credencial1, nombre, instrumento')
        .eq('status', 'activo')
        .order('instrumento', { ascending: true })
        .order('nombre', { ascending: true });
    
    if (error) throw error;
    return data;
}

// Generar reporte de alumnos por medios
async function generarReporteAlumnosMedios() {
    if (!supabase) throw new Error('Base de datos no conectada');
    
    const { data, error } = await supabase
        .from('alumnos')
        .select('credencial1, nombre, medio_entero')
        .eq('status', 'activo')
        .order('medio_entero', { ascending: true })
        .order('nombre', { ascending: true });
    
    if (error) throw error;
    return data;
}

// Generar reporte de colegiaturas
async function generarReporteColegiaturas() {
    if (!supabase) throw new Error('Base de datos no conectada');
    
    const { data, error } = await supabase
        .from('colegiaturas')
        .select('*')
        .order('fecha_pago', { ascending: false })
        .limit(100);
    
    if (error) throw error;
    return data;
}

// Generar reporte de horarios
async function generarReporteHorarios() {
    if (!supabase) throw new Error('Base de datos no conectada');
    
    const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .order('dia', { ascending: true })
        .order('hora_entrada', { ascending: true });
    
    if (error) throw error;
    return data;
}

// Mostrar reporte en una nueva ventana
function mostrarReporte(titulo, datos) {
    // Crear ventana de reporte
    const ventana = window.open('', '_blank', 'width=800,height=600');
    
    if (!ventana) {
        alert('Por favor permita ventanas emergentes para ver el reporte');
        return;
    }
    
    // Generar HTML del reporte
    let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>${titulo}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background: white;
                }
                h1 {
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #2980b9;
                }
                td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                .fecha {
                    text-align: right;
                    color: #7f8c8d;
                    margin-bottom: 10px;
                }
                .total {
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 14px;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
                .btn-imprimir {
                    background-color: #3498db;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-bottom: 20px;
                }
                .btn-imprimir:hover {
                    background-color: #2980b9;
                }
            </style>
        </head>
        <body>
            <div class="no-print">
                <button class="btn-imprimir" onclick="window.print()">🖨️ Imprimir</button>
            </div>
            <h1>${titulo}</h1>
            <div class="fecha">Fecha: ${new Date().toLocaleDateString('es-MX')}</div>
            <table>
                <thead>
                    <tr>
    `;
    
    // Generar encabezados de tabla
    if (datos && datos.length > 0) {
        const keys = Object.keys(datos[0]);
        keys.forEach(key => {
            html += `<th>${key.replace(/_/g, ' ').toUpperCase()}</th>`;
        });
        html += `</tr></thead><tbody>`;
        
        // Generar filas de datos
        datos.forEach(row => {
            html += '<tr>';
            keys.forEach(key => {
                let value = row[key];
                // Formatear objetos anidados
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                }
                html += `<td>${value || ''}</td>`;
            });
            html += '</tr>';
        });
        
        html += `</tbody></table>`;
        html += `<div class="total">Total de registros: ${datos.length}</div>`;
    } else {
        html += `</tr></thead></table>`;
        html += `<p>No hay datos para mostrar</p>`;
    }
    
    html += `
        </body>
        </html>
    `;
    
    ventana.document.write(html);
    ventana.document.close();
}
