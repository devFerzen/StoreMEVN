import models from '../models';

export default{

  add: async(req,res,next) => {
    try {
      const addArticulo = await models.Articulo.create(req.body);
      res.status(200).json(addArticulo);
    } catch (e) {
      res.status(500).send({
        message: 'Articulo no creado'
      });
      next(e);
    }
  },
  update: async (req,res,next) => {
    try {
      const updateArticulo = await models.Articulo
      .useFindAndModify(
        {_id:req.body._id},
        { codigo: req.body.codigo,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          precio_venta: req.body.precio_venta,
          stock: req.body.stock,
          categoria: req.body.categoria });

      if (updateArticulo) {
        res.status(200).json(updateArticulo);
      } else {
        res.status(404).send({
          message: 'Problemas al actualizar el artículo '
        });
      }

    } catch (e) {
      res.status(500).send({
        message: 'Artículo no actualizado'
      });
      next(e);
    }
  },
  list: async (req,res,next) => {
    try {
      let valor = req.query.valor;
      const articulos = await models.Articulo
      .find({$or:[
        {'nombre': new RegExp(valor,'i')},
        {'descripcion': new RegExp(valor,'i')}
      ]}, {createdAt:0})
      .populate('categoria',{nombre:1})
      .sort({'nombre':1});
      res.status(200).json(articulos);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer los articulos'
      });
      next(e);
    }
  },
  delete: async (req,res,next) => {
    try {
      const deleteArticulo = await models.Articulo.findByIdAndDelete({_id:req.body._id});
      res.status(200).json(deleteArticulo);
    } catch (e) {
      res.status(500).send({
        message: 'Articulo wasn´t deleted'
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
      const busqueda = await models.Articulo.findOne({_id:req.query._id})
      .populate('categoria' , {nombre:1});
      if(!busqueda){
        res.status(404).send({
          message: 'Articulo no encontrada'
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
  queryCodigo: async (req,res,next) => {
    try {
      const busqueda = await models.Articulo.findOne({codigo:req.query.codigo})
      .populate('categoria' , {nombre:1});
      if(!busqueda){
        res.status(404).send({
          message: 'Articulo no encontrada'
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
  }
};
