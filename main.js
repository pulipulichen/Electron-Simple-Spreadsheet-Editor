
//const path = require('path')
//const fs = require('fs')

//const readChunk = require('read-chunk')
//const fileType = require('file-type')

// ------------

const {
  app,
  BrowserWindow,
} = require('electron')
  
//const settings = require('electron-settings');

const ClipboardHelper = require('./electron-shell/ClipboardHelper')
const PrcoessArgvHelper = require('./electron-shell/PrcoessArgvHelper')
const ElectronSheetHelper = require('./electron-shell/ElectronSheetHelper')
const CreateWindow = require('./electron-shell/CreateWindow')
const IPCEventManager = require('./electron-shell/IPCEventManager')

// --------------------

let filepaths = []
PrcoessArgvHelper.getFilePaths().forEach((filepath) => {
  if (ElectronSheetHelper.validateFileIsSheet(filepath)) {
    filepaths.push(filepath)
  }
})

ClipboardHelper.getFilePaths().forEach((filepath) => {
  if (ElectronSheetHelper.validateFileIsSheet(filepath)) {
    filepaths.push(filepath)
  }
})

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
    CreateWindow()
    return true
  }
  
  //console.log(filepaths)
  let loop = (i) => {
    if (i < filepaths.length) {
      let filepath = filepaths[i]
      CreateWindow(filepath, (win) => {
        winList[filepath] = win
        i++
        loop(i)
      })
    }
  }
  loop(0)
  return true
})

IPCEventManager()
console.log(IPCEventManager)