<template id="">
<v-layout align-start>

  <v-flex>
    <v-dialog v-model="modal_seleccion_articulo" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">Seleccione un artículo</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 xl12>

                <v-text-field v-model="articulo_buscado" @keyup.enter="listarArticulos()" class="text-xs-center" append-icon="search" label="Búsqueda">
                </v-text-field>

                <template>
                  <v-data-table :headers="articulos_table" :items="articulos" class="elevation-1">


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
                    <template v-slot:item.seleccion="{ item }">
                      <td>
                        <v-icon small @click="agregarArticuloNuevo(item)">
                          add
                        </v-icon>
                      </td>
                    </template>

                  </v-data-table>
                </template>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarModalArticulo">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Seleccion de nuevo articulo-->

    <v-data-table :headers="headers" :items="ingresos" :search="searchedWord" sort-by="nombre" class="elevation-1" v-if="nuevo_ingreso_view===0">
      <template v-slot:top>
        <v-toolbar text color="white">
          <v-toolbar-title>Ingresos</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="searchedWord" append-icon="search" label="Búsqueda" single-line hide-details v-if="nuevo_ingreso_view===0"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="nuevoArticulo();" v-if="nuevo_ingreso_view===0">Nuevo</v-btn>

          <v-dialog v-model="act_deact_modal" max-width="300px">
            <v-card>
              <v-card-title class="headline">
                {{act_deact_modal_title}} Ingreso!!
              </v-card-title>
              <v-card-text>
                <v-container>
                  Estás a punto de
                  <span v-if="is_activating==1">desactivar</span>
                  <span v-else>activar</span> el ingreso {{is_activating_name}}
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
        <v-icon small class="mr-2" @click="verIngreso(item)">
          tab
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

      <template v-slot:items="ingreso">
        <td>{{ingreso.item.usuarioAlta.nombre}}</td>
        <td>{{ingreso.item.persona.nombre}}</td>
        <td>{{ingreso.item.tipo_comprobante}}</td>
        <td>{{ingreso.item.serie_comprobante}}</td>
        <td>{{ingreso.item.num_comprobante}}</td>
        <td>{{ingreso.item.impuestos}}</td>
        <td>{{ingreso.item.total}}</td>
        <td>{{ingreso.item.created_at}}</td>
        <td>{{ingreso.item.estado}}</td>
      </template>
      <template v-slot:item.estado="{item}">
        <div v-if="item.estado">
          <span class="blue--text">Aceptado</span>
        </div>
        <div v-else>
          <span class="red--text">Anulado</span>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()">Reset</v-btn>
      </template>
    </v-data-table>

    <v-container grid-list-sm class="pa-4 white" v-if="nuevo_ingreso_view">
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-select v-model="tipo_comprobante" :items="tipos_decomprobantes" label="Tipo Comprobante">
          </v-select>
        </v-flex>

        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-text-field v-model="serie_comprobante" label="Serie de comprobante"></v-text-field>
        </v-flex>

        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-text-field v-model="num_comprobante" label="# de comprobante"></v-text-field>
        </v-flex>

        <v-flex xs12 sm8 md8 lg8 xl8>
          <v-autocomplete v-model="persona" :items="personas" label="Proveedor"></v-autocomplete>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-text-field v-model="impuestos" label="Impuesto" type="Number"></v-text-field>
        </v-flex>

        <v-flex xs12 sm8 md8 lg8 xl8>
          <v-text-field v-model="codigo" label="Código" @keyup.enter="busquedaCodigo()"></v-text-field>
        </v-flex>
        <v-flex xs12 sm2 md2 lg2 xl2>
          <v-btn small fab dark color="teal">
            <v-icon dark @click="mostrarModalArticulo()">list</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm2 md2 lg2 xl2 v-if="erroBuscadorCodigo">
          <div class="red--text" v-text="erroBuscadorCodigo"></div>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <template>
            <v-data-table :headers="detalles_table" :items="detalles" hide-default-footer class="elevation-1">
              <template v-slot:items="detalle">
                <td>{{detalle.item.nombre}}</td>
              </template>

              <template v-slot:item.cantidad="props">
                <v-edit-dialog :return-value.sync="props.item.cantidad" @save="saveCantidad" @cancel="cancelCantidad" @open="openCantidad" @close="closeCantidad"> {{ props.item.cantidad }}
                  <template v-slot:input>
                    <v-text-field v-model="props.item.cantidad" :rules="[rules.max25chars]" label="Edit" single-line counter></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.precio="props">
                <v-edit-dialog :return-value.sync="props.item.precio" @save="savePrecio" @cancel="cancelPrecio" @open="openPrecio" @close="closePrecio"> {{ props.item.precio }}
                  <template v-slot:input>
                    <v-text-field v-model="props.item.precio" :rules="[rules.max25chars]" label="Edit" single-line counter></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.subtotal="{item}">
                <td>{{item.precio * item.cantidad}}</td>
              </template>

              <template v-slot:item.borrar="{item}">
                <td>
                  <v-icon small class="mr-2" @click="eliminarArticuloDetalles(detalles,item)">
                    delete
                  </v-icon>
                </td>
              </template>

              <template v-slot:no-data>
                <h3>No hay artículos en esté ingreso</h3>
              </template>
            </v-data-table>

            <v-flex class="text-xs-right">
              <strong>Total sin iva: </strong>
              <p>$ {{total_sin_impuesto = ( total - total_con_impuesto )}}</p>
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>iva: </strong>
              <p>$ {{ total_con_impuesto = ((total * impuestos) / (1 + impuestos)).toFixed(2) }}</p>
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total: </strong>
              <p>$ {{total = calcularTotalIngreso}}</p>
            </v-flex>
          </template>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-btn color="blue darken-1" text @click.native="ocultarNuevoIngreso()">Cancelar</v-btn>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-btn color="succes" v-if="guardar_desactivado == 1" @click.native="save()">Guardar</v-btn>
        </v-flex>

      </v-layout>
    </v-container>

  </v-flex>
  <!--vflex container-->
