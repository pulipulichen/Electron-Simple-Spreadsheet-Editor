
const path = require('path')
const url = require('url')
const fs = require('fs')

const readChunk = require('read-chunk')
const fileType = require('file-type')

// ------------

const {
  app,
  BrowserWindow,
  clipboard,
} = require('electron')
  
const settings = require('electron-settings');

// ------------

//app.on('ready', createWindow)

let mode = 'production'
if (process.argv.indexOf('--mode') - process.argv.indexOf('development') === -1) {
  mode = "development"
}

let validateFileIsSheet = (filepath) => {
  if (filepath.lastIndexOf('.') === -1) {
    return false
  }
  
  let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
  if (['csv', 'xls', 'xlsx', 'ods', 'pot', 'arff'].indexOf(ext) === -1) {
    return false
  }
  
  let buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
  let fileTypeResult = fileType(buffer)
  if ( (fileTypeResult === undefined && ext === 'csv')
          || (fileTypeResult.mime === 'application/x-msi' && ext === 'xls')
          || (fileTypeResult.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && ext === 'xlsx')
          || (fileTypeResult.mime === 'application/vnd.oasis.opendocument.spreadsheet' && ext === 'ods') ) {
    return true
  }
  else {
    return false
  }
}

// --------------------

let filepaths = []
if (typeof(process) === 'object'
        && Array.isArray(process.argv)) {
  process.argv.forEach(arg => {
    if (validateFileIsSheet(arg)) {
      filepaths.push(arg)
    }
  })
}

let clipboardText = clipboard.readText('clipboard')
if (validateFileIsSheet(clipboardText)) {
  filepaths.push(clipboardText)
}

//console.log(filepaths)

// --------------------

/*
if (typeof(filepath) === 'string' && fs.existsSync(filepath)) {
  let buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
  let fileTypeResult = fileType(buffer)
  let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
  if ( (fileTypeResult === undefined && ext === 'csv')
          || (fileTypeResult.mime === 'application/x-msi' && ext === 'xls')
          || (fileTypeResult.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && ext === 'xlsx')
          || (fileTypeResult.mime === 'application/vnd.oasis.opendocument.spreadsheet' && ext === 'ods') ) {
    settings.set('filepath', filepath)
  }
  else {
    settings.delete('filepath')
  }
}
else {
  settings.delete('filepath')
}
//console.log(filepath)
*/

//console.log(mode)
//mode = "development"
//mode = 'production'

app.on('window-all-closed', () => {
  // darwin = MacOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.commandLine.appendSwitch('disable-site-isolation-trials');

let winList = {}
//app.on('activate', () => {
app.on('ready', () => {
  //console.log(filepaths)
  filepaths.forEach(filepath => {
    if (typeof(winList[filepath]) === 'undefined') {
      winList[filepath] = createWindow(filepath)
    }
  })
})

function createWindow(filepath) {
  
  let optionBrowserWindow = {
    //fullscreen: true,
    icon: './app/imgs/table.ico',
    //useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  }
  
  if (process.platform === 'win') {
    optionBrowserWindow.icon = optionBrowserWindow.icon.slice(0, optionBrowserWindow.icon.lastIndexOf('.')) 
            + '.ico'
  }
  let win = new BrowserWindow(optionBrowserWindow)
  //win.maximize();
  
  if (mode === 'production') {
    win.setMenu(null)
    win.setMenuBarVisibility(false)
  }
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  //settings.set('mode', mode);
  
  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('closed', () => {
    win = null
  })
  
  //win.rendererSideName.filepath = filepath
  //win.rendererSideName.mode = mode
  win.getData = () => {
    return {
      filepath: filepath,
      mode: mode
    }
  }
  
  return win
}

require('./ipc')
