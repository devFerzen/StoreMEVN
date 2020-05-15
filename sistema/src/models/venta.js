import mongoose, {Schema} from 'mongoose';

const ventaSchema = new Schema({
  usuarioAlta: { type: Schema.Types.ObjectId, ref:'usuario'},
  persona: { type: Schema.Types.ObjectId, ref:'persona'},
  tipo_comprobante: { type:String, maxlength:20, required:true},
  serie_comprobante: { type:String, maxlength:7},
  num_comprobante: { type:String, maxlength:10, required:true},
  impuestos: { type:Number, required:true, default:0.0},
  total: { type:Number, required:true},
  detalles: [{
    _id: { type: String, required:true},
    precio: { type: Number, required:true},
    nombre: { type:String, required:true},
    cantidad: { type:Number, required:true},
    descuento: { type:Number, required:true}
  }],
  estado: { type:Number, default:1},
  created_at: { type:Date, default: Date.now}
});

const Venta = mongoose.model('venta',ventaSchema);
export default Venta;

//Mongoose tabla embebida
