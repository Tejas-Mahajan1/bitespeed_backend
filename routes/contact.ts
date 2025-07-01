import { Router } from 'express';
import ContactController from '../controllers/contactController';

const router = Router();

router.post('/identify', ContactController.identify);

export default router; 