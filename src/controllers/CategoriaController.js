import models from '../models';

export default {
  add: async (req,res,next) => {
    try {
      const nuevaCategoria = await models.Categoria.create(req.body);
      res.status(200).json(nuevaCategoria);
    } catch (e) {
      res.status(500).send({
        message: 'Error al guardar'
      });
      next(e);
    }
  },
  update: async (req,res,next) => {
    try {
      const updateCategoria = await models.Categoria.findByIdAndUpdate({_id:req.body._id},{
        nombre: req.body.nombre,
        descripcion:req.body.descripcion
      });
      res.status(200).json(updateCategoria);
    } catch (e) {
        res.status(500).send({
          message: 'Categoria no actualizada'
        });
        next(e);
    }
  },
  delete: async (req,res,next) => {
    try {
      const deleteCategoria = await models.Categoria.findByIdAndDelete({_id:req.body._id});
      res.status(200).json(deleteCategoria);
    } catch (e) {
      res.status(500).send({
        message: 'Category wasn´t deleted'
      });
      next(e);
    }
  },
  list: async (req,res,next) => {
    try {
      /*
      * (i) es para mayusculas y minusculas
      */
      let valor = req.query.valor;
      const listadoCategorias = await models.Categoria
      .find({$or:[
            {'nombre': new RegExp(valor,'i')},
            {'descripcion': new RegExp(valor,'i')}
          ]},{nombre:1})
      .sort({'nombre':1});
      res.status(200).json(listadoCategorias);
    } catch (e) {
      res.status(500).send({
        message: 'Ocurrio un error en listado'
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
      const busqueda = await models.Categoria.findOne({_id:req.query._id});
      if(!busqueda){
        res.status(404).send({
          message: 'Categoria no encontrada'
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
      const updateCategoria = await models.Categoria.findByIdAndUpdate({_id:req.body._id},{
        estado:1
      });
      res.status(200).json(updateCategoria);
    } catch (e) {
      res.status(500).send({
        message: 'Category fail to update'
      });
      next(e);
    }
  },
  deactivate: async (req,res,next) => {
    try {
      const updateCategoria = await models.Categoria.findByIdAndUpdate({_id:req.body._id},{
        estado:0
      });
      res.status(200).json(updateCategoria);
    } catch (e) {
      res.status(500).send({
        message: 'Category fail to update'
      });
      next(e);
    }
  }
};
