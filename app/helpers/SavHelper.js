var SavHelper = {
  inited: false,
  lib: {
    iconv: null,
    SavReader: null
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    this.lib.iconv = require('iconv-lite')
    this.lib.SavReader = require('sav-reader')
    
    this.inited = true
    return this
  },
  read: function (filepath, callback) {
    (async () => {
      this.init()
    
      //console.log(filepath)
      let sav = new this.lib.SavReader(filepath)

      // this opens the file and loads all metadata (but not the records a.k.a. cases)
      await sav.open()

      // print the header, which contains number of cases, encoding, etc.
      //console.log(sav.meta.header)
      let encoding = sav.meta.header.encoding
      if (encoding === 'BIG5') {
        encoding = 'Big5'
      }

      let colHeaders = []
      let colValueLabels = {}

      // print the vars
      sav.meta.sysvars.map(v => {

        // print the var, type, label and missing values specifications
        //console.log(v)

        let name = v.name
        name = this.decode(name, encoding)
        //console.log(name)
        colHeaders.push(name)

        // find and print value labels for this var if any
        let valueLabels = sav.meta.getValueLabels(v.name)
        if (valueLabels) {
          //console.log(valueLabels)
          if (typeof(colValueLabels[name]) !== 'object') {
            colValueLabels[name] = {}
          }
          
          valueLabels.forEach(valLabelPair => {
            if (encoding !== 'Utf8') {
              //valLabelPair.label = iconv.decode(valLabelPair.label, encoding)
              valLabelPair.label = this.decode(valLabelPair.label, encoding)
            }
            colValueLabels[name][valLabelPair.val] = valLabelPair.label
          })
          //console.log(colValueLabels[name])
        }

      })

      // row iteration (only one row is used at a time)
      let tableData = []
      let row = null
      do {
          row = await sav.readNextRow();
          let rowObject = {}
          if( row !== null ){
            //console.log(row)
            for (let name in row.data) {
              let value = row.data[name]
              //cons
              name = this.decode(name, encoding)
              
              if (typeof(colValueLabels[name]) === 'object' 
                      && typeof(colValueLabels[name][value]) !== 'undefined') {
                value = colValueLabels[name][value]
              }
              
              rowObject[name] = value
            }
            //console.log(rowObject)
            tableData.push(rowObject)
          }
      } while( row !== null )

      if (typeof(callback) === 'function') {
        //console.log(tableData)
        callback(colHeaders, tableData)
      }
    })()
  },
  _decodeCache: {},
  decode: function (str, encoding) {
    this.init()
    
    if (encoding.toLowerCase() === 'Utf8') {
      return str
    }
    
    if (typeof(this._decodeCache[str]) === 'string') {
      return this._decodeCache[str]
    }
    
    let decodedStr = this.lib.iconv.decode(str, encoding)
    this._decodeCache[str] = decodedStr
    return decodedStr
  }
}

//SavHelper.init()

if (typeof(window) === 'object') {
  window.SavHelper = SavHelper
}
if (typeof(module) === 'object') {
  module.exports = SavHelper
}