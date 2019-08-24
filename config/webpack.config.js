const path = require('path')

module.exports = {
  entry: {
    'renderer': './w-renderer.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'), // 设置输出目录
    filename: '[name].bundle.js', // 输出文件名
  },
  externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ]
}