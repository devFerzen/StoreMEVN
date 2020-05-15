import jwt from 'jsonwebtoken';
import models from '../models';

//Creacion de un token cuando ya el usuario tiene un token
//llamada hecha desde el decode
async function checkToken(token){
  let __id = null;
  try {
    //verify the existance of the _id inside the token
    const {_id} = await jwt.decode(token);
    __id = id;
  } catch (e) {
    //never exists this token
    return false;
  }

  //verify the user and its state and return its new token with its rol
  const user = await models.Usuario.findOne({_id:__id,estado:1});
  if (user) {
    const token = jwt.sign({_id:__id},'clavesecretadeacceso', {expiresIn:'1d'});
    return {token,rol:user.rol};
  } else {
    return false;
  }


}

export default {
  encode: async (_id) => {
    const token = jwt.sign({_id:_id},'clavesecretadeacceso', {expiresIn:'1d'});
    return token;
  },
  decode: async (token) => {
    try {
      //al poner entre comillas el _id extraemos solo eso del objeto jwt
      const {_id} = jwt.verify(token,'clavesecretadeacceso');
      const user = await models.Usuario.findOne({_id,estado:1});
      if (user) return user;
      return false;
    } catch (e) {
      //Si el token posiblemente ya expire se llama el checkToken
      const newToken = await checkToken(token);
      return newToken;
    }

  }
};
