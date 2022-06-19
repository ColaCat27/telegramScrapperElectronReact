const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const { TelegramClient, Api, client } = require("telegram");
const { StringSession } = require("telegram/sessions/index.js");
const XLSX = require("xlsx");
const fs = require("fs");

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#18182A",
    webPreferences: {
      nodeIntegration: true,
      // worldSafeExecuteJavaScript: true,
      contextIsolation: false,
    },
  });

  win.loadFile(`index.html`);
  return win;
}

app.whenReady().then(async () => {
  const win = await createWindow();

  ipcMain.on("login", async (e, message) => {
    const { id, hash } = message;

    login(id, hash, win);
  });

  ipcMain.on("start", async (e, message) => {
    const { group, id, hash, session } = message;

    const stringSession = new StringSession(session);

    const client = new TelegramClient(stringSession, id, hash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => {
        win.webContents.send("data-correct", true);
        return await new Promise((resolve, reject) => {
          ipcMain.on("phone", (_, message) => {
            resolve(message.phone);
          });
        });
      },
      password: async () => {
        return await new Promise((resolve, reject) => {
          ipcMain.on("password", (_, message) => {
            resolve(message.password);
          });
        });
      },
      phoneCode: async () => {
        win.webContents.send("phone-correct", true);
        return await new Promise((resolve, reject) => {
          ipcMain.on("code", (_, message) => {
            resolve(message.code);
          });
        });
      },
      onError: (err) => {
        const errorType = err.errorMessage;
        switch (errorType) {
          case "PHONE_NUMBER_INVALID":
            win.webContents.send("phone-correct", false);
            break;
          case "PHONE_CODE_INVALID":
            win.webContents.send("code-correct", false);
          default:
            console.log(errorType);
            break;
        }
      },
    });

    //Получаем количество пользователей на канале
    const amount = await checkChannel(group, client);
    win.webContents.send("amount", amount);

    //Получаем данные о текущем юзере для отображения в программе
    // const result = await client.invoke(
    // 	new Api.users.GetFullUser({
    // 		id: 'me',
    // 	})
    // );
    // const user = result.users[0];

    let counter = 0;
    let data = [];

    //Если нету пользователей на канале отправляем ошибку
    if (!amount) {
      win.webContents.send("channel-error");
    }

    //Цикл который получает данные и отправляет на клиент
    while (counter < amount) {
      counter = await getData(counter, win, client, group);
      console.log("sleep 2000 ms");
      await sleep(2000);
      console.log("awake");
    }

    //Записываем результат и останавливаем программу

    await writeResult(data, group);
    win.webContents.send("stop");
    win.webContents.send("clear-group");

    function writeResult(data, channelLink) {
      let ws;
      try {
        ws = XLSX.utils.aoa_to_sheet([
          ["Имя", "Фамилия", "Юзернейм", "Телефон"],
        ]);
        XLSX.utils.sheet_add_aoa(ws, data, { origin: -1 });

        XLSX.utils.sheet_to_csv(ws);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "WorksheetName");
        XLSX.writeFile(wb, `${__dirname}/${channelLink}.xlsx`);
        console.log("Результат записан");
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

      await win.webContents.send("data", {
        counter: counter,
        data: result.users,
      });

      for (var j = 0; j < 100; j++) {
        user = result.users[j];
        try {
          data.push([user.firstName, user.lastName, user.username, user.phone]);
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
  let stringSession = new StringSession("");
  let client;
  try {
    client = new TelegramClient(stringSession, identif, hash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => {
        win.webContents.send("data-correct", true);
        return await new Promise((resolve, reject) => {
          ipcMain.on("phone", (_, message) => {
            resolve(message.phone);
          });
        });
      },
      password: async () => {
        return await new Promise((resolve, reject) => {
          ipcMain.on("password", (_, message) => {
            resolve(message.password);
          });
        });
      },
      phoneCode: async () => {
        win.webContents.send("phone-correct", true);
        return await new Promise((resolve, reject) => {
          ipcMain.on("code", (_, message) => {
            resolve(message.code);
          });
        });
      },
      onError: (err) => {
        const errorType = err.errorMessage;
        switch (errorType) {
          case "PHONE_NUMBER_INVALID":
            win.webContents.send("phone-correct", false);
            break;
          case "PHONE_CODE_INVALID":
            win.webContents.send("code-correct", false);
          default:
            console.log(errorType);
            break;
        }
      },
    });
    win.webContents.send("code-correct", true);

    const session = client.session.save();

    win.webContents.send("login-success", session);

    ipcMain.on("destroy", () => {
      client.destroy();
    });
  } catch (err) {
    win.webContents.send("data-correct", false);
  }
};

// ipcMain.on("notify", (_, message) => {
//   new Notification({ title: message.title, body: message.body }).show();
//   ipcMain.removeListener("notify");
// });

require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});
