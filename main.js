const { app, BrowserWindow } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    })

    win.loadFile('index.html')
    const Store = require('electron-store');
    const settings = new Store();
    if (settings.get("devMode", false) == false) {
        win.kiosk = true
    }
    else {
        win.openDevTools();
    }
}
app.whenReady().then(() => {
    createWindow();
});
