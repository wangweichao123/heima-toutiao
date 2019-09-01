import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import router from './router'

Vue.config.productionTip = false

// 引入全局css
import './assets/css/base.css'


Vue.prototype.$axios = axios
Vue.use(ElementUI);


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
