import models from '../models';
import bcrypt from 'bcryptjs';
import token from '../services/token';

export default {
  add: async(req,res,next) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password,10);
      const nuevoUsuario = await models.Usuario.create(req.body);
      res.status(200).json(nuevoUsuario);
    } catch (e) {
      res.status(500).send({
        message: 'Error al crear el usuario'
      });
      next(e);
    }
  },
  update: async(req,res,next) => {
    try {
      let password = req.body.password;
      const comparacionUsuario = await models.Usuario
      .findOne({_id:req.body._id});

      if (password != comparacionUsuario.password) {
        req.body.password = await bcrypt.hash(req.body.password,10);
      }

      const updateUsuario = await models.Usuario
      .findByIdAndUpdate({_id:req.body._id},{
        rol: req.body.rol,
        nombre: req.body.nombre,
        tipo_documento: req.body.tipo_documento,
        num_document: req.body.num_document,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        password: req.body.password
      });
      res.status(200).json(updateUsuario);
    } catch (e) {
      res.status(500).send({
        message: 'Error al actualizar el usuario'
      });
      next(e);
    }
  },
  remove: async(req,res,next) => {
    try {
      const deleteUsuario = await models.Usuario
      .findByIdAndDelete({_id:req.body._id});
      res.status(200).json(deleteUsuario);
    } catch (e) {
      res.status(500).send({
        message: 'Error al eliminar el usuario'
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
      const usuarioBuscado = await models.Usuario
      .findOne({_id:req.body._id});

      if (!usuarioBuscado) {
        res.status(404).send({
          message: 'Usuario no existe'
        });
      } else {
        req.status(200).json(usuarioBuscado);
      }

    } catch (e) {
      res.status(500).send({
        message: 'Ocurrio un problema en la busqueda'
      });
      next(e);
    }
  },
  list: async (req,res,next) => {
    try {
      const valor = req.query.valor;
      const listaUsuarios = await models.Usuario
      .find({$or:[
        {'nombre': new RegExp(valor,'i')},
        {'email': new RegExp(valor,'i')}
      ]},{password:0})
      .sort({'nombre':1});
      res.status(200).json(listaUsuarios);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer lista de usuarios'
      });
      next(e);
    }
  },
  activate: async (req,res,next) => {
    try {
      const updateUsuario = await models.Usuario
      .findByIdAndUpdate({_id:req.body._id},{
        estado: 1
      });
      res.status(200).json(updateUsuario);
    } catch (e) {
      res.status(500).json({
        message: 'No se pudo activar usuario'
      });
      next(e);
    }
  },
  deactivate: async (req,res,next) => {
    try {
      const updateUsuario = await models.Usuario
      .findByIdAndUpdate({_id:req.body._id},{
        estado: 0
      });
      res.status(200).json(updateUsuario);
    } catch (e) {
      res.status(500).json({
        message: 'No se pudo activar usuario'
      });
      next(e);
    }
  },
  login: async (req,res,next) => {
    try {
      let userLogged = await models.Usuario
      .findOne({email:req.body.email,estado:1});

      if(userLogged){
        let match = await bcrypt.compare(req.body.password,userLogged.password);
        if(match){
          let tokenReturn = await token.encode(userLogged._id,
                                                userLogged.rol,
                                                userLogged.email);
          res.status(200).json({userLogged,tokenReturn});
        } else {
          res.status(404).json('Contraseña incorrecta');
        }
      }else {
        res.status(404).send({
          message: 'Usuario no existe'
        });
      }
    } catch (e) {
      res.status(500).send({
        message: 'Error al loggearse'
      });
      next(e);
    }
  }


};
