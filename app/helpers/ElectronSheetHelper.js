/* global ArffHelper */

let ElectronSheetHelper = {
  loadFile: function (filepath, callback) {
    if (typeof(callback) !== 'function') {
      return this
    }
    
    // https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/234185/
    
    //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.ods"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.csv"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xls"
    //let path = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xlsx"
    
    if (fs.existsSync(filepath) === false) {
      return false
    }
    
    if (filepath.endsWith('.csv')) {
      return this.loadCSVFile(filepath, callback)
    }
    else if (filepath.endsWith('.arff')) {
      return this.loadARFFFile(filepath, callback)
    }
    else {
      return this.loadXLSXFile(filepath, callback)
    }
  },
  loadCSVFile: function (filepath, callback) {
    if (typeof(callback) !== 'function') {
      return this
    }
    
    let filename = path.basename(filepath)
    
    
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
    let encoding = jschardet.detect(fs.readFileSync(filepath)).encoding
    //console.log(encoding)
    if (detectEncodingList.indexOf(encoding) === -1) {
      encoding = 'utf8'
    }
    
    if (encoding === 'utf8') {
      fs.createReadStream(filepath)
        .pipe(stripBomStream())
        .pipe(csv())
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', () => {
          this.loadCSVFileOnStreamEnd(filename, results, callback)
        });
    }
    else {
      fs.createReadStream(filepath)
        .pipe(iconv.decodeStream(encoding))
        .pipe(iconv.encodeStream('utf8'))
        .pipe(stripBomStream())
        .pipe(csv())
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', () => {
          this.loadCSVFileOnStreamEnd(filename, results, callback)
        });
    }
  },
  loadCSVFileOnStreamEnd: function (filename, results, callback) {
    //console.log(results);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]

    let data = []
    let colHeaders = []
    let colHeadersStable = false
    results.forEach((row, i) => {
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
  },
  loadARFFFile: function (filepath, callback) {
    ArffHelper.read(filepath, (data) => {
      let filename = path.basename(filepath)
      this.loadCSVFileOnStreamEnd(filename, data, callback)
    })
  },
  loadXLSXFile: function (filepath, callback) {
    JSXlsxHelper.read(filepath, callback)
  },
}

window.ElectronSheetHelper = ElectronSheetHelper