var ArffHelper = {
  inited: false,
  lib: {
    arff: null,
    ArffUtils: null,
    ElectronFileHelper: null,
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    this.lib.arff = RequireHelper.require('node-arff')
    this.lib.ArffUtils = RequireHelper.require('arff-utils')
    this.lib.ElectronFileHelper = RequireHelper.require('./electron/ElectronFileHelper')
    
    this.inited = true
  },
  read: function (filepath, callback) {
    this.init()
    
    if (typeof(callback) !== 'function') {
      return this
    }
    
    this.lib.arff.load(filepath, (err, data) => {
      //callback(data.data)
      let filename = this.lib.ElectronFileHelper.basename(filepath)
      this.onStreamEnd(filename, data.data, callback)
    })
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
  },
  write: function (filepath, data, callback) {
    this.init()
    
    let relationName = this.sheetName
      
    let arffFile = new this.lib.ArffUtils.ArffWriter(`relation ${relationName}`, ArffUtils.MODE_OBJECT)

    // 先判斷每一個header的類型
    let attributeTypes = {}
    let attributeNominalLevels = {}
    for (let i = 0; i < data.rows.length; i++) {
      let row = data.rows[i]
      for (let attr in row) {
        let value = row[attr]
        if (isNaN(value) === false) {
          eval(`value = ${value}`)
        }
        
        let type = 'nominal'
        switch (typeof(value)) {
          case 'object':
            value = JSON.stringify(value)
            break
          case 'boolean':
            if (value === true) {
              value = "true"
            }
            else {
              value = "false"
            }
            break
          case 'number':
            type = 'numeric'
            break
        }

        if (value !== '') {
          if (typeof(attributeTypes[attr]) === 'undefined') {
            attributeTypes[attr] = type
          }

          if (type === 'nominal') {
            if (Array.isArray(attributeNominalLevels[attr]) === false) {
              attributeNominalLevels[attr] = []
            }

            if (attributeNominalLevels[attr].indexOf(value) === -1) {
              attributeNominalLevels[attr].push(value)
            }
          }
        }
      }
    }

    // ------------------------------------------
    // 宣告屬性
    //console.log(attributeTypes)
    //console.log(attributeNominalLevels)
    for (let attr in attributeTypes) {
      let type = attributeTypes[attr]

      if (type === 'nominal') {
        arffFile.addNominalAttribute(attr, attributeNominalLevels[attr])
      }
      else if (type === 'numeric') {
        arffFile.addNumericAttribute(attr)
      }
    }

    // --------------------------------------------
    // 加入資料
    for (let i = 0; i < data.rows.length; i++) {
      let row = data.rows[i]
      //console.log(i)
      //console.log(row)
      try {
        arffFile.addData(row)
      } catch (e) {
        console.warn(e)
      }
    }

    // -------------------------------------------
    // 寫入
    //arffFile.writeToStream(process.stdout);
    arffFile.writeToFile(filepath)

    if (typeof(callback) === 'function') {
      callback(filepath)
    }
  }
}

//ArffHelper.init()

if (typeof(window) === 'object') {
  window.ArffHelper = ArffHelper
}
if (typeof(module) === 'object') {
  module.exports = ArffHelper
}