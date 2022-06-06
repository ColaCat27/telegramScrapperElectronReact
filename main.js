const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions/index.js');
const fs = require('fs');
const path = require('path');

const isDev = !app.isPackaged;

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
}

ipcMain.on('login', (_, message) => {
	const { id, hash } = message;

	const start = async () => {
		let stringSession = new StringSession('');

		const client = new TelegramClient(stringSession, id, hash, {
			connectionRetries: 5,
		});
		await client.start({
			phoneNumber: async () =>
				await input.text('Введите мобильный номер: '),
			password: async () => await input.text('Введите пароль: '),
			phoneCode: async () => await input.text('Введите полученный код: '),
			onError: (err) => console.log(err),
		});
	};
});

// ipcMain.on('notify', (_, message) => {
// 	new Notification({ title: 'Notifiation', body: message }).show();
// });

app.whenReady().then(createWindow);

require('electron-reload')(__dirname, {
	// Note that the path to electron may vary according to the main file
	electron: require(`${__dirname}/node_modules/electron`),
});

// let stringSession;

// (async () => {
// 	console.log('Загрузка телеграм...');

// 	const isExist = fs.existsSync(`./sessions/${apiHash}/session`);
// 	if (isExist) {
// 		const session = fs.readFileSync(`./sessions/${apiHash}/session`, {
// 			encoding: 'utf-8',
// 		});
// 		stringSession = new StringSession(session); // fill this later with the value from session.save()
// 	} else {
// 		stringSession = new StringSession('');
// 		console.log('Session not exist');
// 	}

// const client = new TelegramClient(
// 	stringSession,
// 	process.env.API_ID,
// 	process.env.API_HASH,
// 	{
// 		connectionRetries: 5,
// 	}
// );
// 	await client.start({
// 		phoneNumber: async () => await input.text('Введите мобильный номер: '),
// 		password: async () => await input.text('Введите пароль: '),
// 		phoneCode: async () => await input.text('Введите полученный код: '),
// 		onError: (err) => console.log(err),
// 	});
// 	console.log('Успешно подключен к аккаунту');
// 	fs.writeFileSync(`./sessions/${apiHash}/session`, client.session.save());

// 	const channelLink = await input.text('Введите ссылку на канал');

// 	let amount = await client.invoke(
// 		new Api.channels.GetParticipants({
// 			channel: channelLink,
// 			filter: new Api.ChannelParticipantsRecent({}),
// 			offset: 43,
// 			limit: 1,
// 			hash: 0,
// 		})
// 	);

// 	amount = amount.count;
// 	let result;
// 	let data = [];
// 	console.log(amount);

// 	try {
// 		let i = 0;
// 		let id = setInterval(async () => {
// 			i += 100;

// 			if (i >= amount) {
// 				clearInterval(id);
// 				var ws = XLSX.utils.aoa_to_sheet([
// 					['Имя', 'Фамилия', 'Юзернейм', 'Телефон'],
// 				]);
// 				XLSX.utils.sheet_add_aoa(ws, data, { origin: -1 });

// 				XLSX.utils.sheet_to_csv(ws);
// 				var wb = XLSX.utils.book_new();
// 				XLSX.utils.book_append_sheet(wb, ws, 'WorksheetName');
// 				XLSX.writeFile(wb, `${__dirname}/${channelLink}.xlsx`);
// 				console.log('Парсинг завершен');
// 			} else {
// 				result = await client.invoke(
// 					new Api.channels.GetParticipants({
// 						channel: channelLink,
// 						filter: new Api.ChannelParticipantsRecent({}),
// 						offset: i,
// 						limit: 100,
// 						hash: 0,
// 					})
// 				);
// 				let user;
// 				for (var j = 0; j < 100; j++) {
// 					user = result.users[j];
// 					try {
// 						data.push([
// 							user.firstName,
// 							user.lastName,
// 							user.username,
// 							user.phone,
// 						]);
// 					} catch (err) {}
// 				}
// 			}
// 		}, 1500);
// 	} catch (err) {
// 		console.log('Выполнение завершено');
// 	}
// })();
