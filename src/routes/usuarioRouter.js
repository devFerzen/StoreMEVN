import routerx from 'express-promise-router';
import usuarioController from '../controllers/usuarioController';
import authMiddileware from '../middlewares/auth';

const router = routerx();

router.get('/query',authMiddileware.verifyRole, usuarioController.query);
router.get('/list',authMiddileware.verifyAdmin, usuarioController.list);
router.post('/add',authMiddileware.verifyAdmin, usuarioController.add);
router.post('/login',usuarioController.login);

router.put('/activate',authMiddileware.verifyRole, usuarioController.activate);
router.put('/deactivate',authMiddileware.verifyRole, usuarioController.deactivate);
router.put('/update',authMiddileware.verifyVendedor, usuarioController.update);

router.delete('/delete',authMiddileware.verifyAdmin, usuarioController.remove);

export default router;
