<template>
<v-app id="app">
  <div id="app">

    <v-navigation-drawer  v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-if="es_administrador || es_vendedor || es_almacenero" >
          <v-list-item :to="{name: 'Home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template><!--menu-home-->
        <template  v-if="es_administrador || es_almacenero" >
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Almacén
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'categoria-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'articulo-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Artículos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template><!--menu-categoria-->
        <template  v-if="es_administrador || es_almacenero" >
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'ingreso-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ingresos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'proveedor-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template><!--menu-compras-->
        <template  v-if="es_administrador || es_vendedor" >
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'venta-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'cliente-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template><!--menu-ventas-->
        <template  v-if="es_administrador" >
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'usuario-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template><!--menu-accesos-->
        <template  v-if="es_administrador || es_vendedor || es_almacenero" >
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'consulta-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'consulta-route'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template><!--menu-consultas-->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn v-if="logueado" @click="desloggearse" color="blue darken-3" depressed>
          <v-icon left dark>logout</v-icon><span>Salir</span>
        </v-btn>
        <v-btn :to="{name: 'login-route'}" v-else color="blue darken-3" depressed>
          <v-icon left dark>apps</v-icon><span>Login</span>
        </v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat title color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              &copy; Meje 2020
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>

  </div>
</v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  computed: {
    logueado(){
      return this.$store.state.usuario;
    },
    es_administrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Administrador";
    },
    es_vendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Vendedor";
    },
    es_almacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Almacenero";
    }
  },

  created(){
    //Acceder con ayuda de dispatch al metodo en el store llamado autoLogin
    this.$store.dispatch("autoLogin");
  },

  methods: {
    desloggearse(){
      this.$store.dispatch("salir");
    }
  },
  data: () => ({
    drawer: true,
  })
};
</script>
