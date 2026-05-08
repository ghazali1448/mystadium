import express from 'express';
import { getAllStadiums, getStadiumByOwner, createOrUpdateStadium, getStadiumById } from '../controllers/stadiumController.js';

const router = express.Router();

router.get('/', getAllStadiums);
router.get('/owner/:ownerId', getStadiumByOwner);
router.get('/:id', getStadiumById);
router.post('/', createOrUpdateStadium);

export default router;
