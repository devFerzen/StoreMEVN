import models from '../models';

//Private functions
async function updateStock( disminuir, idArticulo, cantidad){
  let signOperator = '+';
  if (!!disminuir) { signOperator = '-'; }

  let {stock} = await models.Articulo.findOne({_id:idArticulo});
  let nuevoStock = eval(parseInt(stock) + signOperator + parseInt(cantidad));
  const savingStock = await models.Articulo.findByIdAndUpdate(
    {_id:idArticulo},
    {stock:nuevoStock}
  );
}

export default {
  add: async(req,res,next) => {
    try {
      const addIngreso = await models.Ingreso.create(req.body);
      let detalles = req.body.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(false,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(addIngreso);
    } catch (e) {
      res.status(500).send({
        message: 'Ingreso no creado'
      });
      next(e);
    }
  },
  list: async (req,res,next) => {
    try {
      let valor = req.body.valor;

      const ingresos = await models.Ingreso
      .find({$or:[
        {'serie_comprobante': new RegExp(valor,'i')},
        {'num_comprobante': new RegExp(valor,'i')}
      ]})
      .populate('usuarioAlta',{nombre:1})
      .populate('persona',{nombre:1})
      .sort({'created_at':-1});
      res.status(200).json(ingresos);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer los ingresos'
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
      const busqueda = await models.Ingreso.findOne({_id:req.query._id})
      .populate('usuarioAlta', {nombre:1})
      .populate('persona', {nombre:1});
      if(!busqueda){
        res.status(404).send({
          message: 'Ingreso no encontrado'
        });
      }else{
        res.status(200).json(busqueda);
      }
    } catch (e) {
      res.status(500).send({
        message: 'Error en la busqueda'
      });
      next(e);
    }
  },
  activate: async (req,res,next) => {
    try {
      const updateIngreso = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{
        estado:1
      });
      let detalles = updateIngreso.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(false,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(updateIngreso);
    } catch (e) {
      res.status(500).send({
        message: 'Ingreso fail to update'
      });
      next(e);
    }
  },
  deactivate: async (req,res,next) => {
    try {
      const updateIngreso = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{
        estado:0
      });
      let detalles = updateIngreso.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(true,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(updateIngreso);
    } catch (e) {
      res.status(500).send({
        message: 'Ingreso fail to update'
      });
      next(e);
    }
  }
};
