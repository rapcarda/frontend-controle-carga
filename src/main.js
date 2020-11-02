import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import vuelidate from '@/plugins/vuelidate'
import Toasted from 'vue-toasted'

Vue.config.productionTip = false

Vue.use(Toasted)

const optionsError = {
  type: 'error',
  theme: 'toasted-primary',
  icon: 'error_outline',
  position: 'bottom-left',
  duration: 5000
}

// options to the toast success
const optionsSuccess = {
  type: 'success',
  theme: 'toasted-primary',
  icon: 'check_circle',
  position: 'bottom-left',
  duration: 5000
}

// register the toast with the custom message
Vue.toasted.register('toaster_error',
  (payload) => {
    // if there is no message passed show default message
    if (!payload.message) {
      return 'Oops.. Alguma coisa deu errado..'
    }

    // if there is a message show it with the message
    return payload.message
  },
  optionsError
)

// register the toast with the custom message
Vue.toasted.register('toaster_crud_success',
  (payload) => {
    // if there is no message passed show default message
    if (!payload.message) {
      return 'Registro processado com sucesso!'
    }

    // if there is a message show it with the message
    return 'Registro ' + payload.message + ' com sucesso!'
  },
  optionsSuccess
)

new Vue({
  router,
  vuetify,
  vuelidate,
  Toasted,
  render: h => h(App)
}).$mount('#app')
