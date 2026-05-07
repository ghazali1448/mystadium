import cron from 'node-cron';
import prisma from '../lib/prismaClient.js';

export const startRatingCronJob = () => {
  console.log('⏳ Post-Match Rating Cron Job started. Checking every 5 minutes...');
  
  // Running every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Get confirmed bookings from the last 24 hours that haven't been asked for a rating yet
      const confirmedBookings = await prisma.booking.findMany({
        where: { 
          status: 'confirmed',
          date: {
            gte: oneDayAgo,
            lte: now
          }
        },
        include: { stadium: true }
      });

      for (const booking of confirmedBookings) {
        try {
          // Parse the slot (e.g., '17:00')
          const [hourStr, minuteStr] = booking.slot.split(':');
          const bookingStart = new Date(booking.date);
          bookingStart.setHours(parseInt(hourStr, 10));
          bookingStart.setMinutes(parseInt(minuteStr || '0', 10));
          
          // Match duration is assumed to be 1 hour
          const bookingEnd = new Date(bookingStart.getTime() + 60 * 60 * 1000);

          if (now >= bookingEnd) {
            // Check if we already sent a rating notification for this booking
            const existingNotif = await prisma.notification.findFirst({
              where: {
                userId: booking.userId,
                type: 'rate_stadium',
                relatedId: booking.id
              }
            });

            if (!existingNotif) {
              // Send rating notification
              await prisma.notification.create({
                data: {
                  userId: booking.userId,
                  type: 'rate_stadium',
                  title: '⭐ انتهت المباراة! قيّم الملعب',
                  message: `نتمنى أنك استمتعت بوقتك في ${booking.stadium.name}. يرجى تقييم الملعب (الأرضية، الإضاءة، النظافة) لمساعدة الآخرين.`,
                  relatedId: booking.id
                }
              });
              console.log(`Sent rating notification for booking ${booking.id} to user ${booking.userId}`);
            }
          }
        } catch (e) {
          console.error(`Error processing booking ${booking.id}:`, e);
        }
      }
    } catch (error) {
      console.error('Rating Cron Job Error:', error);
    }
  });
};
