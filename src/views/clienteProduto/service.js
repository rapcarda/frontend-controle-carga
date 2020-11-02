import axios from '@/http/axios'

export default {
    getClienteProduto () {
        return axios.get('clientesprodutos')
    },

    postClienteProduto (cliprod) {
        return axios.post('clientesprodutos', cliprod)
    },

    putClienteProduto (cliprod) {
        return axios.put(`clientesprodutos/${cliprod.id}`, cliprod)
    },

    deleteClienteProduto (cliprod) {
        return axios.delete(`clientesprodutos/${cliprod.id}`)
    },

    getClientes () {
        return axios.get('clientes/GetClienteCombo')
    },

    getProdutos () {
        return axios.get('produtos/GetProdutoCombo')
    }
}