// renderer.js
// remote用于在主进程和渲染进程之间建立联系
// clipboard可以提供复制文本的功能
const electron = require('electron')
const remote = electron.remote
//import {clipboard, remote} from 'electron';
//require = window.require

// 例如，你可以用remote获取当前的窗口
let currentWindow = remote.getCurrentWindow();
console.log(currentWindow); // It's an Object

console.log('Hello, world.')