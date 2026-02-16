const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

// --- SHORTCUT ---
const shortcut = 'CommandOrControl+Shift+Space'

// --- WINDOW ---
// Create
function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // create window
  const windowWidth = 600;
  const windowHeight = 250;
  const x = Math.floor((width - windowWidth) / 2);
  const y = Math.floor((height - windowHeight) / 2);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    frame: false, // Borderless window
    transparent: false,
    resizable: true,
    skipTaskbar: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // hide window initially
  mainWindow.hide();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // hide window when it loses focus
  mainWindow.on('blur', () => {
    mainWindow.hide();
  });
}

// Toggle
function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcut
  const ret = globalShortcut.register(shortcut, () => {
    toggleWindow();

    opeenDevTools();
  });

  if (!ret) {
    console.log('Registration failed');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});
