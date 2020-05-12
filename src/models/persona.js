import mongoose, {Schema} from 'mongoose';

const personaSchema = new Schema({
  tipo_persona: { type:String, maxlength:30, required:true },
  nombre: { type:String, maxlength:50, unique:true, required:true },
  tipo_documento: { type:String, maxlength:50 },
  num_document: { type:String, maxlength:50 },
  direccion: { type:String, maxlength:70 },
  telefono: { type:String, maxlength:20 },
  email: { type:String, maxlength:50},
  estado: { type:Number, default:1 },
  created_at: { type:Date, default: Date.now }
});

const Persona = mongoose.model('persona', personaSchema);
export default Persona;
