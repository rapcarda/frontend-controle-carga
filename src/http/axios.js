import axios from 'axios'
import store from './../store'

const http = axios.create({
    baseURL: 'https://localhost:44303/api/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
})

http.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken-CG')

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

http.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (!error.response) {
    store.dispatch('auth/ActionSignOut')
    if (!error.config.url.endsWith('load-session')) {
      window._Vue.$router.push({ name: 'login' })
    }
  } else {
    if (error.response.status === 401) {
      store.dispatch('auth/ActionSignOut')

      /* A load-sessio só é chamada no index da rota, em suas verificações da action ActionCheckToken */
      /* Sendo assim, se o 401 veio da load-session, já terá um push para a rota login, dentro da index da rota */
      if (!error.config.url.endsWith('load-session')) {
        window._Vue.$router.push({ name: 'login' })
      }
    }
  }

  return Promise.reject(error)
})

export default http