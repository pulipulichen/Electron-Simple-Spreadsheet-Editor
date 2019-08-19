/* global dayjs, dayjs_plugin_advancedFormat, relativeTime */

let DayjsHelper = {
  init: function () {
    dayjs.extend(dayjs_plugin_relativeTime)
  },
  getTimestamp: function () {
    return (new Date()).getTime()
  },
  /**
   * 
   * @param {type} timestamp = (new Date()).getTime()
   * @returns {unresolved}
   */
  howLongAgo: function (timestamp) {
    return dayjs().from(timestamp) // 2 years ago
  }
}

DayjsHelper.init()
window.DayjsHelper = DayjsHelper