// seguridad.js - Módulo de Seguridad

// Inicializar Supabase
let supabase = null;

// Esperar a que se cargue la librería de Supabase
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando seguridad...');
    
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
    
    console.log('Inicialización de seguridad completa');
});

// Actualizar fecha y hora
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

// Borrar Usuario
async function borrarUsuario() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const username = prompt('Ingrese el nombre de usuario a eliminar:');
    
    if (!username) {
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar el usuario "${username}"?`)) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('user_id', username);
        
        if (error) throw error;
        
        alert('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario: ' + error.message);
    }
}

// Usuario Nuevo
async function usuarioNuevo() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const username = prompt('Ingrese el nombre de usuario:');
    if (!username) return;
    
    const password = prompt('Ingrese la contraseña:');
    if (!password) return;
    
    const nombre = prompt('Ingrese el nombre completo:');
    if (!nombre) return;
    
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{
                user_id: username,
                password: password, // En producción, debe hashearse
                nombre: nombre,
                activo: true
            }])
            .select();
        
        if (error) throw error;
        
        alert('Usuario creado correctamente');
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario: ' + error.message);
    }
}

// Restricciones (Permisos)
async function restricciones() {
    alert('Módulo de Restricciones\n\nEsta funcionalidad permite configurar permisos por usuario:\n- Acceso a módulos\n- Permisos de lectura/escritura\n- Restricciones por horario\n\nEn desarrollo...');
}

// Cambiar Password
async function cambiarPassword() {
    if (!supabase) {
        alert('Error: Base de datos no conectada');
        return;
    }
    
    const username = prompt('Ingrese el nombre de usuario:');
    if (!username) return;
    
    const oldPassword = prompt('Ingrese la contraseña actual:');
    if (!oldPassword) return;
    
    try {
        // Verificar contraseña actual
        const { data: usuario, error: errorVerif } = await supabase
            .from('usuarios')
            .select('*')
            .eq('user_id', username)
            .eq('password', oldPassword)
            .single();
        
        if (errorVerif || !usuario) {
            alert('Usuario o contraseña incorrectos');
            return;
        }
        
        const newPassword = prompt('Ingrese la nueva contraseña:');
        if (!newPassword) return;
        
        const confirmPassword = prompt('Confirme la nueva contraseña:');
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Actualizar contraseña
        const { error } = await supabase
            .from('usuarios')
            .update({ password: newPassword })
            .eq('user_id', username);
        
        if (error) throw error;
        
        alert('Contraseña actualizada correctamente');
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        alert('Error al cambiar contraseña: ' + error.message);
    }
}
