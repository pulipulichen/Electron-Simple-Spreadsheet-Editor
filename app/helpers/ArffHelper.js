let arff = require('node-arff')
let ArffUtils = require('arff-utils')

let ArffHelper = {
  read: function (filepath, callback) {
    if (typeof(callback) !== 'function') {
      return this
    }
    
    arff.load(filepath, (err, data) => {
      callback(data.data)
    })
  },
  write: function (filepath, data, callback) {
    let relationName = this.sheetName
      
    let arffFile = new ArffUtils.ArffWriter(`relation ${relationName}`, ArffUtils.MODE_OBJECT)

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

if (typeof(window) === 'object') {
  window.ArffHelper = ArffHelper
}
if (typeof(module) === 'object') {
  module.exports = ArffHelper
}