import cron from 'node-cron';
import prisma from '../lib/prismaClient.js';

export const startBookingCleanupJob = () => {
  console.log('⏳ Booking Cleanup & No-Show Job started. Checking every hour...');
  
  // Running every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      
      // 1. Mark as EXPIRED
      // Bookings that are in the past and still 'ready_for_checkin' or 'pending'
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: { in: ['pending', 'ready_for_checkin'] },
          date: { lt: new Date(now.setHours(0,0,0,0)) }
        }
      });

      for (const booking of expiredBookings) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'expired' }
        });
        console.log(`Marked booking ${booking.id} as EXPIRED`);
      }

      // 2. Mark as NO_SHOW
      // A bit more strict: if the match time is past + grace period (e.g. 1 hour)
      // and it's still 'ready_for_checkin'
      const today = new Date();
      const noShowBookings = await prisma.booking.findMany({
        where: {
          status: 'ready_for_checkin',
          date: { lte: today }
        }
      });

      for (const booking of noShowBookings) {
        // Parse slot (e.g. '18:00')
        const [hourStr, minStr] = booking.slot.split(':');
        const bookingTime = new Date(booking.date);
        bookingTime.setHours(parseInt(hourStr), parseInt(minStr || '0'));
        
        // 2 hours grace period after slot starts
        const gracePeriodEnd = new Date(bookingTime.getTime() + 2 * 60 * 60 * 1000);

        if (new Date() > gracePeriodEnd) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'no_show' }
          });

          // Penalize reliability score
          const user = await prisma.user.findUnique({ where: { id: booking.userId } });
          if (user) {
            const newScore = Math.max(0, (user.reliabilityScore || 100) - 10);
            await prisma.user.update({
              where: { id: user.id },
              data: { reliabilityScore: newScore }
            });
            
            // Notify user
            await prisma.notification.create({
              data: {
                userId: user.id,
                type: 'no_show_penalty',
                title: '⚠️ تغيب عن الحجز',
                message: `لقد تم تسجيل حالة "عدم حضور" لحجزك في ملعب ${booking.id}. تم خصم 10 نقاط من رصيد موثوقيتك.`,
                relatedId: booking.id
              }
            });
          }
          console.log(`Marked booking ${booking.id} as NO_SHOW and penalized user ${booking.userId}`);
        }
      }
    } catch (error) {
      console.error('Booking Cleanup Job Error:', error);
    }
  });
};
