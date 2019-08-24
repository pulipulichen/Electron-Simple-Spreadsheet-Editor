let DayjsHelper = {
  lib: {
    dayjs: null,
    //dayjs_plugin_advancedFormat: null
    dayjs_plugin_relativeTime: null
  },
  init: function () {
    this.lib.dayjs = RequireHelper.require('dayjs')
    //this.lib.dayjs_plugin_advancedFormat = RequireHelper.require('dayjs_plugin_advancedFormat')
    this.lib.dayjs_plugin_relativeTime = RequireHelper.require('dayjs_plugin_relativeTime')
    
    this.lib.dayjs.extend(this.lib.dayjs_plugin_relativeTime)
  },
  getUnixMS: function () {
    return (new Date()).getTime()
  },
  /**
   * 
   * @param {type} timestamp = (new Date()).getTime()
   * @returns {unresolved}
   */
  howLongAgo: function (timestamp) {
    return this.lib.dayjs().from(timestamp) // 2 years ago
  }
}

DayjsHelper.init()
//window.DayjsHelper = DayjsHelper
if (typeof(window) === 'object') {
  window.DayjsHelper = DayjsHelper
}
if (typeof(module) === 'object') {
  module.exports = DayjsHelper
}