import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';
import authMiddleware from '../middlewares/auth';

//Usar como un objeto routerx
const router = routerx();

//Rutas de nuestro controlador
router.post('/add', authMiddleware.verifyVendedor, categoriaController.add);
router.get('/query', authMiddleware.verifyVendedor, categoriaController.query);
router.get('/list', authMiddleware.verifyVendedor, categoriaController.list);
router.put('/update', authMiddleware.verifyVendedor, categoriaController.update);
router.put('/activate', authMiddleware.verifyVendedor, categoriaController.activate);
router.put('/deactivate', authMiddleware.verifyVendedor, categoriaController.deactivate);
router.delete('/delete', authMiddleware.verifyVendedor, categoriaController.delete);

export default router;
