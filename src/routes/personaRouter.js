import routerx from 'express-promise-router';
import personaController from '../controllers/PersonaController';
import authMiddileware from '../middlewares/auth'

const router = routerx();

router.get('/list', authMiddileware.verifyRole, personaController.list);
router.get('/listClientes', authMiddileware.verifyRole, personaController.listClientes);
router.get('/listProveedor', authMiddileware.verifyRole, personaController.listProveedor);

router.post('/add',authMiddileware.verifyAdmin, personaController.add);

router.put('/activate',authMiddileware.verifyRole, personaController.activate);
router.put('/deactivate',authMiddileware.verifyRole, personaController.deactivate);
router.put('/update',authMiddileware.verifyVendedor, personaController.update);

export default router;
