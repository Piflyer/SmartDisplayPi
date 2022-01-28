const { app, BrowserWindow } = require('electron')
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
    if (JSON.parse(require('fs').readFileSync('./settings.json', 'utf8'))['devmode'] == false) {
        win.kiosk = true
    }
    const contents = win.webContents
    console.log(contents)
}
app.whenReady().then(() => {
    createWindow()
})