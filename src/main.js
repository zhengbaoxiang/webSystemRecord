import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js' // 按需引入，减少体积
import ElementUi from 'element-ui' // 引入整个ElementUi组件
import 'element-ui/lib/theme-chalk/index.css' // 引入所有样式
// import MintUI from 'mint-ui' //引入整个MintUI组件
// import './assets/css/global.css' // 导入全局样式表
import style from './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css'// 导入字体图标
import axios from 'axios'
import axiosUtils from './utils/axiosUtils'
import Utils from './utils/myUtils'
import Api from './utils/api'
import components from './components/index'

Vue.config.productionTip = false

// 全局注册
Vue.use(ElementUi) // 引入ui框架
// Vue.use(MintUI) // 引入ui框架
Vue.use(style) // 样式重置
Vue.use(components) // 注册自己的components
// 建立事件中心
Vue.prototype.eventHub = new Vue({})
// ajax
Vue.prototype.$http = axios
Vue.prototype.$api = Api

// 日期格式化函数,避免eslint 报错

// 拿到全局配置项，存储在window对象下，window.localConfig
axios.get('/localConfig.json').then((response) => {
  window.localConfig = response.data
  // axios进行初始化
  axiosUtils.axiosInit()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// eslint-disable-next-line no-extend-native
Date.prototype.dateFormat = Utils.dateFormat
