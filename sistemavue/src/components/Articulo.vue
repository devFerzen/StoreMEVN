<template id="">
<v-layout align-start>

  <v-flex>
    <v-data-table :headers="headers" :items="articulos" :search="searchedWord" sort-by="nombre" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Artículos</v-toolbar-title>

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
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="codigo" label="Código"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="nombre" label="Nombre del artículo"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select v-model="categoria" :items="ddlcateogrias" lavel="Tipo de categiría">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field type="Number" v-model="precio_venta" label="Precio"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field type="Number" v-model="stock" label="Stock"></v-text-field>
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
          <!--Modal de nuevo-->

          <v-dialog v-model="act_deact_modal" max-width="250px">
            <v-card>
              <v-card-title class="headline">
                {{act_deact_modal_title}} Artículo!!
              </v-card-title>
              <v-card-text>
                <v-container>
                  Estás a punto de
                  <span v-if="is_activating==1">desactivar</span>
                  <span v-else>activar</span> el artículo {{is_activating_name}}
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text small color="error" @click="modalActDesactCloseClean();">Cancelar</v-btn>
                <v-btn text small color="primary" @click="actDesactItem();">{{act_deact_modal_title}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--Modal de activacion-->

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

      <template v-slot:items="articulo">
        <td>{{articulo.item.codigo}}</td>
        <td>{{articulo.item.nombre}}</td>
        <td>{{articulo.item.descripcion}}</td>
        <td>{{articulo.item.categoria.nombre}}</td>
        <td>{{articulo.item.precio_venta}}</td>
        <td>{{articulo.item.stock}}</td>
        <td>{{articulo.item.estado}}</td>
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
      editing: 0,

      articulos: [],
      id:'',
      codigo:'',
      nombre:'',
      descripcion:'',
      precio_venta: 0,
      stock:0,
      estado:'',
      ddlcateogrias: [],
      categoria: '',

      is_valid:0,
      invalid_message:[],
      dialog: false,
      searchedWord: '',

      act_deact_modal: 0,
      act_deact_modal_title: '',
      is_activating: '',
      is_activating_name:'',
      headers: [{
          text: 'Artículo',
          align: 'start',
          sortable: true,
          value: 'nombre'
        },
        {
          text: 'Codigo',
          sortable: false,
          value: 'codigo'
        },
        {
          text: 'Categoría',
          sortable: false,
          value: 'categoria.nombre'
        },
        {
          text: 'Descripción',
          sortable: false,
          value: 'descripcion'
        },
        {
          text: 'Precio venta',
          sortable: false,
          value: 'precio_venta'
        },
        {
          text: 'Stock',
          sortable: false,
          value: 'stock'
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
      return this.editing === 0 ? 'Nuevo Artículo' : 'Editando Artículo'
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
    this.listar(),
    this.category_list()
  },
  //EndCreated

  methods: {

    category_list() {
      let me = this;
      let categoriasActivas = [];
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      axios.get("categoria/list", configuration)
      .then(function(response){
        categoriasActivas = response.data;
        categoriasActivas.map(function(category){
          me.ddlcateogrias.push({
            text: category.nombre,
            value: category._id
          });
        });
      })
      .catch(function(err){
        console.log(err);
      });
    },

    listar() {
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      axios.get("articulo/list", configuration)
        .then(function(response) {
          me.articulos = response.data;
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    save() {
      //if(this.validation()){return;}
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      if (this.editing === 1) {
        axios.put('articulo/update',
                  {
                   '_id':this.id,
                   'codigo':this.codigo,
                   'nombre':this.nombre,
                   'descripcion':this.descripcion,
                   'precio_venta':this.precio_venta,
                   'stock':this.stock,
                   'estado':this.estado,
                   'categoria':this.categoria
                  },
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
        axios.post('articulo/add',
                  {
                    'codigo':this.codigo,
                    'nombre':this.nombre,
                    'descripcion':this.descripcion,
                    'precio_venta':this.precio_venta,
                    'stock':this.stock,
                    'categoria':this.categoria
                  },
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
      this.codigo = '',
      this.descripcion = '',
      this.precio_venta =  0,
      this.stock = 0,
      this.estado = '',
      this.categoria = '',
      this.is_valid=0,
      this.invalid_message=[],
      this.editing=0
    },

    editItem(item) {
      this.editing = 1;
      this.id = item._id;
      this.nombre = item.nombre;
      this.codigo = item.codigo;
      this.descripcion = item.descripcion;
      this.precio_venta = item.precio_venta;
      this.stock = item.stock;
      this.categoria = item.categoria._id;
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

      axios.put('articulo/'+url,
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
