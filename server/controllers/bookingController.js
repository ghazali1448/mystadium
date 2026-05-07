import prisma from '../lib/prismaClient.js';

export const createBooking = async (req, res) => {
  try {
    const { stadiumId, userId, slot, date } = req.body;
    
    // Basic validation: check if slot is already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        stadiumId,
        date: new Date(date),
        slot: slot,
        status: { not: 'cancelled' }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        stadiumId,
        userId,
        slot: slot,
        date: new Date(date)
      }
    });

    const stadium = await prisma.stadium.findUnique({ where: { id: stadiumId }, include: { owner: true } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (stadium) {
      await prisma.notification.create({
        data: {
          userId: stadium.ownerId,
          type: 'booking_new',
          title: 'حجز جديد',
          message: `تلقيت حجزاً جديداً من ${user?.fullName || 'لاعب'} لملعبك (${stadium.name}) بتتاريخ ${date.split('T')[0]} في تمام الساعة ${slot}.`,
          relatedId: booking.id
        }
      });
    }

    // Conflict Logic: Check if there's an open match for this stadium/slot
    const conflictingMatch = await prisma.match.findFirst({
      where: {
        booking: { stadiumId, slot, date: new Date(date) },
        status: 'open'
      },
      include: { booking: { include: { user: true, stadium: true } } }
    });

    if (conflictingMatch) {
      // Cancel the match and notify the creator
      await prisma.match.update({ where: { id: conflictingMatch.id }, data: { status: 'cancelled' } });
      await prisma.notification.create({
        data: {
          userId: conflictingMatch.booking.userId,
          type: 'match_canceled_conflict',
          title: 'تم إلغاء طلب المباراة',
          message: `لقد تم إلغاء المباراة التي أنشأتها في ملعب ${conflictingMatch.booking.stadium.name} بسبب حجز مؤكد في نفس الوقت.`,
          relatedId: conflictingMatch.id
        }
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        stadium: true,
        match: true
      },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

export const getStadiumBookings = async (req, res) => {
  try {
    const { stadiumId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { stadiumId },
      include: {
        user: {
          select: { fullName: true }
        }
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stadium bookings', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { stadium: true, match: { include: { participants: true } } }
    });

    if (status === 'confirmed') {
      if (updatedBooking.match) {
        // Dual Notification for Match
        const matchUsers = [updatedBooking.userId, ...updatedBooking.match.participants.map(p => p.userId)];
        for (const uid of matchUsers) {
          await prisma.notification.create({
            data: {
              userId: uid,
              type: 'booking_confirmed',
              title: '✅ تم تأكيد التحدي!',
              message: `تم تأكيد حجزك للعب مع خصمك في ملعب ${updatedBooking.stadium.name} الساعة ${updatedBooking.slot}.`,
              relatedId: updatedBooking.id
            }
          });
        }
      } else {
        // Normal booking confirmation
        await prisma.notification.create({
          data: {
            userId: updatedBooking.userId,
            type: 'booking_confirmed',
            title: '✅ تم تأكيد حجزك',
            message: `مبروك! تم تأكيد حجزك لملعب ${updatedBooking.stadium.name} في تمام الساعة ${updatedBooking.slot}.`,
            relatedId: updatedBooking.id
          }
        });
      }
    } else if (status === 'rejected') {
      await prisma.notification.create({
        data: {
          userId: updatedBooking.userId,
          type: 'booking_rejected',
          title: '❌ تم رفض الحجز',
          message: `نأسف، تم رفض طلب حجزك لملعب ${updatedBooking.stadium.name} من قبل صاحب الملعب. يمكنك تجربة وقت آخر.`,
          relatedId: updatedBooking.id
        }
      });
    }
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        stadium: true,
        user: { select: { fullName: true } }
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error: error.message });
  }
};
