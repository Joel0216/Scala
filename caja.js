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

// Botón Cobros
document.querySelector('.top-left').addEventListener('click', () => {
    alert('Módulo de COBROS en desarrollo');
});

// Botón Recibos Cancelados
document.querySelector('.top-right').addEventListener('click', () => {
    alert('Módulo de RECIBOS CANCELADOS en desarrollo');
});

// Botón Consulta y Bajas
document.querySelector('.center-btn').addEventListener('click', () => {
    alert('Módulo de CONSULTA Y BAJAS en desarrollo');
});

// Botón Corte 1
document.querySelector('.bottom-left').addEventListener('click', () => {
    alert('Reporte CORTE 1 en desarrollo');
});

// Botón Corte 2
document.querySelector('.bottom-center').addEventListener('click', () => {
    alert('Reporte CORTE 2 en desarrollo');
});

// Botón Corte 3
document.querySelector('.bottom-right').addEventListener('click', () => {
    alert('Reporte CORTE 3 en desarrollo');
});

// Botón Terminar
document.querySelector('.exit-btn').addEventListener('click', () => {
    if (confirm('¿Desea salir del módulo de Caja?')) {
        window.location.href = 'index.html';
    }
});
