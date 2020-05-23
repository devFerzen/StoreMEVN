import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Articulo from '../components/Articulo.vue'
import Ingreso from '../components/Ingreso.vue'
import Proveedor from '../components/Proveedor.vue'
import Venta from '../components/Venta.vue'
import Cliente from '../components/Cliente.vue'
import Usuario from '../components/Usuario.vue'
import Consulta from '../components/Consulta.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      administrador : true,
      almacenero : true,
      vendedor : true
    }
  },
  {
    path:'/Categorias',
    name:'categoria-route',
    component: Categoria,
    meta: {
      administrador : true,
      almacenero : true
    }
  },
  {
    path:'/Articulos',
    name:'articulo-route',
    component: Articulo,
    meta: {
      administrador : true,
      almacenero : true,
      vendedor : true
    }
  },
  {
    path:'/Ingresos',
    name:'ingreso-route',
    component: Ingreso,
    meta: {
      administrador : true,
      almacenero : true
    }
  },
  {
    path:'/Proveedores',
    name:'proveedor-route',
    component: Proveedor,
    meta: {
      administrador : true,
      almacenero : true,
      vendedor : true
    }
  },
  {
    path:'/Ventas',
    name:'venta-route',
    component: Venta,
    meta: {
      administrador : true,
      vendedor : true
    }
  },
  {
    path:'/Clientes',
    name:'cliente-route',
    component: Cliente,
    meta: {
      administrador : true,
      almacenero : true,
      vendedor : true
    }
  },
  {
    path:'/Usuarios',
    name:'usuario-route',
    component: Usuario,
    meta: {
      administrador : true,
    }
  },
  {
    path:'/Consulta',
    name:'consulta-route',
    component: Consulta,
    meta: {
      administrador : true,
      almacenero : true,
      vendedor : true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path:'/Login',
    name:'login-route',
    component: Login,
    meta: {
      libre : true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//FrontEndvalidation permiso de las Rutas
router.beforeEach((to,from,next)=>{
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (store.state.usuario.rol == 'Administrador' && store.state.usuario) {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if (store.state.usuario.rol == 'Vendedor' && store.state.usuario) {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if (store.state.usuario.rol == 'Almacenero' && store.state.usuario) {
    if (to.matched.some(record => record.meta.almacenero)) {
      next();
    }
  } else {
    next({name: 'login-route'});
  }
});
//Se exporta las rutas en una variable
export default router
