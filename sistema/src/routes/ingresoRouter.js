import routerx from 'express-promise-router';
import ingresoController from '../controllers/IngresoController';
import authMiddleware from '../middlewares/auth';

//Usar como un objeto routerx
const router = routerx();

//Rutas de nuestro controlador
router.post('/add',authMiddleware.verifyAlmacenero, ingresoController.add);
router.get('/query',authMiddleware.verifyAlmacenero, ingresoController.query);
router.get('/list',authMiddleware.verifyAlmacenero, ingresoController.list);
router.get('/get12MonthsReport',authMiddleware.verifyAlmacenero, ingresoController.get12MonthsReport);
router.get('/consultaFechas',authMiddleware.verifyAlmacenero, ingresoController.consultaFechas);
router.put('/activate',authMiddleware.verifyAlmacenero, ingresoController.activate);
router.put('/deactivate',authMiddleware.verifyAlmacenero, ingresoController.deactivate);


export default router;
