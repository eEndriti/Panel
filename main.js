const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame:true,
    autoHideMenuBar:true
  })

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)
