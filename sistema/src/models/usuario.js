import mongoose, {Schema} from 'mongoose';

const usuarioSchema = new Schema({
  rol: { type:String, maxlength:30, required:true },
  nombre: { type:String, maxlength:50, unique:true, required:true },
  tipo_documento: { type:String, maxlength:50 },
  num_document: { type:String, maxlength:50 },
  direccion: { type:String, maxlength:70 },
  telefono: { type:String, maxlength:20 },
  email: { type:String, maxlength:50, unique:true, required:true },
  password: { type:String, maxlength:75 },
  estado: { type:Number, default:1 },
  created_at: { type:Date, default: Date.now }
});

const Usuario = mongoose.model('usuario', usuarioSchema);
export default Usuario;
