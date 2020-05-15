import routerx from 'express-promise-router';
import articuloRouter from './articuloRoutes';
import categoriaRouter from './categoriaRoutes';
import usuarioRouter from './usuarioRouter';
import personaRouter from './personaRouter';
import ingresoRouter from './ingresoRouter';
import ventaRouter from './ventaRouter';

const router = routerx();
router.use('/articulo',articuloRouter);
router.use('/categoria',categoriaRouter);
router.use('/usuario',usuarioRouter);
router.use('/persona',personaRouter);
router.use('/ingreso',ingresoRouter);
router.use('/venta',ventaRouter);

export default router;
