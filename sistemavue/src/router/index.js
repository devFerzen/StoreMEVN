import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Articulo from '../components/Articulo.vue'
import Ingreso from '../components/Ingreso.vue'
import Proveedor from '../components/Proveedor.vue'
import Venta from '../components/Venta.vue'
import Cliente from '../components/Cliente.vue'
import Usuario from '../components/Usuario.vue'
import Consulta from '../components/Consulta.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/Categorias',
    name:'categoria-route',
    component: Categoria
  },
  {
    path:'/Articulos',
    name:'articulo-route',
    component: Articulo
  },
  {
    path:'/Ingresos',
    name:'ingreso-route',
    component: Ingreso
  },
  {
    path:'/Proveedores',
    name:'proveedor-route',
    component: Proveedor
  },
  {
    path:'/Ventas',
    name:'venta-route',
    component: Venta
  },
  {
    path:'/Clientes',
    name:'cliente-route',
    component: Cliente
  },
  {
    path:'/Usuarios',
    name:'usuario-route',
    component: Usuario
  },
  {
    path:'/Consulta',
    name:'consulta-route',
    component: Consulta
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
