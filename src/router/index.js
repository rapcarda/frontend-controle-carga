import Vue from 'vue'
import VueRouter from 'vue-router'
import { coletorRouters } from "@/views/coletor"
import { frotaRouters } from "@/views/frota"
import { clienteRouters } from "@/views/cliente"
import { produtoRouters } from "@/views/produto"
import { clienteProdutoRouters } from "@/views/clienteProduto"
import { usuarioRouters } from "@/views/usuario"
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  ...coletorRouters,
  ...frotaRouters,
  ...clienteRouters,
  ...produtoRouters,
  ...clienteProdutoRouters,
  ...usuarioRouters,
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

export default router
