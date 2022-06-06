const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: '#18182A',
		webPreferences: {
			nodeIntegration: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
		},
	});

	win.loadFile(`index.html`);
}

ipcMain.on('notify', (_, message) => {
	new Notification({ title: 'Notifiation', body: message }).show();
});

app.whenReady().then(createWindow);

require('electron-reload')(__dirname, {
	// Note that the path to electron may vary according to the main file
	electron: require(`${__dirname}/node_modules/electron`),
});
