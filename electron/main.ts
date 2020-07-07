import AWS from 'aws-sdk';

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import profiles from './services/profiles';
import credential from './services/credential';
import dynamoTables from './services/dynamoTables';
import queryTable from './services/queryTable';
import describeTable from './services/describeTable';
import scanTable from './services/scanTable';

let mainWindow: Electron.BrowserWindow | null;
let currentProfile: string;
const region = process.env.AWS_REGION || 'ap-southeast-2';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:4000`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // mainWindow.maximize();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('account-profiles-request', (event) => {
  profiles()
    // eslint-disable-next-line promise/always-return
    .then((value) => {
      event.reply('account-profiles-reply', value);
    })
    .catch((reason) => {
      event.reply('account-profiles-reply', reason);
    });
});

ipcMain.on('profile-select', (event, args) => {
  currentProfile = args;
  AWS.config.credentials = credential({ profile: currentProfile });
  AWS.config.region = region;

  // List all tables
  dynamoTables()
    // eslint-disable-next-line promise/always-return
    .then((value) => {
      event.reply('table-list', value);
    })
    .catch((reason) => {
      event.reply('table-list', reason.message);
    });
});

ipcMain.on('table-select', (event, args) => {
  describeTable({
    name: args,
  })
    // eslint-disable-next-line promise/always-return
    .then((value) => {
      event.reply('table-data', JSON.stringify(value));
    })
    .catch((reason) => {
      event.reply('table-data', reason.message);
    });
});

ipcMain.on('query-execute', (event, args) => {
  const { name, queryJson, exclusiveStartKey } = args;
  try {
    const query = JSON.parse(queryJson);
    const queryTableName = query.TableName || name;
    queryTable({
      name: queryTableName,
      query: {
        ...query,
        ExclusiveStartKey: exclusiveStartKey
          ? JSON.parse(exclusiveStartKey)
          : undefined,
      },
    })
      // eslint-disable-next-line promise/always-return
      .then((value) => {
        event.reply('query-data', {
          name: queryTableName,
          // eslint-disable-next-line promise/always-return
          data: value.Items || [{ count: value.Count }],
          lastEvaluatedKey: JSON.stringify(value.LastEvaluatedKey),
          queryInfo: JSON.stringify(value),
        });
      })
      .catch((reason) => {
        event.reply('query-data', reason.message);
      });
  } catch (e) {
    event.reply('query-data', e.message);
  }
});

ipcMain.on('scan-execute', (event, args) => {
  const { name, scanJson, exclusiveStartKey } = args;
  try {
    const scan = JSON.parse(scanJson);
    scanTable({
      name,
      scan: {
        ...scan,
        ExclusiveStartKey: exclusiveStartKey
          ? JSON.parse(exclusiveStartKey)
          : undefined,
      },
    })
      // eslint-disable-next-line promise/always-return
      .then((value) => {
        event.reply('scan-data', {
          name,
          // eslint-disable-next-line promise/always-return
          data: value.Items || [{ count: value.Count }],
          lastEvaluatedKey: JSON.stringify(value.LastEvaluatedKey),
          queryInfo: JSON.stringify(value),
        });
      })
      .catch((reason) => {
        event.reply('scan-data', reason.message);
      });
  } catch (e) {
    event.reply('scan-data', e.message);
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.allowRendererProcessReuse = true;
