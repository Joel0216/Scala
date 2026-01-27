// Inicializar Supabase
let supabase = null;

// Esperar a que se cargue la librería de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando caja...');
    
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
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('Inicialización de caja completa');
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
    // Botón Cobros
    const cobrosBtn = document.querySelector('.top-left');
    if (cobrosBtn) {
        cobrosBtn.addEventListener('click', () => {
            alert('Módulo de COBROS en desarrollo');
        });
    }

    // Botón Recibos Cancelados
    const recibosCanceladosBtn = document.querySelector('.top-right');
    if (recibosCanceladosBtn) {
        recibosCanceladosBtn.addEventListener('click', () => {
            alert('Módulo de RECIBOS CANCELADOS en desarrollo');
        });
    }

    // Botón Consulta y Bajas
    const consultaBajasBtn = document.querySelector('.center-btn');
    if (consultaBajasBtn) {
        consultaBajasBtn.addEventListener('click', () => {
            alert('Módulo de CONSULTA Y BAJAS en desarrollo');
        });
    }

    // Botón Corte 1
    const corte1Btn = document.querySelector('.bottom-left');
    if (corte1Btn) {
        corte1Btn.addEventListener('click', () => {
            alert('Reporte CORTE 1 en desarrollo');
        });
    }

    // Botón Corte 2
    const corte2Btn = document.querySelector('.bottom-center');
    if (corte2Btn) {
        corte2Btn.addEventListener('click', () => {
            alert('Reporte CORTE 2 en desarrollo');
        });
    }

    // Botón Corte 3
    const corte3Btn = document.querySelector('.bottom-right');
    if (corte3Btn) {
        corte3Btn.addEventListener('click', () => {
            alert('Reporte CORTE 3 en desarrollo');
        });
    }

    // Botón Terminar
    const terminarBtn = document.querySelector('.exit-btn');
    if (terminarBtn) {
        terminarBtn.addEventListener('click', terminarCaja);
    }
}

// Funciones para botones (también disponibles como onclick)
function irACobros() {
    alert('Módulo de COBROS en desarrollo');
    // window.location.href = 'cobros.html';
}

function irARecibosCancelados() {
    alert('Módulo de RECIBOS CANCELADOS en desarrollo');
    // window.location.href = 'recibos-cancelados.html';
}

function irAConsultaBajas() {
    alert('Módulo de CONSULTA Y BAJAS en desarrollo');
    // window.location.href = 'consulta-bajas.html';
}

function generarCorte1() {
    alert('Reporte CORTE 1 en desarrollo');
    // Aquí se generaría el reporte
}

function generarCorte2() {
    alert('Reporte CORTE 2 en desarrollo');
    // Aquí se generaría el reporte
}

function generarCorte3() {
    alert('Reporte CORTE 3 en desarrollo');
    // Aquí se generaría el reporte
}

function terminarCaja() {
    if (confirm('¿Desea salir del módulo de Caja?')) {
        window.location.href = 'index.html';
    }
}
