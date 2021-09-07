import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入所有样式
import style from './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css'// 导入字体图标
import components from './components/index'
import axios from 'axios'
import axiosUtils from './utils/axiosUtils'
import Utils from './utils/myUtils'
import Api from './utils/api'

Vue.config.productionTip = false

// 全局注册
Vue.use(ElementUi)
Vue.use(style)
Vue.use(components)
Vue.prototype.eventHub = new Vue({})

Vue.prototype.$http = axios
Vue.prototype.$api = Api

axios.get('/localConfig.json').then((response) => {
  window.localConfig = response.data
  axiosUtils.axiosInit()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// eslint-disable-next-line no-extend-native
Date.prototype.dateFormat = Utils.dateFormat
