import express from 'express';
import { scanBooking, confirmPayment } from '../controllers/validationController.js';

const router = express.Router();

router.post('/scan', scanBooking);
router.post('/confirm-payment', confirmPayment);

export default router;
