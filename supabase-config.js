// Configuración de Supabase para Electron
const SUPABASE_URL = 'https://vqsduyfkgdqnigzkxazk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIyOTMsImV4cCI6MjA4NDYwODI5M30.l5bZubjb3PIvcFG43JTfoeguldEwwIK7wlnOnl-Ec5o';

let supabase = null;
let supabaseConectado = false;

// Inicializar inmediatamente
(function inicializarSupabase() {
    console.log('=== INICIALIZANDO SUPABASE ===');
    
    try {
        // Verificar si require está disponible
        if (typeof require === 'undefined') {
            console.error('ERROR: require no está disponible');
            return;
        }
        
        console.log('require disponible, cargando módulo...');
        
        // Cargar el módulo
        const supabaseModule = require('@supabase/supabase-js');
        console.log('Módulo cargado:', supabaseModule);
        
        if (!supabaseModule || !supabaseModule.createClient) {
            console.error('ERROR: createClient no encontrado en el módulo');
            return;
        }
        
        // Crear cliente
        supabase = supabaseModule.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        supabaseConectado = true;
        
        console.log('✓ SUPABASE CONECTADO EXITOSAMENTE');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('supabaseReady', { detail: { supabase } }));
        
    } catch (error) {
        console.error('ERROR CRÍTICO al inicializar Supabase:', error);
        console.error('Stack:', error.stack);
    }
})();

// Funciones de acceso
function isSupabaseConnected() {
    return supabaseConectado && supabase !== null;
}

function waitForSupabase(timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (isSupabaseConnected()) {
            resolve(supabase);
            return;
        }
        
        // Esperar un poco y verificar de nuevo
        let elapsed = 0;
        const interval = setInterval(() => {
            elapsed += 100;
            if (isSupabaseConnected()) {
                clearInterval(interval);
                resolve(supabase);
            } else if (elapsed >= timeout) {
                clearInterval(interval);
                reject(new Error('Timeout esperando Supabase'));
            }
        }, 100);
    });
}

function getSupabase() {
    return supabase;
}

// Exportar globalmente
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.supabase = supabase;
window.isSupabaseConnected = isSupabaseConnected;
window.waitForSupabase = waitForSupabase;
window.getSupabase = getSupabase;

console.log('supabase-config.js cargado. Conectado:', supabaseConectado);
