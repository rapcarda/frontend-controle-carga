import axios from '@/http/axios'

export default {
    getMovimento (filter) {
        return axios.post('movimentos', filter)
    }
}