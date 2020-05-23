import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';
import authMiddleware from '../middlewares/auth';

//Usar como un objeto routerx
const router = routerx();

//Rutas de nuestro controlador
router.post('/add', categoriaController.add);
router.get('/query', authMiddleware.verifyVendedor, categoriaController.query);
router.get('/list', categoriaController.list);
router.put('/update', categoriaController.update);
router.put('/activate', categoriaController.activate);
router.put('/deactivate', categoriaController.deactivate);
router.delete('/delete', authMiddleware.verifyVendedor, categoriaController.delete);

export default router;
