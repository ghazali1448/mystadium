import express from 'express';
import { createBooking, getUserBookings, getStadiumBookings, updateBookingStatus, getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/stadium/:stadiumId', getStadiumBookings);
router.put('/:id/status', updateBookingStatus);
router.get('/', getAllBookings);

export default router;
