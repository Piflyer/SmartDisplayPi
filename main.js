const { app, BrowserWindow, Menu } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
        }
    })

    win.loadFile('index.html');
    const Store = require('electron-store');
    const settings = new Store();
    var template;
    if (settings.get("devMode", false) === false) {
        win.kiosk = true
        template = [
            {
                label: 'Loading...',
            }
        ];
    }
    else {
        win.openDevTools();
        template = [
            {
                label: '[DEV MODE]',
                submenu: [
                    {
                        label: 'Toggle Dev Tools',
                        accelerator: 'F12',
                        click: function (item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.toggleDevTools();
                            }
                        }
                    },
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: function (item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.reload();
                            }
                        }
                    }
                ]
            },
        ];
    }
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
app.whenReady().then(() => {
    createWindow();
});
