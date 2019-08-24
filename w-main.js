// main.js
const electron = require('electron')
// app用于控制应用的生命周期
const app = electron.app
// BrowserWindow用于生成一个原生的窗口
const BrowserWindow = electron.BrowserWindow
// 创建一个全局的窗口对象变量，并在接下来的初始化窗口函数中赋值。通过这样的方式我们可以保持对窗口对象的引用，以免垃圾回收导致应用退出
let mainWindow

function createWindow() {
  // 创建主窗口，加载资源文件URL（html文件或一个网址）
  // 在这个官方例子里加载了index.html
  // 并定义当主窗口关闭时的回调函数
}

app.on('ready', createWindow)
app.on('window-all-closed', function() {}) // 全部窗口关闭时的回调
app.on('active', function() {
  // 在mac平台上，当点击dock icon的时候，如果没有其他窗口的话则新建主窗口
  if(mainWindow === null) {
    createWindow();
  }
})