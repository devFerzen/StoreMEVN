import routerx from 'express-promise-router';
import ventaController from '../controllers/VentaController';
import authMiddleware from '../middlewares/auth';

//Usar como un objeto routerx
const router = routerx();

//Rutas de nuestro controlador
router.post('/add',authMiddleware.verifyVendedor, ventaController.add);
router.get('/query',authMiddleware.verifyVendedor, ventaController.query);
router.get('/list',authMiddleware.verifyVendedor, ventaController.list);
router.get('/consultaFechas',authMiddleware.verifyVendedor, ventaController.consultaFechas);
router.get('/get12MonthsReport',authMiddleware.verifyVendedor, ventaController.get12MonthsReport);
router.put('/activate',authMiddleware.verifyVendedor, ventaController.activate);
router.put('/deactivate',authMiddleware.verifyVendedor, ventaController.deactivate);


export default router;
