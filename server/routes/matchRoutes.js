import express from 'express';
import { createMatch, getOpenMatches, joinMatch } from '../controllers/matchController.js';

const router = express.Router();

router.post('/', createMatch);
router.get('/open', getOpenMatches);
router.post('/:matchId/join', joinMatch);

export default router;
