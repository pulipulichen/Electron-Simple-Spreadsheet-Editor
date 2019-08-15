
const path = require('path')
const url = require('url')
const fs = require('fs')

const readChunk = require('read-chunk')
const fileType = require('file-type')

// ------------

const {
  app,
  BrowserWindow,
} = require('electron')

const settings = require('electron-settings');

// ------------

app.on('ready', createWindow)

let mode = 'production'
if (process.argv.indexOf('--mode') - process.argv.indexOf('development') === -1) {
  mode = "development"
}
if (process.argv.indexOf('--file') > 1) {
  filepath = process.argv[(process.argv.indexOf('--file') + 1)]
  if (fs.existsSync(filepath)) {
    let buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
    let fileTypeResult = fileType(buffer)
    let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
    if ( (fileTypeResult === undefined && ext === 'csv')
            || (fileTypeResult.mime === 'application/x-msi' && ext === 'xls')
            || (fileTypeResult.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && ext === 'xlsx')
            || (fileTypeResult.mime === 'application/vnd.oasis.opendocument.spreadsheet' && ext === 'ods') ) {
      settings.set('filepath', filepath)
    }
  }
  //console.log(filepath)
}

//console.log(mode)
//mode = "development"
//mode = 'production'

app.on('window-all-closed', () => {
  // darwin = MacOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.commandLine.appendSwitch('disable-site-isolation-trials');

function createWindow() {
  
  let optionBrowserWindow = {
    //fullscreen: true,
    icon: './app/imgs/table.ico',
    webPreferences: {
      nodeIntegration: true
    }
  }
  
  if (process.platform === 'win') {
    optionBrowserWindow.icon = optionBrowserWindow.icon.slice(0, optionBrowserWindow.icon.lastIndexOf('.')) 
            + '.ico'
  }
  
  
  win = new BrowserWindow(optionBrowserWindow)
  win.maximize();
  
  if (mode === 'production') {
    win.setMenu(null)
    win.setMenuBarVisibility(false)
  }
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../', 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  settings.set('mode', mode);
  
  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('closed', () => {
    win = null
  })

}

require('./ipc')
