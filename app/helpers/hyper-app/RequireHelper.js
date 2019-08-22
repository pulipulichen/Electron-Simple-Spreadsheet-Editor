let RequireHelper = {
  requireJQuery: function () {
    window.$ = window.jQuery = require('jquery')
  },
  require: function (module) {
    let moduleName = module
    if (moduleName.indexOf('/') > -1) {
      moduleName = moduleName.slice(moduleName.lastIndexOf('/') + 1)
    }
    
    if (typeof(window[moduleName]) !== 'undefined') {
      return window[moduleName]
    }
    else {
      return require(module)
    }
  }
}

if (typeof(window) === 'object') {
  window.RequireHelper = RequireHelper
}
if (typeof(module) === 'object') {
  module.exports = RequireHelper
}