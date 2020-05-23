<template lang="html">
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 x14>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-card-title>Acceso al sistema</v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field type="email" v-model="email" autofocus color="accent" label="Correo" required></v-text-field>
          <v-text-field type="password" v-model="password" autofocus color="accent" label="Password" required></v-text-field>
          <v-flex class="red--text" v-if="error_login">
              {{error_login}}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn @click="Ingresar();"color="primary">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  data (){
    return{
      email: '',
      password: '',
      error_login: null
    }
  },
  methods:{
    Ingresar(){
      axios.post('/usuario/login',{email:this.email, password:this.password})
      .then(response => {
        return response.data;
      })
      .then(data => {
        this.$store.dispatch("guardarToken",data.tokenReturn);
        this.$router.push({name: "Home"});
      })
      .catch(err => {
        this.error_login = null;
        if(err.response.status == 404){
          this.error_login = 'Usuario o contraseña incorrectas, favor de validar sus accessos';
        } else {
          this.error_login = 'Error de conección';
        }
      });
    }
  }
}
</script>

<style lang="css" scoped>
</style>
