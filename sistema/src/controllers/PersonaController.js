import models from '../models';

export default {
  add: async (req, res, next) => {
    try {
      const personaData = await models.Persona.create(req.body);
      res.status(200).json(personaData);
    } catch (e) {
      res.status(500).send({
        message: 'Error al crear la persona'
      });
      next(e);
    }
  },
  listClientes: async (req, res, next) => {
    try {
      const valor = req.query.valor;
      const personas = await models.Persona.find({
        $or: [{
            'nombre': new RegExp(valor, 'i')
          },
          {
            'email': new RegExp(valor, 'i')
          }
        ],
        'tipo_persona': 'Cliente'
      }).sort({
        created_at: -1
      });

      res.status(200).json(personas);
    } catch (e) {
      res.status(500).send({
        message: 'Error la buscar a las personas'
      });
    }
  },
  list: async (req, res, next) => {
    try {
      const valor = req.query.valor;
      const listaPersonas = await models.Persona
        .find({
          $or: [{
              'nombre': new RegExp(valor, 'i')
            },
            {
              'email': new RegExp(valor, 'i')
            }
          ]
        })
        .sort({
          'created_at': -1
        });
      res.status(200).json(listaPersonas);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer lista de personas'
      });
      next(e);
    }
  },
  listProveedor: async (req, res, next) => {
    try {
      const valor = req.body.valor;
      const listaPersonas = await models.Persona
        .find({
          $or: [{
              'nombre': new RegExp(valor, 'i')
            },
            {
              'email': new RegExp(valor, 'i')
            }
          ],
          'tipo_persona': 'Proveedor',
        })
        .sort({
          'nombre': 1
        });
      res.status(200).json(listaPersonas);
    } catch (e) {
      res.status(500).send({
        message: 'Error al extraer lista de Proveedores'
      });
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const updatePersona = await models.Persona
        .findByIdAndUpdate({
          _id: req.body._id
        }, {
          tipo_persona: req.body.tipo_persona,
          nombre: req.body.nombre,
          tipo_documento: req.body.tipo_documento,
          num_document: req.body.num_document,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          email: req.body.email
        });
        res.status(200).json(updatePersona);
    } catch (e) {
      res.status(500).send({
        message: 'Error al actualizar la persona'
      });
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const deletePersona = await models.Persona
        .findByIdAndDelete({
          _id: req.body._id
        });
      res.status(200).json(deletePersona);
    } catch (e) {
      res.status(500).send({
        message: 'Error al eliminar a la persona'
      });
      next(e);
    }
  },
  query: async (req, res, next) => {
    try {
      const personaBuscado = await models.Persona
        .findOne({
          _id: req.body._id
        });

      if (!personaBuscado) {
        res.status(404).send({
          message: 'Persona no existe'
        });
      } else {
        req.status(200).json(personaBuscado);
      }

    } catch (e) {
      res.status(500).send({
        message: 'Ocurrio un problema en la busqueda'
      });
      next(e);
    }
  },
  activate: async (req,res,next) => {
    try {
      const updatePersona = await models.Persona
      .findByIdAndUpdate({_id:req.body._id},{
        estado: 1
      });
      res.status(200).json(updatePersona);
    } catch (e) {
      res.status(500).json({
        message: 'No se pudo activar a la persona'
      });
      next(e);
    }
  },
  deactivate: async (req,res,next) => {
    try {
      const updatePersona = await models.Persona
      .findByIdAndUpdate({_id:req.body._id},{
        estado: 0
      });
      res.status(200).json(updatePersona);
    } catch (e) {
      res.status(500).json({
        message: 'No se pudo desactivar a la persona'
      });
      next(e);
    }
  },
};
