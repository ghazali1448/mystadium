import express from 'express';
import { getAllStadiums, getStadiumByOwner, createOrUpdateStadium } from '../controllers/stadiumController.js';

const router = express.Router();

router.get('/', getAllStadiums);
router.get('/owner/:ownerId', getStadiumByOwner);
router.post('/', createOrUpdateStadium);

export default router;
