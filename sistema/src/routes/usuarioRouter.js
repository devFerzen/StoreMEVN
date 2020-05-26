import routerx from 'express-promise-router';
import usuarioController from '../controllers/usuarioController';
import authMiddileware from '../middlewares/auth';

const router = routerx();

router.get('/query',authMiddileware.verifyAdmin, usuarioController.query);
router.get('/list', authMiddileware.verifyAdmin, usuarioController.list);
router.post('/add', authMiddileware.verifyAdmin, usuarioController.add);
router.post('/login', usuarioController.login);

router.put('/activate', authMiddileware.verifyAdmin, usuarioController.activate);
router.put('/deactivate', authMiddileware.verifyAdmin, usuarioController.deactivate);
router.put('/update', authMiddileware.verifyAdmin, usuarioController.update);

router.delete('/delete', authMiddileware.verifyAdmin, usuarioController.remove);

export default router;
