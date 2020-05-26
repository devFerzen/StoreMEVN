import token from '../services/token';

export default {
  verifyRole: async (req, res, next) => {
    let userToken = req.headers.token;
    const verifiyingUser = await token.decode(userToken);

    if (!verifiyingUser.rol) {
      res.status(403).send({
        message: 'Ningún token identificado'
      });
    }
    if (verifiyingUser.rol == 'Administrador' || verifiyingUser.rol == 'Vendedor' || verifiyingUser.rol == 'Almacenero') {
      next();
    } else {
      req.status(403).send({
        message: 'Sin autorización'
      });
    }
  },

  verifyAdmin: async (req, res, next) => {
    let userToken = req.headers.token;
    const verifiyingUser = await token.decode(userToken);
    if (!verifiyingUser.rol) {
      res.status(404).send({
        message: 'Ningún token identificado'
      });
    }

    if (verifiyingUser.rol == 'Administrador') {
      next();
    } else {
      res.status(403).send({
        message: 'Sin autorización'
      });
    }
  },

  verifyVendedor: async (req, res, next) => {
    let userToken = req.headers.token;
    const verifiyingUser = await token.decode(userToken);
    if (!verifiyingUser) {
      res.status(403).send({
        message: 'Ningún token identificado'
      });
    }
    if (verifiyingUser.rol == 'Administrador' || verifiyingUser.rol == 'Vendedor') {
      next();
    } else {
      res.status(403).send({
        message: 'Sin autorización'
      });
    }
  },

  verifyAlmacenero: async (req, res, next) => {
    let userToken = req.headers.token;
    const verifiyingUser = await token.decode(userToken);
    if (!verifiyingUser) {
      res.status(403).send({
        message: 'Ningún token identificado'
      });
    }
    if (verifiyingUser.rol == 'Administrador' || verifiyingUser.rol == 'Almacenero') {
      next();
    } else {
      res.status(403).send({
        message: 'Sin autorización'
      });
    }
  }
}
