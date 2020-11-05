import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { coletorRouters } from "@/views/coletor"
import { frotaRouters } from "@/views/frota"
import { clienteRouters } from "@/views/cliente"
import { produtoRouters } from "@/views/produto"
import { clienteProdutoRouters } from "@/views/clienteProduto"
import { usuarioRouters } from "@/views/usuario"
import { authRouters } from "@/views/auth"
import { movimentoRouters } from "@/views/movimento"
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  ...coletorRouters,
  ...frotaRouters,
  ...clienteRouters,
  ...produtoRouters,
  ...clienteProdutoRouters,
  ...usuarioRouters,
  ...authRouters,
  ...movimentoRouters,
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  document.title = `${to.name} - Controle Cargas`
  if (to.name !== 'login' && !store.getters['auth/hasToken']) {
    try {
      await store.dispatch('auth/ActionCheckToken')
      next({ name: to.name })
    } catch (err) {
      document.title = 'Login - Controle Cargas'
      next({ name: 'login' })
    }
  } else {
    if (to.name === 'login' && store.getters['auth/hasToken']) {
      document.title = 'Home - Controle Cargas'
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router
