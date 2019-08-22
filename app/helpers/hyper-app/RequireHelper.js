let RequireHelper = {
  requireJQuery: function () {
    window.$ = window.jQuery = require('jquery')
  }
}

if (typeof(window) === 'object') {
  window.RequireHelper = RequireHelper
}
if (typeof(module) === 'object') {
  module.exports = RequireHelper
}