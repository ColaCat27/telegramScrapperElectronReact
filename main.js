const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const { TelegramClient, Api, client } = require('telegram');
const { StringSession } = require('telegram/sessions/index.js');
const fs = require('fs');
const input = require('input');
const path = require('path');
const XLSX = require('xlsx');
const isDev = !app.isPackaged;

const sleep = (ms) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
};

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: '#18182A',
		webPreferences: {
			nodeIntegration: true,
			// worldSafeExecuteJavaScript: true,
			contextIsolation: false,
		},
	});

	win.loadFile(`index.html`);
	return win;
}

// ipcMain.on('notify', (_, message) => {
// 	new Notification({ title: 'Notifiation', body: message }).show();
// });

app.whenReady().then(async () => {
	const win = await createWindow();

	ipcMain.on('login', async (e, message) => {
		const { id, hash } = message;

		login(id, hash, win);
	});

	ipcMain.on('start', async (e, message) => {
		const { group, session } = message;
		let id = 5146593;
		let hash = 'fd90930b9ff6ced645baf18e28ac61a8';

		const stringSession = new StringSession(session);

		const client = new TelegramClient(stringSession, id, hash, {
			connectionRetries: 5,
		});

		await client.start({
			phoneNumber: async () => {
				win.webContents.send('data-correct', true);
				return await new Promise((resolve, reject) => {
					ipcMain.on('phone', (_, message) => {
						resolve(message.phone);
					});
				});
			},
			password: async () => {
				return await new Promise((resolve, reject) => {
					ipcMain.on('password', (_, message) => {
						resolve(message.password);
					});
				});
			},
			phoneCode: async () => {
				win.webContents.send('phone-correct', true);
				return await new Promise((resolve, reject) => {
					ipcMain.on('code', (_, message) => {
						resolve(message.code);
					});
				});
			},
			onError: (err) => {
				const errorType = err.errorMessage;
				switch (errorType) {
					case 'PHONE_NUMBER_INVALID':
						win.webContents.send('phone-correct', false);
						break;
					case 'PHONE_CODE_INVALID':
						win.webContents.send('code-correct', false);
					default:
						console.log(errorType);
						break;
				}
			},
		});

		const amount = await checkChannel(group, client);
		win.webContents.send('amount', amount);

		let counter = 0;
		let data = [];

		if (!amount) {
			win.webContents.send('channel-error');
		}

		while (counter < amount) {
			counter = await getData(counter, win, client, group);
			console.log('sleep 2000 ms');
			await sleep(2000);
			console.log('awake');
		}

		await writeResult(data, group);
		win.webContents.send('stop');
		win.webContents.send('clear-group');

		function writeResult(data, channelLink) {
			let ws;
			try {
				ws = XLSX.utils.aoa_to_sheet([
					['Имя', 'Фамилия', 'Юзернейм', 'Телефон'],
				]);
				XLSX.utils.sheet_add_aoa(ws, data, { origin: -1 });

				XLSX.utils.sheet_to_csv(ws);
				let wb = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(wb, ws, 'WorksheetName');
				XLSX.writeFile(wb, `${__dirname}/${channelLink}.xlsx`);
				console.log('Результат записан');
			} catch (err) {
				console.log(err);
			}
		}

		async function getData(counter, win, client, channelLink) {
			result = await client.invoke(
				new Api.channels.GetParticipants({
					channel: channelLink,
					filter: new Api.ChannelParticipantsRecent({}),
					offset: counter,
					limit: 100,
					hash: 0,
				})
			);
			let user;

			await win.webContents.send('data', {
				counter: counter,
				data: result.users,
			});

			for (var j = 0; j < 100; j++) {
				user = result.users[j];
				try {
					data.push([
						user.firstName,
						user.lastName,
						user.username,
						user.phone,
					]);
				} catch (err) {}
			}
			return counter + 100;
		}

		async function checkChannel(channelLink, client) {
			let amount = await client.invoke(
				new Api.channels.GetParticipants({
					channel: channelLink,
					filter: new Api.ChannelParticipantsRecent({}),
					offset: 43,
					limit: 1,
					hash: 0,
				})
			);

			return (amount = amount.count);
		}
	});
});

const login = async (id, hash, win) => {
	const identif = parseInt(id);
	let stringSession = new StringSession('');
	let client;
	try {
		client = new TelegramClient(stringSession, identif, hash, {
			connectionRetries: 5,
		});

		await client.start({
			phoneNumber: async () => {
				win.webContents.send('data-correct', true);
				return await new Promise((resolve, reject) => {
					ipcMain.on('phone', (_, message) => {
						resolve(message.phone);
					});
				});
			},
			password: async () => {
				return await new Promise((resolve, reject) => {
					ipcMain.on('password', (_, message) => {
						resolve(message.password);
					});
				});
			},
			phoneCode: async () => {
				win.webContents.send('phone-correct', true);
				return await new Promise((resolve, reject) => {
					ipcMain.on('code', (_, message) => {
						resolve(message.code);
					});
				});
			},
			onError: (err) => {
				const errorType = err.errorMessage;
				switch (errorType) {
					case 'PHONE_NUMBER_INVALID':
						win.webContents.send('phone-correct', false);
						break;
					case 'PHONE_CODE_INVALID':
						win.webContents.send('code-correct', false);
					default:
						console.log(errorType);
						break;
				}
			},
		});
		win.webContents.send('code-correct', true);

		const session = client.session.save();

		win.webContents.send('login-success', session);

		if (!fs.existsSync(`${__dirname}/sessions`)) {
			fs.mkdirSync(`${__dirname}/sessions`);
		}

		fs.writeFileSync(`${__dirname}/sessions/session`, session);

		ipcMain.on('destroy', () => {
			client.destroy();
		});
	} catch (err) {
		win.webContents.send('data-correct', false);
	}
};

require('electron-reload')(__dirname, {
	// Note that the path to electron may vary according to the main file
	electron: require(`${__dirname}/node_modules/electron`),
});
