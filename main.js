const { app, BrowserWindow } = require('electron')
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('index.html')
    if (JSON.parse(require('fs').readFileSync('./settings.json', 'utf8'))['devmode'] == false) {
        win.kiosk = true
    }
}
app.whenReady().then(() => {
    createWindow()
})