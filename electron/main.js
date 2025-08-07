const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar:true,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // For dev:
  win.loadURL('http://localhost:5173/Dashboard')

  // For production (later):
  // win.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
