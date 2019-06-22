// 引入相关基础插件
import Vue from 'vue'
import App from './App'
import router from './router'

//按需引入card、icon两个iView对应的UI组件并注册到Vue实例上
import 'iview/dist/styles/iview.css'
import { Card, Icon } from 'iview'
Vue.component('Card', Card)
Vue.component('Icon', Icon)

//引入定制化虚拟滚动插件并注册到Vue全局实例上，这里需要注意先后顺序，我们的定制化插件中会用到iView中的组件
import VirtualBlock from "./plugins/VirtualBlock"
Vue.use(VirtualBlock)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
