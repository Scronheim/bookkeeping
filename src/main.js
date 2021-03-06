import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import _ from 'lodash'
import moment from 'moment'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css';

moment.locale('ru')

Vue.config.productionTip = false
Vue.prototype.$_ = _
Vue.prototype.$moment = moment

Vue.filter('textDate', ((value) => {
  if (!value) return ''
  return moment(value, 'YYYY-MM').format('MMMM YYYY')
}))

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.7,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
});

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
