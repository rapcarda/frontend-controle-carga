import axios from '@/http/axios'

export default {
    getUsuario () {
        return axios.get('usuarios')
    },

    postUsuario (usuario) {
        return axios.post('usuarios', usuario)
    },

    putUsuario (usuario) {
        return axios.put(`usuarios/${usuario.id}`, usuario)
    },

    deleteUsuario (usuario) {
        return axios.delete(`usuarios/${usuario.id}`)
    }
}