const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const { is } = require('electron-util');
const isDev = require('electron-is-dev');
const unhandled = require('electron-unhandled');
const getAvailablePort = require('get-port');
const { config } = require('mardi-shared');
const server = require('mardi-server').default;
unhandled();

if (isDev) {
  const contextMenu = require('electron-context-menu');
  contextMenu();
}

const debug = require('electron-debug');
debug({ showDevTools: false });

let mainWindow;

async function getPort() {
  const { defaultServerPort } = config;
  if (isDev) {
    return defaultServerPort;
  }
  return await getAvailablePort({ port: defaultServerPort });
}

async function startServer() {
  const port = await getPort();
  if (!isDev) {
    server({ port });
  }
  return port;
}

async function createWindow() {
  const serverPort = await startServer();
  mainWindow = new BrowserWindow({
    width: 720,
    height: 520,
    // hasShadow: true,
    frame: false,
    // alwaysOnTop: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    transparent: true,
  });
  const url = isDev
    ? 'http://localhost:3456'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(`${url}?server-port=${serverPort}`);
  mainWindow.on('closed', () => (mainWindow = null));
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
