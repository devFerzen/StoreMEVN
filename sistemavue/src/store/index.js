import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null
  },
  mutations: {
    setToken(state,token){
      state.token = token;
    },
    setUsuario(state,usuario){
      state.usuario = usuario;
    }
  },
  actions: {
    guardarToken({commit},token){
      //salvartoken -- el commit ayuda a entrar a una mutation
      commit("setToken",token);
      commit("setUsuario",decode(token));
      localStorage.setItem("token",token);
    },
    autoLogin({commit}){
      //Verificar el token del storage
      let token = localStorage.getItem("token");
      if(token){
        commit("setToken",token);
        commit("setUsuario",decode(token));
      }
      router.push({name:'Home'});
    },
    salir({commit}){
      //desloggearse eliminar el token del storage
      commit("setToken",null);
      commit("setUsuario",null);
      localStorage.removeItem("token");
      router.push({name:'login-route'});
    }
  },
  modules: {
  }
})
