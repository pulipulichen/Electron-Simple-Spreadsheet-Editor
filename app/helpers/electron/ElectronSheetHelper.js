let ElectronSheetHelper = {
  inited: false,
  lib: {
    ElectronFileHelper: null,
    ElectronHelper: null,
    JSXlsxHelper: null,
    ArffHelper: null,
    SavHelper: null,
    CSVHelper: null,
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    //this.path = RequireHelper.require('path') 
    //this.fs = RequireHelper.require('fs')
    //this.readChunk = RequireHelper.require('read-chunk')
    //this.fileType = RequireHelper.require('file-type')
    
    this.lib.ElectronFileHelper = RequireHelper.require('./ElectronFileHelper')
    this.lib.ElectronHelper = RequireHelper.require('./ElectronHelper')
    
    this.lib.JSXlsxHelper = RequireHelper.require('../JSXlsxHelper')
    this.lib.ArffHelper = RequireHelper.require('../ArffHelper')
    this.lib.SavHelper = RequireHelper.require('../SavHelper')
    this.lib.CSVHelper = RequireHelper.require('../CSVHelper')
    
    this.inited = true
  },
  validateFileIsSheet: function (filepath) {
    this.init()
    
    if (filepath.lastIndexOf('.') === -1) {
      return false
    }

    //console.log(filepath)
    let ext = this.lib.ElectronFileHelper.getExt(filepath)
    if (['csv', 'xls', 'xlsx', 'ods', 'pot', 'arff', 'sav'].indexOf(ext) === -1) {
      return false
    }

    //console.log(filepath)
    if (this.lib.ElectronFileHelper.existsSync(filepath) === false) {
      return false
    }

    let fileTypeResult = this.lib.ElectronFileHelper.getFileType(filepath)
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
  },
  loadFile: function (filepath, callback) {
    this.init()
    
    if (typeof(callback) !== 'function') {
      return this
    }
    
    // https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/234185/
    
    //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.ods"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.csv"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xls"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xlsx"
    
    if (this.lib.ElectronFileHelper.existsSync(filepath) === false) {
      return false
    }
    
    if (filepath.endsWith('.csv')) {
      return this.loadCSVFile(filepath, callback)
    }
    else if (filepath.endsWith('.arff')) {
      return this.loadARFFFile(filepath, callback)
    }
    else if (filepath.endsWith('.sav')) {
      return this.loadSavFile(filepath, callback)
    }
    else {
      return this.loadXLSXFile(filepath, callback)
    }
  },
  loadCSVFile: function (filepath, callback) {
    this.init()
    
    this.lib.CSVHelper.read(filepath, callback)
    return this
  },
  loadXLSXFile: function (filepath, callback) {
    this.init()
    
    this.lib.JSXlsxHelper.read(filepath, callback)
    return this
  },
  loadARFFFile: function (filepath, callback) {
    this.init()
    
    this.lib.ArffHelper.read(filepath, callback)
    return this
  },
  loadSavFile: function (filepath, callback) {
    this.init()
    
    this.lib.SavHelper.read(filepath, (colHeaders, data) => {
      let filename = this.lib.ElectronFileHelper.basename(filepath)
      
      callback({
        filename: filename,
        sheetName: filename,
        colHeaders: colHeaders,
        data: data
      })
    })
  },
  saveAsSheet: function (filepath, bookType, sheetName, data, callback) {
    this.init()
    
    let wboutBase64 = this.lib.JSXlsxHelper.buildBase64File(bookType, sheetName, data)
    this.lib.ElectronHelper.saveFileBase64(filepath, wboutBase64, callback)
    return this
  }
}

//ElectronSheetHelper.init()

if (typeof(window) === 'object') {
  window.ElectronSheetHelper = ElectronSheetHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronSheetHelper
}