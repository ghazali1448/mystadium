import prisma from '../lib/prismaClient.js';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const createMatch = async (req, res) => {
  try {
    const { bookingId, neededPlayers, ageGroup, phone } = req.body;
    
    const existingMatch = await prisma.match.findUnique({ where: { bookingId } });
    if (existingMatch) return res.status(400).json({ message: 'A match request already exists' });

    const match = await prisma.match.create({
      data: { bookingId, neededPlayers: parseInt(neededPlayers), ageGroup, phone, status: 'open' },
      include: { booking: { include: { stadium: true } } }
    });

    // Notify nearby players (within 10km)
    const stadium = match.booking.stadium;
    if (stadium.latitude && stadium.longitude) {
      const allPlayers = await prisma.user.findMany({ where: { role: 'player' } });
      for (const p of allPlayers) {
        if (p.latitude && p.longitude) {
          const dist = calculateDistance(stadium.latitude, stadium.longitude, p.latitude, p.longitude);
          if (dist <= 10) {
            await prisma.notification.create({
              data: {
                userId: p.id,
                type: 'match_new_broadcast',
                title: '⚡ مطلوب خصم قريب!',
                message: `هناك تحدي جديد في ملعب ${stadium.name} على بعد ${dist.toFixed(1)} كم. هل أنت مستعد؟`,
                relatedId: match.id
              }
            });
          }
        }
      }
    }
    
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error creating match request', error: error.message });
  }
};

export const getOpenMatches = async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: { status: 'open' },
      include: {
        participants: {
          include: { user: { select: { fullName: true } } }
        },
        booking: {
          include: {
            stadium: true,
            user: { select: { fullName: true } }
          }
        }
      }
    });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
};

export const joinMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.body;

    // Check if already joined
    const existing = await prisma.matchParticipant.findUnique({
      where: {
        matchId_userId: { matchId, userId }
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already joined this match' });
    }

    const participation = await prisma.matchParticipant.create({
      data: { matchId, userId }
    });

    // Notify match creator and owner
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { 
        booking: { include: { stadium: true, user: true } }
      }
    });

    const joiningUser = await prisma.user.findUnique({ where: { id: userId } });

    // 1. Notify Creator (With Discount Message)
    await prisma.notification.create({
      data: {
        userId: match.booking.userId,
        type: 'match_discount',
        title: '🎉 حصلت على خصم!',
        message: `لقد انضم ${joiningUser.fullName} لمباراتك! لقد كسبت خصماً في ملعب ${match.booking.stadium.name} لنجاحك في إيجاد خصم. بانتظار تأكيد المالك.`,
        relatedId: match.id
      }
    });

    // 2. Notify Stadium Owner
    await prisma.notification.create({
      data: {
        userId: match.booking.stadium.ownerId,
        type: 'booking_new', // Reuse owner booking notification type
        title: '🏟️ تحدي جديد جاهز',
        message: `اكتمل عدد اللاعبين لمباراة التحدي في ملعبك (${match.booking.stadium.name}). يرجى التأكيد أو الرفض.`,
        relatedId: match.bookingId
      }
    });

    res.status(200).json({ message: 'Successfully joined match', participation });
  } catch (error) {
    res.status(500).json({ message: 'Error joining match', error: error.message });
  }
};

