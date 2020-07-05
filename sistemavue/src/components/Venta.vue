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
    <!--Dialog Seleccion de nuevo articulo-->

    <v-dialog v-model="modal_comprobante_venta" max-width="1000px">
      <v-card>
        <v-card-title class="headline">
          <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn> Reporte de venta
        </v-card-title>
        <v-card-text>
          <div id="factura">
            <header>
                <div id="logo">

                    <img src="data:image/png;base64,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" id="imagen">
                </div>
                <div id="datos">
                    <p id="encabezado">
                        <b>IncanatoIT</b><br>José Gálvez 1368, Chongoyape - Chiclayo, Perú<br>Telefono:(+51)931742904<br>Email:jcarlos.ad7@gmail.com
                    </p>
                </div>
                <div id="fact">
                    <p>{{tipo_comprobante}}<br>
                    {{serie_comprobante}}-{{num_comprobante}}<br>
                    {{created_at}}</p>
                </div>
            </header>
            <br>
            <section>
                <div>
                    <table id="facliente">
                        <tbody>
                            <tr>
                                <td id="cliente">
                                    <strong>Sr(a). {{persona.nombre}}</strong><br>
                                    <strong>Documento:</strong> {{persona.num_document}}<br>
                                    <strong>Dirección:</strong> {{persona.direccion}}<br>
                                    <strong>Teléfono:</strong> {{persona.telefono}}<br>
                                    <strong>Email:</strong> {{persona.email}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <br>
            <section>
                <div>
                    <table id="facarticulo">
                        <thead>
                            <tr id="fa">
                                <th>CANT</th>
                                <th>DESCRIPCION</th>
                                <th>PRECIO UNIT</th>
                                <th>DESC.</th>
                                <th>PRECIO TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for=" det in detalles" :key="det._id">
                                <td style="text-align:center;">{{det.cantidad}}</td>
                                <td>{{det.nombre}}</td>
                                <td style="text-align:right;">{{det.precio}}</td>
                                <td style="text-align:right;">{{det.descuento}}</td>
                                <td style="text-align:right;">{{(det.cantidad * det.precio)-det.descuento}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">SUBTOTAL</th>
                                <th style="text-align:right;">$ {{total_sin_impuesto = ( total - total_con_impuesto )}}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">IVA</th>
                                <th style="text-align:right;">$ {{ total_con_impuesto = ((total * impuestos) / (1 + impuestos)).toFixed(2) }}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">TOTAL</th>
                                <th style="text-align:right;">$ {{total = calcularTotalIngreso}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
            <br>
            <br>
            <footer>
                <div id="gracias">
                    <p><b>Gracias por su compra!</b></p>
                </div>
            </footer>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="ocultarComprobanteVenta()" color="blue darken-1" text>Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog><!--Modal de comprobante venta, imagen de base64-->

    <v-data-table :headers="headers" :items="ventas" :search="searchedWord" sort-by="nombre" class="elevation-1" v-if="nuevo_ingreso_view===0">

      <template v-slot:top>
        <v-toolbar text color="white">
          <v-toolbar-title>Ventas</v-toolbar-title>

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
          </v-dialog><!--messageRuSure-->

        </v-toolbar>
      </template><!--header-->

      <template v-slot:item.opciones="{ item }">
        <v-icon small class="mr-2" @click="verVenta(item)">
          tab
        </v-icon>
        <v-icon small class="mr-2" @click="mostrarComprobanteVenta(item)">
          print
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

      <template v-slot:items="venta">
        <td>{{venta.item.usuarioAlta.nombre}}</td>
        <td>{{venta.item.persona.nombre}}</td>
        <td>{{venta.item.tipo_comprobante}}</td>
        <td>{{venta.item.serie_comprobante}}</td>
        <td>{{venta.item.num_comprobante}}</td>
        <td>{{venta.item.impuestos}}</td>
        <td>{{venta.item.total}}</td>
        <td>{{venta.item.created_at}}</td>
        <td>{{venta.item.estado}}</td>
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
    </v-data-table><!--Tabla principal de Ventas-->

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
          <v-autocomplete v-model="persona._id" :items="personas" label="Cliente"></v-autocomplete>
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
                    <v-text-field v-model="props.item.cantidad" label="Edit" single-line counter></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.precio="{item}">
                <v-edit-dialog :return-value.sync="item.precio" @save="savePrecio" @cancel="cancelPrecio" @open="openPrecio" @close="closePrecio"> {{ item.precio }}
                  <template v-slot:input>
                    <v-text-field v-model="item.precio" label="Edit" single-line counter></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.descuento="{item}">
                <v-edit-dialog :return-value.sync="item.descuento" @save="savePrecio" @cancel="cancelPrecio" @open="openPrecio" @close="closePrecio"> {{ item.descuento }}
                  <template v-slot:input>
                    <v-text-field v-model="item.descuento" label="Edit" single-line counter></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.subtotal="{item}">
                <td>{{(item.precio * item.cantidad) - item.descuento}}</td>
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
    </v-container><!--new/updateIngreso-->

  </v-flex>
  <!--vflex container-->
</v-layout>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      ventas: [],
      editing: 0,
      id: '',
      persona: '',
      personas: [],
      tipo_comprobante: '',
      tipos_decomprobantes: ['Boleta', 'Factura', 'Ticket'],
      serie_comprobante: '',
      num_comprobante: '',
      impuestos: 0.18,
      created_at:'',
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
          text: 'Descuento',
          sortable: true,
          value: 'descuento'
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
      modal_comprobante_venta:false,

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
          text: 'Cliente',
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
      Array.prototype.forEach.call(this.detalles, detalle => {
        total = total + ( (detalle.precio * detalle.cantidad) - detalle.descuento);
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
    crearPDF(){
      var quotes = document.getElementById('factura');
      html2canvas(quotes).then(function (canvas) {
          var imgData = canvas.toDataURL('image/png');
          var imgWidth = 210;
          var pageHeight = 295;

          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;

          var doc = new jsPDF('p', 'mm', 'a4');
          var position = 0;

          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              doc.addPage();
              doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
          }
          doc.save('ComprobanteVenta.pdf');
      });
    },
    listar() {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("venta/list", configuration)
        .then(function(response) {
          me.ventas = response.data;
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
      axios.get("persona/listClientes", configuration)
        .then(function(response) {
          proveedorArray = response.data;
          proveedorArray.map(function(x) {
            me.personas.push({
              value: x._id,
              text: x.nombre
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
        precio: data.precio_venta,
        descuento: 0
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
    DetallesVenta(Id) {
      let me = this;
      let header = {
        "token": this.$store.state.token
      };
      let configuration = {
        headers: header
      };
      axios.get("venta/query?_id="+Id, configuration)
        .then(function(response) {
          me.detalles = response.data.detalles;
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    verVenta(item){
      this.limpiarSeccionIngreso();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.persona = item.persona;
      this.impuestos = item.impuestos;
      this.DetallesVenta(item._id);
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
      axios.post('venta/add', {
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

      axios.put('venta/' + url, {
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
    mostrarComprobanteVenta(item){
      this.limpiarSeccionIngreso();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.persona = item.persona;
      this.created_at = item.created_at;
      this.impuestos = item.impuestos;
      this.DetallesVenta(item._id);
      this.modal_comprobante_venta = true;
    },
    ocultarComprobanteVenta(){
      this.modal_comprobante_venta = false;
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

<style>
  #factura {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 16px ;
    }

    #logo {
        float: left;
        margin-left: 2%;
        margin-right: 2%;
    }
    #imagen {
        width: 100px;
    }

    #fact {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }

    #datos {
        float: left;
        margin-top: 0%;
        margin-left: 2%;
        margin-right: 2%;
        /*text-align: justify;*/
    }

    #encabezado {
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
    }

    section {
        clear: left;
    }

    #cliente {
        text-align: left;
    }

    #facliente {
        width: 40%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 15px;
    }

    #fa {
        color: #FFFFFF;
        font-size: 14px;
    }

    #facarticulo {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }

    #facarticulo thead {
        padding: 20px;
        background: #2183E3;
        text-align: center;
        border-bottom: 1px solid #FFFFFF;
    }

    #gracias {
        text-align: center;
    }
</style>
