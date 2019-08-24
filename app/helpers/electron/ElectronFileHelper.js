let ElectronFileHelper = {
  lib: {
    readChunk: null,
    fileType: null,
    path: null,
  },
  init: function () {
    this.lib.readChunk = RequireHelper.require('read-chunk')
    this.lib.fileType = RequireHelper.require('file-type')
    this.lib.path = RequireHelper.require('path')
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
  },
  basename: function (filepath) {
    return this.lib.path.basename(filepath)
  },
  existsSync: function (filepath) {
    return this.lib.fs.existsSync(filepath)
  }
}

ElectronFileHelper.init()


if (typeof(window) === 'object') {
  window.ElectronFileHelper = ElectronFileHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronFileHelper
}