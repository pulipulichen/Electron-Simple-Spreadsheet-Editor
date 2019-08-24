//listen to an open-file-dialog command and sending back selected information
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')

const CreateWindow = require('./CreateWindow')

module.exports = function () {
  ipc.on('open-another-win', function (event, filepath) {
    console.log(filepath)
    CreateWindow(filepath)
  })

  ipc.on('open-file-dialog', function (event, win, dir) {
    //console.log(process.platform)

    let options = {
      title: 'Please select a spread sheet file',
      properties: ['openFile']
    }

    if (typeof(dir) === 'string' && dir !== '' && fs.existsSync(dir)) {
      options.defaultPath = dir
    }

    //if (process.platform === 'win32') {
      options.filters = [
        { name: 'Spread sheets', extensions: ['ods', 'csv', 'xlsx', 'xls', 'arff', 'sav'] },
        { name: 'OpenDocument Format', extensions: ['ods'] },
        { name: 'Comma-Separated Values', extensions: ['csv'] },
        { name: 'Microsoft Excel 2007–2019', extensions: ['xlsx'] },
        { name: 'MicrosoftExcel 97–2003', extensions: ['xls'] },
        { name: 'Attribute-Relation File Format', extensions: ['arff'] },
        { name: 'SPSS System Data File Format Family', extensions: ['sav'] }
      ]
    //}

    dialog.showOpenDialog(null, options, function (files) {
      if (files && typeof(files[0]) === 'string') {

        let filepath = files[0]
        event.sender.send('selected-file', filepath)
      }
    })
  })

  // -------------------------------------------------

  let predefinedFilters = [,
    { name: 'OpenDocument Format', extensions: ['ods'] },
    { name: 'Comma-Separated Values', extensions: ['csv'] },
    { name: 'Microsoft Excel 2007–2019', extensions: ['xlsx'] },
    { name: 'MicrosoftExcel 97–2003', extensions: ['xls'] },
    { name: 'Attribute Relation File Format', extensions: ['arff'] },
    { name: 'SPSS System Data File Format Family', extensions: ['sav'] }
  ]

  ipc.on('open-file-dialog-save', function (event, win, filePath) {
    let defaultFilter = filePath.slice(filePath.lastIndexOf('.') + 1)

    let filtersSelect = []
    let filtersOthers = []
    predefinedFilters.forEach(config => {
      if (config.extensions.indexOf(defaultFilter) > -1) {
        filtersSelect.push(config)
      }
      else {
        filtersOthers.push(config)
      }
    })

    //console.log(defaultFilter)
    //console.log(filtersSelect.concat(filtersOthers))

    let options = {
      title: 'Save spread sheet to...',
      filters: filtersSelect.concat(filtersOthers)
    }
    if (typeof(filePath) === 'string' && filePath !== '') {
      //if (process.platform === 'win32') {
        //filePath = filePath.split('/').join('\\')
        //filePath = filePath.split('\\').join('/')
      //}
      options.defaultPath = filePath
    }
    //console.log(options)

    dialog.showSaveDialog(null, options, function (file) {
      if (file) {
        //console.log(file)
        event.sender.send('selected-file-save', file)
      }
    })
  })
}