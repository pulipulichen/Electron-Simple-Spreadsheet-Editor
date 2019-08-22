let fs = require('fs')
let path = require('path')

let PrcoessArgvHelper = {
  getFilePaths: function () {
    let filepaths = []
    if (typeof(process) === 'object'
        && Array.isArray(process.argv)) {
      process.argv.forEach(arg => {
        if (fs.existsSync(arg)) {
          filepaths.push(path.resolve(arg))
        }
      })
    }
    return filepaths
  }
}

module.exports = PrcoessArgvHelper