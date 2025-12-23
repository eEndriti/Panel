const { app, BrowserWindow, ipcMain,shell } = require('electron');
const path = require('path');
const db = require('./database.js');
const fs = require("fs");


function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar:true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // recommended
            nodeIntegration: false,
            contextIsolation: true
        }
    });
  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow);

// ====== IPC Handlers ======
ipcMain.on('savePDF', (event, { pdfBase64, folderPath, fileName }) => { const filePath = path.join(folderPath, fileName); const buffer = Buffer.from(pdfBase64, 'base64'); fs.writeFile(filePath, buffer, (error) => { if (error) { console.error('Failed to save PDF:', error); } else { console.log('PDF saved successfully to', filePath); } }); });

ipcMain.on('openFile', (event, filePath) => { shell.openPath(filePath) .then(() => console.log('File opened successfully')) .catch((error) => console.error('Failed to open file:', error)); });


// Perdoruesit
ipcMain.handle('get-perdoruesit', async () => await db.getPerdoruesit());
ipcMain.handle('create-perdorues', async (event, data) => await db.createPerdoruesit(data));
ipcMain.handle('update-perdorues', async (event, id, data) => await db.updatePerdoruesit(id, data));
ipcMain.handle('delete-perdorues', async (event, id) => await db.deletePerdoruesit(id));

// Klientet
ipcMain.handle('get-klientet', async () => await db.getKlientet());
ipcMain.handle('create-klient', async (event, data) => await db.createKlient(data));
ipcMain.handle('update-klient', async (event, id, data) => await db.updateKlient(id, data));
ipcMain.handle('delete-klient', async (event, id) => await db.deleteKlient(id));

// Produktet
ipcMain.handle('get-produktet', async () => await db.getProduktet());
ipcMain.handle('create-produkt', async (event, data) => await db.createProdukt(data));
ipcMain.handle('update-produkt', async (event, id, data) => await db.updateProdukt(id, data));
ipcMain.handle('delete-produkt', async (event, id) => await db.deleteProdukt(id));

// Faturat
ipcMain.handle('get-faturat', async () => await db.getFaturat());
ipcMain.handle('getFaturaMeId', async (event,id) => await db.getFaturaMeId(id));
ipcMain.handle('create-fature', async (event, data) => await db.createFature(data));
ipcMain.handle('update-fature', async (event, id, data) => await db.updateFature(id, data));
ipcMain.handle('delete-fature', async (event, id) => await db.deleteFature(id));
ipcMain.handle('getNrPaPaguar', async () => await db.getNrPaPaguar());
ipcMain.handle('getInvoiceNr', async () => await db.getInvoiceNr());

// Transaksionet
ipcMain.handle('get-transaksionet', async () => await db.getTransaksionet());
ipcMain.handle('create-transaksion', async (event, data) => await db.createTransaksion(data));
ipcMain.handle('update-transaksion', async (event, id, data) => await db.updateTransaksion(id, data));
ipcMain.handle('delete-transaksion', async (event, id) => await db.deleteTransaksion(id));

// Kompania
ipcMain.handle('get-kompania', async () => await db.getKompania());
ipcMain.handle('update-kompania', async (event, id, data) => await db.updateKompania(id, data));

// Parametrat
ipcMain.handle('get-parametrat', async () => await db.getParametrat());
ipcMain.handle('create-parametar', async (event, data) => await db.createParametar(data));
ipcMain.handle('update-parametar', async (event, id, data) => await db.updateParametar(id, data));
ipcMain.handle('delete-parametar', async (event, id) => await db.deleteParametar(id));
