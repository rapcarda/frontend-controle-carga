import axios from '@/http/axios'

export default {
    getColetor () {
        return axios.get('coletores')
    },

    postColetor (coletor) {
        return axios.post('coletores', coletor)
    },

    putColetor (coletor) {
        return axios.put(`coletores/${coletor.id}`, coletor)
    },

    deleteColetor (coletor) {
        return axios.delete(`coletores/${coletor.id}`)
    }
}