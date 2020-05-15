import mongoose, {Schema} from 'mongoose';

const articuloSchema = new Schema({
  codigo: {type:String, maxlength:64 ,required:true},
  nombre: {type:String, maxlength:50 ,required:true, unique: true},
  descripcion: {type:String, maxlength:255},
  precio_venta: {type:Number ,required:true},
  stock: {type:Number ,required:true},
  estado: {type:Boolean , default:1},
  createdAt: {type:Date, default:Date.now()},
  categoria: {type: Schema.Types.ObjectId, ref: 'cateogria'}
});

const Articulo = mongoose.model('articulo',articuloSchema);
export default Articulo;
