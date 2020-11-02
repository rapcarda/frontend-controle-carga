import axios from 'axios'

const http = axios.create({
    baseURL: 'https://localhost:44303/api/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
})

export default http