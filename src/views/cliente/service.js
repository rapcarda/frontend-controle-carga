import axios from '@/http/axios'

export default {
    getCliente () {
        return axios.get('clientes')
    },

    postCliente (cliente) {
        return axios.post('clientes', cliente)
    },

    putCliente (cliente) {
        return axios.put(`clientes/${cliente.id}`, cliente)
    },

    deleteCliente (cliente) {
        return axios.delete(`clientes/${cliente.id}`)
    }
}