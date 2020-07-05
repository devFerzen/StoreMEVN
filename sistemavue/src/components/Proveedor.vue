<template id="">
<v-layout align-start>

  <v-flex>
    <v-data-table :headers="headers" :items="proveedores" :search="searchedWord" sort-by="nombre" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Proveedores</v-toolbar-title>

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
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex  xs12 sm12 md12 >
                      <v-text-field v-model="nombre" :rules="[rules.required]" label="Nombre del Cliente"></v-text-field>
                    </v-flex>
                    <v-flex  xs12 sm6 md6 >
                      <v-text-field v-model="tipo_persona" label="Tipo"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-select v-model="tipo_documento"
                        :items="tipo_documentos" label="Tipo de documento">
                      </v-select>
                    </v-flex>
                    <v-flex  xs12 sm6 md6 >
                      <v-text-field v-model="num_document" label="Número de documento"></v-text-field>
                    </v-flex>
                    <v-flex  xs12 sm6 md6 >
                      <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                    </v-flex>
                    <v-flex  xs12 sm6 md6 >
                      <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                    </v-flex>
                    <v-flex  xs12 sm6 md6 >
                      <v-text-field v-model="email" :rules="[rules.email]" label="Correo"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 v-show="is_valid">
                      <div class="red--text" v-for="message in invalid_message" :key="message" v-text="message"></div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="act_deact_modal" max-width="300px">
            <v-card>
              <v-card-title class="headline">
                {{act_deact_modal_title}} Usuario!!
              </v-card-title>
              <v-card-text>
                <v-container>
                  Estás a punto de
                  <span v-if="is_activating==1">desactivar</span>
                  <span v-else>activar</span> el cliente {{is_activating_name}}
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
      <template v-slot:item.opciones="{ item }">
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

      <template v-slot:items="proveedor">
        <td>{{proveedor.item.nombre}}</td>
        <td>{{proveedor.item.tipo_persona}}</td>
        <td>{{proveedor.item.tipo_documento}}</td>
        <td>{{proveedor.item.num_document}}</td>
        <td>{{proveedor.item.direccion}}</td>
        <td>{{proveedor.item.telefono}}</td>
        <td>{{proveedor.item.email}}</td>
        <td>{{proveedor.item.estado}}</td>
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
      proveedores: [],
      id:'',
      tipo_persona:'Proveedor',
      nombre:'',
      tipo_documento:'',
      tipo_documentos:['INE','PASSAPORTE'],
      num_document:'',
      direccion:'',
      telefono:'',
      email:'',
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      is_valid:0,
      invalid_message:[],
      dialog: false,
      searchedWord: '',
      act_deact_modal: 0,
      act_deact_modal_title: '',
      is_activating: '',
      is_activating_name:'',
      headers: [{
          text: 'Proveedores',
          align: 'start',
          sortable: true,
          value: 'nombre'
        },
        {
          text: 'Tipo',
          sortable: true,
          value: 'tipo_persona'
        },
        {
          text: 'Tipo de documento',
          sortable: false,
          value: 'tipo_documento'
        },
        {
          text: '# de documento',
          sortable: false,
          value: 'num_document'
        },
        {
          text: 'Dirección',
          sortable: false,
          value: 'direccion'
        },
        {
          text: 'Teléfono',
          sortable: false,
          value: 'telefono'
        },
        {
          text: 'Correo',
          sortable: false,
          value: 'email'
        },
        {
          text: 'Estado',
          sortable: false,
          value: 'estado'
        },
        {
          text: 'Opciones',
          sortable: false,
          value: 'opciones'
        }
      ],
    }
  },

  computed: {
    formTitle() {
      return this.editing === 0 ? 'Nuevo Cliente' : 'Editando Cliente'
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
      axios.get("persona/listProveedor", configuration)
        .then(function(response) {
          me.proveedores = response.data;
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    save() {
      //Usar forma directa de vue if(this.validation()){return;}
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuration = { headers: header };
      if (this.editing === 1) {
        axios.put('persona/update',
                  {'_id':this.id,
                  'tipo_persona':this.tipo_persona,
                  'nombre':this.nombre,
                  'tipo_documento':this.tipo_documento,
                  'direccion':this.direccion,
                  'num_document':this.num_document,
                  'telefono':this.telefono,
                  'email':this.email},
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
        axios.post('persona/add',
                  {
                    'tipo_persona':this.tipo_persona,
                    'nombre':this.nombre,
                    'tipo_documento':this.tipo_documento,
                    'direccion':this.direccion,
                    'num_document':this.num_document,
                    'telefono':this.telefono,
                    'email':this.email
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
      this.tipo_documento='',
      this.num_document='',
      this.direccion='',
      this.telefono='',
      this.email='',

      this.is_valid=0,
      this.invalid_message=[],
      this.editing=0
    },

    editItem(item) {
      this.editing = 1;
      this.id = item._id;
      this.nombre = item.nombre;
      this.tipo_documento = item.tipo_documento;
      this.num_document = item.num_document;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
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

      axios.put('persona/'+url,
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
