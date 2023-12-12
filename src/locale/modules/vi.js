import zhLocale from 'element-plus/lib/locale/lang/vi'
import system from './vi/system'
import common from './vi/common'
import menu from './vi/menu'
const lang = {
  el: zhLocale.el, // element内部国际化
  message: {
    language: 'Tiếng Việt',
    ...system,
    ...common,
    ...menu
  }
}

export default lang