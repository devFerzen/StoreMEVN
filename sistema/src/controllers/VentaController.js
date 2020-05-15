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
      const addVenta = await models.Venta.create(req.body);
      let detalles = req.body.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(true,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(addVenta);
    } catch (e) {
      res.status(500).send({
        message: 'Venta no creada'
      });
      next(e);
    }
  },
  list: async (req,res,next) => {
    try {
      let valor = req.body.valor;

      const ventas = await models.Venta
      .find({$or:[
        {'serie_comprobante': new RegExp(valor,'i')},
        {'num_comprobante': new RegExp(valor,'i')}
      ]})
      .populate('usuarioAlta',{nombre:1})
      .populate('persona',{nombre:1})
      .sort({'created_at':-1});
      res.status(200).json(ventas);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer los ventas'
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
      const busqueda = await models.Venta.findOne({_id:req.query._id})
      .populate('usuarioAlta', {nombre:1})
      .populate('persona', {nombre:1});
      if(!busqueda){
        res.status(404).send({
          message: 'Venta no encontrado'
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
      const updateVenta = await models.Venta.findByIdAndUpdate({_id:req.body._id},{
        estado:1
      });
      let detalles = updateVenta.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(true,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(updateVenta);
    } catch (e) {
      res.status(500).send({
        message: 'Venta fail to update'
      });
      next(e);
    }
  },
  deactivate: async (req,res,next) => {
    try {
      const updateVenta = await models.Venta.findByIdAndUpdate({_id:req.body._id},{
        estado:0
      });
      let detalles = updateVenta.detalles;
      detalles.map(function(detalleArticulo){
        updateStock(false,detalleArticulo._id,detalleArticulo.cantidad);
      });
      res.status(200).json(updateVenta);
    } catch (e) {
      res.status(500).send({
        message: 'Venta fail to update'
      });
      next(e);
    }
  },
  get12MonthsReport: async (req,res,next) => {
    try {
      const reporte = await models.Venta.aggregate(
        [
          {
            $group: {
              _id:{
                mes:{$month:"$created_at"},
                anio:{$year:"$created_at"}
              },
              total:{$sum:"$total"},
              numero:{$sum:1}
            }
          },
          {
            $sort: {
              "_id.anio":-1, "_id.mes":-1
            }
          }
        ]
      ).limit(12);
      res.status(200).json(reporte);
    } catch (e) {
      res.status(500).send({
        message: ' Error al sacar el reporte'
      });
      next(e);
    }
  },
  consultaFechas: async (req,res,next) => {
    try {
      let desde = req.body.desde;
      let hasta = req.body.hasta;

      const ventas = await models.Venta
      .find({'created_at': {"$gte": desde, "$lt": hasta}})
      .populate('usuarioAlta',{nombre:1})
      .populate('persona',{nombre:1})
      .sort({'created_at':-1});
      res.status(200).json(ventas);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer los ventas'
      });
      next(e);
    }
  }
};
