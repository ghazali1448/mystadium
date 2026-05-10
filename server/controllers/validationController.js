import prisma from '../lib/prismaClient.js';
import crypto from 'crypto';

/**
 * Scan a QR token and return booking details if valid.
 */
export const scanBooking = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: 'QR Token is required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { qrToken },
      include: {
        stadium: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            reliabilityScore: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Reservation not found or invalid QR code' });
    }

    // Validation checks
    const now = new Date();
    const bookingDate = new Date(booking.date);
    
    // Check expiration (simple check: if date is past)
    // In a real app, we would check the specific slot end time
    if (bookingDate < new Date(now.setHours(0,0,0,0)) && booking.status !== 'paid') {
        return res.status(400).json({ 
            message: 'This reservation has expired',
            booking 
        });
    }

    if (['cancelled', 'rejected', 'expired', 'no_show'].includes(booking.status)) {
      return res.status(400).json({ 
        message: `Reservation is ${booking.status}`,
        booking 
      });
    }

    if (booking.status === 'paid') {
      return res.status(200).json({ 
        message: 'Reservation already validated and paid',
        booking,
        alreadyValidated: true
      });
    }

    res.status(200).json({
      message: 'Reservation found',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scanning QR code', error: error.message });
  }
};

/**
 * Confirm payment for a scanned booking.
 */
export const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { stadium: true, user: true }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'PAID') {
      return res.status(400).json({ message: 'Payment already confirmed for this booking' });
    }

    // Generate Receipt Data
    const receiptId = `REC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const receiptData = {
      receiptId,
      amount: booking.stadium.pricePerHour,
      currency: 'DZD',
      timestamp: new Date().toISOString(),
      stadiumName: booking.stadium.name,
      userName: booking.user.fullName,
      date: booking.date,
      slot: booking.slot
    };

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'paid',
        paymentStatus: 'PAID',
        validatedAt: new Date(),
        checkInTime: new Date(),
        receiptData: receiptData
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'payment_confirmed',
        title: '💰 تم تأكيد الدفع',
        message: `تم تأكيد دفع مبلغ ${booking.stadium.pricePerHour} د.ج لملعب ${booking.stadium.name}. شكراً لك!`,
        relatedId: booking.id
      }
    });

    res.status(200).json({
      message: 'Payment confirmed successfully',
      booking: updatedBooking,
      receipt: receiptData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};
