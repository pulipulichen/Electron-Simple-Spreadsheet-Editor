//listen to an open-file-dialog command and sending back selected information
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')

ipc.on('open-file-dialog', function (event, dir) {
  //console.log(process.platform)
  
  let options = {
    title: 'Please select a spread sheet file',
    properties: ['openFile']
  }
  
  if (typeof(dir) === 'string' && dir !== '') {
    if (process.platform === 'win32') {
      dir = dir.split('/').join('\\')
    }
    options.defaultPath = dir
  }
  
  if (process.platform === 'win32') {
    options.filters = [
      { name: 'Spread sheets', extensions: ['ods', 'csv', 'xlsx', 'xls'] },
      { name: 'OpenDocument Format', extensions: ['ods'] },
      { name: 'Comma-Separated Values', extensions: ['csv'] },
      { name: 'Microsoft Excel 2007–2019', extensions: ['xlsx'] },
      { name: 'MicrosoftExcel 97–2003', extensions: ['xls'] }
    ]
  }
  
  //console.log(options)
  
  dialog.showOpenDialog(win, options, function (files) {
    if (files && typeof(files[0]) === 'string') {
      
      let filepath = files[0]
      if (filepath.endsWith('.ods')) {
        win.setOverlayIcon('./app/imgs/ods.ico', '')
      }
      else if (filepath.endsWith('.csv')) {
        win.setOverlayIcon('./app/imgs/csv.ico', '')
      }
      else {
        win.setOverlayIcon('./app/imgs/excel.ico', '')
      }

      
      event.sender.send('selected-file', filepath)
    }
  })
})

// -------------------------------------------------

ipc.on('open-file-dialog-icon', function (event, dir) {
  let options = {
    title: 'Please select a icon image',
    properties: ['openFile']
  }
  
  if (dir !== '' && files[0] !== null) {
    if (process.platform === 'win32') {
      dir = dir.split('/').join('\\')
    }
    options.defaultPath = dir
  }
  
  if (process.platform === 'win32') {
    options.filters = [
      { name: 'Images', extensions: ['ico', 'png', 'jpg', 'jpeg', 'gif'] }
    ]
  }
  
  //console.log(options)
  
  dialog.showOpenDialog(win, options, function (files) {
    if (files && files[0] !== null) {
      event.sender.send('selected-file-icon', files[0])
    }
  })
})

ipc.on('open-file-dialog-create', function (event, filePath) {
  let options = {
    title: 'Save shortcut to...',
    filters: [
      { name: 'Shortcut', extensions: ['lnk'] }
    ]
  }
  if (filePath !== '') {
    if (process.platform === 'win32') {
      filePath = filePath.split('/').join('\\')
      //filePath = filePath.split('\\').join('/')
    }
    options.defaultPath = filePath
  }
  //console.log(options)
  
  dialog.showSaveDialog(win, options, function (file) {
    if (file) {
      event.sender.send('selected-file-create', file)
    }
  })
})