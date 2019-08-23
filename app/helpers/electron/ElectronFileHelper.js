let ElectronFileHelper = {
  lib: {
    readChunk: null,
    fileType: null,
  },
  init: function () {
    this.lib.readChunk = RequireHelper.require('read-chunk')
    this.lib.readChunk = RequireHelper.require('file-type')
  },
  getExt: function (filepath) {
    let ext
    if (typeof(filepath) === 'string') {
      ext = filepath.slice(filepath.lastIndexOf('.') + 1)
    }
    return ext
  },
  getFileType: function (filepath) {
    const buffer = this.lib.readChunk.sync(filepath, 0, this.lib.fileType.minimumBytes);
    let fileTypeResult = this.lib.fileType(buffer)
    return fileTypeResult
  }
}

ElectronFileHelper.init()


if (typeof(window) === 'object') {
  window.ElectronFileHelper = ElectronFileHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronFileHelper
}