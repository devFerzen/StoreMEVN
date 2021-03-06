import mongoose,{Schema} from 'mongoose';

const categoriaSchema = new Schema ({
  nombre : {type:String, maxlength:50, unique:true, required:true},
  descripcion : {type:String, maxlength:255},
  estado : {type:Number, default:1},
  createdAt : {type:Date, default:Date.now()}
});

//Declararlo como un modelo
const Categoria = mongoose.model('cateogria',categoriaSchema);
//Exportarlo
export default Categoria;
