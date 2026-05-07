import express from 'express';
import { addRating, getStadiumRatings } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', addRating);
router.get('/stadium/:stadiumId', getStadiumRatings);

export default router;
