import services from './../service'
import * as types from './mutation-types'

export const ActionDoLogin = ({ dispatch }, payload) => {
  return services.postLogin(payload).then(res => {
    dispatch('ActionSetUser', res.data.data.userToken)
    dispatch('ActionSetToken', res.data.data.accessToken)
  })
}

export const ActionCheckToken = ({ dispatch, state }) => {
  if (state.token) {
    return Promise.resolve(state.token)
  }
  const token = localStorage.getItem('userToken-CG')
  if (!token || token === 'undefined') {
    return Promise.reject(new Error('Token inválido'))
  }

  dispatch('ActionSetToken', token)
  return dispatch('ActionLoadSession')
}

export const ActionLoadSession = async ({ dispatch }) => {
  let result
  try {
    result = await services.getLoadSession()
  } catch (err) {
    return Promise.reject(new Error(err))
  }

  if (result) {
    return new Promise((resolve, reject) => {
      try {
        dispatch('ActionSetUser', result.data.data.userToken)
        resolve()
      } catch (err) {
        dispatch('ActionSignOut')
        reject(err)
      }
    })
  } else {
    return Promise.reject(new Error('Sessão inválida ou expirada'))
  }
}

export const ActionSetUser = ({ commit }, payload) => {
  commit(types.SET_USER, payload)
}

export const ActionSetToken = ({ commit }, payload) => {
  localStorage.setItem('userToken-CG', payload)
  commit(types.SET_TOKEN, payload)
}

export const ActionSignOut = ({ dispatch }) => {
  localStorage.removeItem('userToken-CG')
  dispatch('ActionSetUser', {})
  dispatch('ActionSetToken', '')
}