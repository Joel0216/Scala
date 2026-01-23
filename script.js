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
    document.getElementById('datetime').textContent = dateTimeString;
}

// Exit system function
function exitSystem() {
    if (confirm('¿Deseas abandonar el sitio?\n\nEs posible que los cambios que implementaste no se puedan guardar.')) {
        window.close();
        
        // Si window.close() no funciona (por restricciones del navegador)
        // redirigir a una página en blanco
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 500);
    }
}

// Initialize
updateDateTime();
setInterval(updateDateTime, 1000);
