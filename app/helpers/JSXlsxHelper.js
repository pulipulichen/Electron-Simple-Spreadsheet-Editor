let JSXlsxHelper = {
  inited: false,
  lib: {
    path: null,
    XLSX: null,
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    this.lib.path = RequireHelper.require('path')
    this.lib.XLSX = RequireHelper.require('xlsx')
    
    this.inited = true
    return this
  },
  read: function (filepath, callback) {
    this.init()
    
    if (typeof(callback) !== 'function') {
      return this
    }
    
    let filename = this.lib.path.basename(filepath)
    
    //console.log(filename)
    let workbook = this.lib.XLSX.readFile(filepath);
    //console.log(workbook)
    
    let sheetName
    for (let key in workbook.Sheets) {
      sheetName = key
      break
    }
    
    //console.log(workbook)
    let json = this.lib.XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    
    let data = []
    let colHeaders = []
    let colHeadersStable = false
    
    json.forEach((row, i) => {
      let rowArray = []
      let colHeadersTemp = []
      for (let key in row) {
        let field = row[key]
        rowArray.push(field)
        if (colHeaders.length === 0 
                && key.startsWith('__EMPTY') === false) {
          colHeadersTemp.push(key)
        }
      }
      
      if (colHeaders.length === 0 
                && rowArray.length !== colHeadersTemp.length) {
        colHeaders = rowArray
      }
      else {
        if (colHeadersTemp.length > 0) {
          colHeaders = colHeadersTemp
        }
        data.push(rowArray)
      }
      
      /*
      console.log([colHeadersStable, colHeadersTemp.length, colHeaders.length])
      if (colHeadersStable === false) {
        if (rowArray.length !== colHeadersTemp.length) {
          colHeaders = rowArray
          colHeadersStable = true
        }
        
      }
      else {
        data.push(rowArray)
      }
       */
    })  // results.forEach((row, i) => {
    
    //console.log(colHeaders)
    
    callback({
      filename: filename,
      sheetName: sheetName,
      colHeaders: colHeaders,
      data: data
    })
    
    //let data = fs.readFileSync("./app/data.json")
    //return JSON.parse(data)
  },
  buildBase64File: function (bookType, sheetName, data) {
    this.init()
    
    let wopts = { bookType: bookType, bookSST:false, type:'base64' };
    let sheets = {}
    sheets[sheetName] = this.lib.XLSX.utils.json_to_sheet(data.rows, {
      header: data.header
    })

    let workbook = {
      "SheetNames": [sheetName],
      "Sheets": sheets,
      "Workbook": {
        "Sheets": [{ Hidden: 0, name: sheetName } ]
      }
    }
    //console.log(workbook)
    //console.log(workbook)
    let wboutBase64 = this.lib.XLSX.write(workbook, wopts)
    //let base64 = new Blob([wbout],{type:"application/octet-stream"})
    
    return wboutBase64
  }
}

//JSXlsxHelper.init()

if (typeof(window) === 'object') {
  window.JSXlsxHelper = JSXlsxHelper
}
if (typeof(module) === 'object') {
  module.exports = JSXlsxHelper
}