import HelloWorld from './HelloWorld'
import AsideNav from './AsideNav'

const component = {
  install: function (Vue) {
    Vue.component(HelloWorld.name, HelloWorld)// 自定义的全局公共组件
    Vue.component(AsideNav.name, AsideNav)
  }
}
export default component
