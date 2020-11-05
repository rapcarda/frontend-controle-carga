import axios from '@/http/axios'

export default {
  postLogin (user) {
    return axios.post('Authentication/login', user)
  }
}
