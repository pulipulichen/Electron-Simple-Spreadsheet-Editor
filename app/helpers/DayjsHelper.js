/* global dayjs, dayjs_plugin_advancedFormat, relativeTime */

let DayjsHelper = {
  init: function () {
    dayjs.extend(dayjs_plugin_relativeTime)
  }
}

DayjsHelper.init()
window.DayjsHelper = DayjsHelper