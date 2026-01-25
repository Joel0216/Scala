// preload.js - Script de precarga para Electron
// Este archivo se ejecuta antes de cargar la página y proporciona
// un puente seguro entre el proceso principal y el renderizador

const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al contexto del renderizador
contextBridge.exposeInMainWorld('electronAPI', {
    // Información del sistema
    platform: process.platform,
    
    // Navegación
    navigateTo: (page) => {
        window.location.href = page;
    },
    
    // Notificaciones
    showNotification: (title, body) => {
        new Notification(title, { body });
    },
    
    // Versión de Electron
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
});

// Configurar el entorno para que Supabase funcione correctamente
window.addEventListener('DOMContentLoaded', () => {
    console.log('Electron Preload: Página cargada');
    console.log('Node version:', process.versions.node);
    console.log('Chrome version:', process.versions.chrome);
    console.log('Electron version:', process.versions.electron);
});
