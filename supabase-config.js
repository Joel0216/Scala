// Configuración de Supabase
const SUPABASE_URL = 'https://vqsduyfkgdqnigzkxazk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2R1eWZrZ2Rxbmlnemt4YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIyOTMsImV4cCI6MjA4NDYwODI5M30.l5bZubjb3PIvcFG43JTfoeguldEwwIK7wlnOnl-Ec5o';

// Cliente de Supabase (se inicializará cuando se cargue la librería)
let supabase = null;

// Función para inicializar Supabase
// Funciona tanto con CDN (navegador) como con npm (Electron)
function initSupabase() {
    try {
        // Intentar usar la versión CDN primero (window.supabase)
        if (typeof window !== 'undefined' && typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase inicializado correctamente (CDN)');
            return true;
        }
        
        // Si no está disponible, intentar con require (Electron con npm)
        if (typeof require !== 'undefined') {
            try {
                const { createClient } = require('@supabase/supabase-js');
                supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase inicializado correctamente (npm)');
                return true;
            } catch (e) {
                console.warn('No se pudo cargar Supabase vía npm:', e.message);
            }
        }
        
        console.error('La librería de Supabase no está disponible');
        return false;
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
        return false;
    }
}

// Funciones de base de datos

// Obtener todos los alumnos
async function getAlumnos() {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        return null;
    }
}

// Obtener todos los maestros
async function getMaestros() {
    try {
        const { data, error } = await supabase
            .from('maestros')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener maestros:', error);
        return null;
    }
}

// Obtener todos los cursos
async function getCursos() {
    try {
        const { data, error } = await supabase
            .from('cursos')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        return null;
    }
}

// Obtener todos los grupos
async function getGrupos() {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        return null;
    }
}

// Insertar un nuevo alumno
async function insertAlumno(alumnoData) {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .insert([alumnoData])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al insertar alumno:', error);
        return null;
    }
}

// Actualizar un alumno
async function updateAlumno(id, alumnoData) {
    try {
        const { data, error } = await supabase
            .from('alumnos')
            .update(alumnoData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        return null;
    }
}

// Eliminar un alumno
async function deleteAlumno(id) {
    try {
        const { error } = await supabase
            .from('alumnos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        return false;
    }
}

// Obtener reportes
async function getReportes() {
    try {
        const { data, error } = await supabase
            .from('reportes')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        return null;
    }
}

// Ejecutar query personalizado para reportes
async function executeReportQuery(query) {
    try {
        const { data, error } = await supabase.rpc('execute_query', { query_text: query });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al ejecutar query:', error);
        return null;
    }
}
