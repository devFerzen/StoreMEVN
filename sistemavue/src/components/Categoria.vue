<template id="">
<v-layout align-start>

  <v-flex>
    <v-data-table :headers="headers" :items="categorias" :search="searchedWord" sort-by="nombre" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Categorías</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="searchedWord" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field v-model="nombre" label="Nombre de la categoría"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-show="is_valid">
                      <div class="red--text" v-for="message in invalid_message" :key="message" v-text="message">

                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="act_deact_modal" max-width="250px">
            <v-card>
              <v-card-title class="headline">
                {{act_deact_modal_title}} Item!!
              </v-card-title>
              <v-card-text>
                <v-container>
                  Estás a punto de
                  <span v-if="is_activating==1">desactivar</span>
                  <span v-else>activar</span> el item {{is_activating_name}}
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text small color="error" @click="modalActDesactCloseClean();">Cancelar</v-btn>
                <v-btn text small color="primary" @click="actDesactItem();">{{act_deact_modal_title}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.opciones="{ item }" >
        <v-icon small class="mr-2" @click="editItem(item)">
          edit
        </v-icon>
        <div v-if="item.estado">
          <v-icon small @click="modalActDesact(item)">
            block
          </v-icon>
        </div>
        <div v-else>
          <v-icon small @click="modalActDesact(item)">
            check
          </v-icon>
        </div>
      </template>

      <template v-slot:items="categoria">
        <td>{{categoria.item.nombre}}</td>
        <td>{{categoria.item.descripcion}}</td>
      </template>
      <template v-slot:item.estado="{item}">
        <div v-if="item.estado">
          <span class="blue--text">Activo</span>
        </div>
        <div v-else>
          <span class="red--text">Inactivo</span>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()">Reset</v-btn>
      </template>
    </v-data-table>
  </v-flex>
</v-layout>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      categorias: [],
      editing: 0,
      id:'',
      nombre:'',
      descripcion:'',
      is_valid:0,
      invalid_message:[],
      dialog: false,
      searchedWord: '',
      act_deact_modal: 0,
      act_deact_modal_title: '',
      is_activating: '',
      is_activating_name:'',
      headers: [{
          text: 'Categoria',
          align: 'start',
          sortable: true,
          value: 'nombre'
        },
        {
          text: 'Descripción',
          sortable: false,
          value: 'descripcion'
        },
        {
          text: 'Estado',
          sortable: false,
          value: 'estado'
        },
        {
          text: 'Opciones',
          value: 'opciones',
          sortable: false
        }
      ],
    }
  },

  computed: {
    formTitle() {
      return this.editing === 0 ? 'Nueva Categoría' : 'Editando Categoría'
    },
  },
  //EndComputed

  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  //EndWatch

  created() {
    this.listar()
  },
  //EndCreated

  methods: {
    listar() {
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      axios.get("categoria/list", configuration)
        .then(function(response) {
          me.categorias = response.data;
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    save() {
      if(this.validation()){return;}
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      if (this.editing === 1) {
        axios.put('categoria/update',
                  {'_id':this.id, 'nombre':this.nombre, 'descripcion':this.descripcion},
                  configuration)
        .then(function(response){
          me.cleanModal();
          me.close();
          me.listar();
          console.log(response);
        })
        .catch(function(err){
          console.log(err);
        })
      } else if(this.editing === 0) {
        axios.post('categoria/add',
                  {'nombre':this.nombre, 'descripcion':this.descripcion},
                  configuration)
        .then(function(response){
          me.cleanModal();
          me.close();
          me.listar();
          console.log(response);
        })
        .catch(function(err){
          console.log(err);
        })
      }
    },

    cleanModal(){
      this.id='',
      this.nombre='',
      this.descripcion='',
      this.is_valid=0,
      this.invalid_message=[],
      this.editing=0
    },

    editItem(item) {
      this.editing = 1;
      this.id = item._id;
      this.nombre = item.nombre;
      this.descripcion = item.descripcion;
      this.dialog = true;

    },
    modalActDesact(item){
      this.act_deact_modal = 1;
      this.is_activating = item.estado;
      this.act_deact_modal_title = item.estado === 1 ? 'Desactivar' : 'Activar';
      this.is_activating_name = item.nombre;
      this.id = item._id;
    },
    actDesactItem() {
      let url = 'activate';
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      if(this.is_activating === 1){url = 'deactivate';}

      axios.put('categoria/'+url,
                {'_id':this.id},
                configuration)
      .then(function(response){
        me.listar();
        me.modalActDesactCloseClean();
        console.log(response);
      })
      .catch(function(err){
        console.log(err);
      })
    },
    modalActDesactCloseClean(){
      this.act_deact_modal = 0;
      this.is_activating = '';
      this.act_deact_modal_title = '';
      this.is_activating_name = '';
      this.id = '';
    },
    validation(){
      this.is_valid=0;
      this.invalid_message=[];
      if (this.nombre.length<1 || this.nombre.length>50) {
        this.invalid_message.push('El nombre debe de ser de 1 a 50 caracteres.');
      }
      if (this.descripcion.length>255) {
        this.invalid_message.push('La descripcion no puede ser de más de 255 caracteres.');
      }
      if (this.invalid_message.length) {
        this.is_valid=1;
      }
      return this.is_valid;
    },
    close() {
      this.dialog = false,
      this.cleanModal();
    },

  },
  //EndMethods

}
</script>
