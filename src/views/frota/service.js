import axios from '@/http/axios'

export default {
    getFrota () {
        return axios.get('frotas')
    },

    postFrota (frota) {
        return axios.post('frotas', frota)
    },

    putFrota (frota) {
        return axios.put(`frotas/${frota.id}`, frota)
    },

    deleteFrota (frota) {
        return axios.delete(`frotas/${frota.id}`)
    }
}