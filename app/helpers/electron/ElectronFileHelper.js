let ElectronFileHelper = {
  init: function () {
    
  },
  getExt: function (filepath) {
    let ext
    if (typeof(filepath) === 'string') {
      ext = filepath.slice(filepath.lastIndexOf('.') + 1)
    }
    return ext
  }
}

ElectronFileHelper.init()


if (typeof(window) === 'object') {
  window.ElectronFileHelper = ElectronFileHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronFileHelper
}