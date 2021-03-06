import routerx from 'express-promise-router';
import articuloController from '../controllers/ArticuloController';
import authMiddleware from '../middlewares/auth';

const router = routerx();

router.get('/list',authMiddleware.verifyAlmacenero, articuloController.list);
router.get('/query',authMiddleware.verifyAlmacenero, articuloController.query);
router.get('/queryCodigo',authMiddleware.verifyAlmacenero, articuloController.queryCodigo);
router.put('/update',authMiddleware.verifyAlmacenero, articuloController.update);
router.put('/activate',authMiddleware.verifyAlmacenero, articuloController.activate);
router.put('/deactivate',authMiddleware.verifyAlmacenero, articuloController.deactivate);
router.delete('/delete',authMiddleware.verifyAlmacenero, articuloController.delete);
router.post('/add',authMiddleware.verifyAlmacenero, articuloController.add);

export default router;