</v-layout>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      ingresos: [],
      editing: 0,
      id: '',
      persona: '',
      personas: [],
      tipo_comprobante: '',
      tipos_decomprobantes: ['Boleta', 'Factura', 'Ticket'],
      serie_comprobante: '',
      num_comprobante: '',
      impuestos: 0.18,
      codigo: '',
      guardar_desactivado:1,
      detalles: [],
      detalles_table: [{
          text: 'Artículo',
          align: 'start',
          sortable: true,
          value: 'nombre'
        },
        {
          text: 'Cantidad',
          sortable: true,
          value: 'cantidad'
        },
        {
          text: 'Precio',
          sortable: true,
          value: 'precio'
        },
        {
          text: 'Sub Total',
          sortable: false,
          value: 'subtotal'
        },
        {
          text: 'Borrar',
          sortable: false,
          value: 'borrar'
        },
      ],
      nuevo_ingreso_view: 0,

      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        max25chars: value => value.length <= 50 || 'Max 50 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },

      total: 0,
      total_sin_impuesto: 0,
      total_con_impuesto: 0,

      modal_seleccion_articulo: false,

      articulos: [],
      articulo_buscado: '',
      articulos_table: [{
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
          text: 'Selecionar',
          value: 'seleccion',
          sortable: false
        }
      ],


      is_valid: 0,
      invalid_message: [],
      dialog: false,
      searchedWord: '',
      act_deact_modal: 0,
      act_deact_modal_title: '',
      is_activating: '',
      is_activating_name: '',
      userLogged: this.$store.state.usuario._id,
      erroBuscadorCodigo: null,
      headers: [{
          text: 'Usuario',
          align: 'start',
          sortable: true,
          value: 'usuarioAlta.nombre'
        },
        {
          text: 'Tipo',
          sortable: true,
          value: 'persona.nombre'
        },
        {
          text: 'Tipo de Comprobante',
          sortable: false,
          value: 'tipo_comprobante'
        },
        {
          text: 'Serie de Comprobante',
          value: 'serie_comprobante',
          sortable: false
        },
        {
          text: '# de Comprobante',
          value: 'num_comprobante',
          sortable: false
        },
        {
          text: 'Impuestos',
          value: 'impuestos',
          sortable: false
        },
        {
          text: 'Total',
          sortable: false,
          value: 'total'
        },
        {
          text: 'Fecha',
          sortable: true,
          value: 'created_at'
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
      return this.editing === 0 ? 'Nuevo Usuario' : 'Editando Usuario'
    },

    calcularTotalIngreso() {
      let total = 0;
      this.detalles.forEach((detalle) => {
        total = total + (detalle.precio * detalle.cantidad);
      });

      return total;
    }

  },

  //EndComputed

  watch: {
    modal_seleccion_articulo(val) {
      val || this.cerrarModalArticulo()
    },
  },
  //EndWatch

  created() {
    this.listar(),
      this.listarPersonas(),
      this.listarArticulos()
  },
  //EndCreated

  methods: {
    listar() {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("ingreso/list", configuration)
        .then(function(response) {
          me.ingresos = response.data;
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    listarPersonas() {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };

      let proveedorArray = [];
      axios.get("persona/listProveedor", configuration)
        .then(function(response) {
          proveedorArray = response.data;
          proveedorArray.map(function(x) {
            me.personas.push({
              text: x.nombre,
              value: x._id
            });
          });
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    busquedaCodigo() {
      let me = this;
      me.erroBuscadorCodigo = null;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("articulo/queryCodigo?codigo=" + this.codigo, configuration)
        .then(function(response) {
          me.agregarArticuloNuevo(response.data);
          me.codigo = '';
        })
        .catch(function(err) {
          me.erroBuscadorCodigo = 'No Existe el artículo';
        })
    },
    agregarArticuloNuevo(data) {
      let me = this;
      me.errorBuscadorCodigo = null;
      if (me.articuloExistInDetalles(data._id) == 1) {
        me.erroBuscadorCodigo = 'Artículo ya existe.';
        return;
      }

      me.detalles.push({
        _id: data._id,
        nombre: data.nombre,
        cantidad: 1,
        precio: data.precio_venta
      });
    },
    articuloExistInDetalles(id) {
      let itExist = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id === id) {
          itExist = 1;
          break;
        }
      }
      return itExist;
    },
    eliminarArticuloDetalles(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    nuevoArticulo() {
      this.nuevo_ingreso_view = 1;
    },
    ocultarNuevoIngreso() {
      this.nuevo_ingreso_view = 0;
      this.limpiarSeccionIngreso();
      this.guardar_desactivado = 1;
    },
    listarArticulos() {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("articulo/list?valor=" + this.articulo_buscado, configuration)
        .then(function(response) {
          me.articulos = response.data;
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    mostrarModalArticulo() {
      this.modal_seleccion_articulo = true;
    },
    cerrarModalArticulo() {
      this.modal_seleccion_articulo = false;
    },
    /*Regresa los detalles de un Ingreso*/
    DetallesIngreso(Id) {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("ingreso/query?_id="+Id, configuration)
        .then(function(response) {
          me.detalles = response.data.detalles;
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    verIngreso(item){
      this.limpiarSeccionIngreso();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.persona = item.persona;
      this.impuestos = item.impuestos;
      this.DetallesIngreso(item._id);
      this.nuevoArticulo();
      this.guardar_desactivado = 0;
    },
    save() {
      //Usar forma directa de vue if(this.validation()){return;}
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.post('ingreso/add', {
            'usuarioAlta': this.$store.state.usuario._id,
            'persona': this.persona,
            'tipo_comprobante': this.tipo_comprobante,
            'serie_comprobante': this.serie_comprobante,
            'num_comprobante': this.num_comprobante,
            'impuestos': this.impuestos,
            'total': this.total,
            'detalles': this.detalles
          },
          configuration)
        .then(function(response) {
          me.limpiarSeccionIngreso();
          me.listar();
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        })
    },
    limpiarSeccionIngreso() {
        this.id = '';
        this.persona = '';
        this.tipo_comprobante = '';
        this.serie_comprobante = '';
        this.num_comprobante = '';
        this.codigo = '';
        this.detalles = '';
        this.total_sin_impuesto = 0;
        this.total = 0;
        this.total_con_impuesto = 0;
        this.detlles = [];
        this.nuevo_ingreso_view = 0;

    },
    modalActDesact(item) {
      this.act_deact_modal = 1;
      this.is_activating = item.estado;
      this.act_deact_modal_title = item.estado === 1 ? 'Desactivar' : 'Activar';
      this.is_activating_name = item.num_comprobante;
      this.id = item._id;
    },
    actDesactItem() {
      let url = 'activate';
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      if (this.is_activating === 1) {
        url = 'deactivate';
      }

      axios.put('ingreso/' + url, {
            '_id': this.id
          },
          configuration)
        .then(function(response) {
          me.listar();
          me.modalActDesactCloseClean();
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        })
    },
    modalActDesactCloseClean() {
      this.act_deact_modal = 0;
      this.is_activating = '';
      this.act_deact_modal_title = '';
      this.is_activating_name = '';
      this.id = '';
    },
    validation() {
      this.is_valid = 0;
      this.invalid_message = [];
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.invalid_message.push('El nombre debe de ser de 1 a 50 caracteres.');
      }
      if (this.descripcion.length > 255) {
        this.invalid_message.push('La descripcion no puede ser de más de 255 caracteres.');
      }
      if (this.invalid_message.length) {
        this.is_valid = 1;
      }
      return this.is_valid;
    },
    close() {
      this.dialog = false,
        this.limpiarSeccionIngreso();
    },
    saveCantidad() {
      console.log('Cantidad Dialog save');
    },
    cancelCantidad() {
      console.log('Cantidad Dialog cancel');
    },
    openCantidad() {
      console.log('Cantidad Dialog open');
    },
    closeCantidad() {
      console.log('Cantidad Dialog closed');
    },
    savePrecio() {
      console.log(' Precio Dialog save');
    },
    cancelPrecio() {
      console.log(' Precio Dialog cancel');
    },
    openPrecio() {
      console.log(' Precio Dialog open');
    },
    closePrecio() {
      console.log(' Precio Dialog closed');
    },

  },
  //EndMethods

}
</script>
