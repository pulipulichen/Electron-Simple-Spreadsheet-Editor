let DateHelper = {
  _pad2: function (n) {
    return n < 10 ? '0' + n : n
  },
  getCurrentTimeString: function () {
    let date = new Date();
    return date.getFullYear().toString() 
            + this._pad2(date.getMonth() + 1) 
            + this._pad2( date.getDate()) 
            + '-'
            + this._pad2( date.getHours() ) 
            + this._pad2( date.getMinutes() ) 
            + this._pad2( date.getSeconds() )
  },
  getMMDDHHmm: function (seperator) {
    let date = new Date();
    return this._pad2(date.getMonth() + 1) 
            + this._pad2( date.getDate()) 
            + seperator
            + this._pad2( date.getHours() ) 
            + this._pad2( date.getMinutes() ) 
  }
}

if (typeof(window) !== 'undefined') {
  window.DateHelper = DateHelper
}
if (typeof(exports) !== 'undefined') {
  exports.default = DateHelper
}