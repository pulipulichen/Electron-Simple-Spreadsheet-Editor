
const path = require('path')
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


let validateFileIsSheet = (filepath) => {
  if (filepath.lastIndexOf('.') === -1) {
    return false
  }
  
  //console.log(filepath)
  let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
  if (['csv', 'xls', 'xlsx', 'ods', 'pot', 'arff', 'sav'].indexOf(ext) === -1) {
    return false
  }
  
  //console.log(filepath)
  if (fs.existsSync(filepath) === false) {
    return false
  }
  
  let buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
  let fileTypeResult = fileType(buffer)
  //console.log(fileTypeResult)
  if ( (fileTypeResult === undefined && ext === 'csv')
          || (fileTypeResult === undefined && ext === 'arff')
          || (fileTypeResult === undefined && ext === 'sav')
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
  if (filepaths.length === 0) {
    createWindow()
    return
  }
  
  //console.log(filepaths)
  let loop = (i) => {
    if (i < filepaths.length) {
      let filepath = filepaths[i]
      createWindow(filepath, (win) => {
        winList[filepath] = win
        i++
        loop(i)
      })
    }
  }
  loop(0)
})

const createWindow = require('./create-window')

require('./ipc')
