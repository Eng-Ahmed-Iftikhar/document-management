import authRouter from './routers/auth.router';
import documentRouter from './routers/document.router';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/documents', documentRouter);

export default router;
