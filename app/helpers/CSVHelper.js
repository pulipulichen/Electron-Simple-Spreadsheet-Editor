let CSVHelper = {
  inited: false,
  lib: {
    jschardet: null,
    csv: null,
    stripBomStream: null,
    iconv: null,
    ElectronFileHelper: null,
    fs: null
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    this.lib.csv = RequireHelper.require('csv-parser')
    this.lib.iconv = RequireHelper.require('iconv-lite')
    this.lib.stripBomStream = RequireHelper.require('strip-bom-stream')
    this.lib.jschardet = RequireHelper.require("jschardet")
    this.lib.fs = RequireHelper.require("fs")
    this.lib.ElectronFileHelper = RequireHelper.require("./electron/ElectronFileHelper")
    
    this.inited = true
  },
  read: function (filepath, callback) {
    this.init()
    
    if (typeof(callback) !== 'function') {
      return this
    }
    
    let filename = this.lib.ElectronFileHelper.basename(filepath)
    
    const results = [];
    
    let detectEncodingList = ['Big5', "GB2312", "Shift_JIS"]
    /*
    const fileBuffer = fs.readFileSync(filepath);
    var charsetMatch = detect(fileBuffer);
    console.log(charsetMatch)
    
    let encoding = 'utf8'
    
    for (let i = 0; i < charsetMatch.length; i++) {
      if (chineseEncoding.indexOf(charsetMatch[i].charsetName) > -1) {
        encoding = charsetMatch[i].charsetName
        break
      }
    }
    console.log(encoding)
    */
    let encoding = this.lib.jschardet.detect(this.lib.fs.readFileSync(filepath)).encoding
    //console.log(encoding)
    if (detectEncodingList.indexOf(encoding) === -1) {
      encoding = 'utf8'
    }
    
    if (encoding === 'utf8') {
      this.lib.fs.createReadStream(filepath)
        .pipe(this.lib.stripBomStream())
        .pipe(this.lib.csv())
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', () => {
          this.onStreamEnd(filename, results, callback)
        });
    }
    else {
      this.lib.fs.createReadStream(filepath)
        .pipe(this.lib.iconv.decodeStream(encoding))
        .pipe(this.lib.iconv.encodeStream('utf8'))
        .pipe(this.lib.stripBomStream())
        .pipe(this.lib.csv())
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', () => {
          this.onStreamEnd(filename, results, callback)
        });
    }
    return this
    },
  onStreamEnd: function (filename, results, callback) {
    //console.log(results);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]

    let data = []
    let colHeaders = []
    let colHeadersStable = false
    results.forEach(row => {
      let rowArray = []
      let colHeadersTemp = []
      for (let key in row) {
        let field = row[key]
        rowArray.push(field)
        if (colHeadersStable === false) {
          colHeadersTemp.push(key)
        }
      }

      //console.log([colHeadersStable, colHeadersTemp.length, colHeaders.length])
      if (colHeadersStable === false) {
        if (colHeaders.length === 0) {
          colHeaders = colHeadersTemp
          data.push(rowArray)
        }
        else if (colHeadersTemp.length === colHeaders.length) {
          colHeadersStable = true
          data.push(rowArray)
        }
        else {
          colHeaders = colHeadersTemp
          data.popup()
          data.push(rowArray)
        }
      }
      else {
        data.push(rowArray)
      }
    })  // results.forEach((row, i) => {

    let sheetName = filename
    if (sheetName.indexOf('.') > -1) {
      sheetName = sheetName.slice(0, sheetName.lastIndexOf('.'))
    }

    //console.log(colHeaders)

    callback({
      filename: filename,
      sheetName: sheetName,
      colHeaders: colHeaders,
      data: data
    })

    return this
  }
}

//CSVHelper.init()

if (typeof(window) !== 'undefined') {
  window.CSVHelper = CSVHelper
}
if (typeof(exports) !== 'undefined') {
  exports.default = CSVHelper
}