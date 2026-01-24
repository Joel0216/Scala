const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Variable para mantener referencia a la ventana
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'Scala logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // Permitir conexiones externas (Supabase)
      webSecurity: true
    },
    // Configuración de la ventana
    autoHideMenuBar: true, // Ocultar menú automáticamente
    frame: true, // Mantener frame de Windows
    backgroundColor: '#ffffff'
  });

  // Quitar completamente el menú de la aplicación
  Menu.setApplicationMenu(null);

  // Cargar el archivo index.html
  mainWindow.loadFile('index.html');

  // Abrir DevTools en modo desarrollo (comentar en producción)
  // mainWindow.webContents.openDevTools();

  // Manejar el cierre de la ventana
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Prevenir que se abran nuevas ventanas (seguridad)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Permitir URLs de Supabase
    if (url.includes('supabase.co') || url.includes('supabase.com')) {
      return { action: 'allow' };
    }
    // Bloquear otras ventanas externas
    return { action: 'deny' };
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error al cargar:', errorDescription);
  });
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // En macOS es común recrear una ventana cuando se hace clic en el icono
    // del dock y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Configuración adicional para permitir conexiones externas
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// Manejar certificados SSL (para Supabase)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Verificar que sea una URL de Supabase
  if (url.includes('supabase.co') || url.includes('supabase.com')) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
