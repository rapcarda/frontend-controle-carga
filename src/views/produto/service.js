import axios from '@/http/axios'

export default {
    getProduto () {
        return axios.get('produtos')
    },

    postProduto (produto) {
        return axios.post('produtos', produto)
    },

    putProduto (produto) {
        return axios.put(`produtos/${produto.id}`, produto)
    },

    deleteProduto (produto) {
        return axios.delete(`produtos/${produto.id}`)
    }
}