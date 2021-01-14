// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vcolorpicker from 'vcolorpicker'
import Common from '@/common/Common'

Vue.prototype.$common = Common;
Vue.config.productionTip = false
Vue.use(vcolorpicker)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
