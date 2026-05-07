import prisma from '../lib/prismaClient.js';

export const addRating = async (req, res) => {
  try {
    const { stadiumId, userId, lighting, pitchQuality, cleanliness, comment } = req.body;
    
    const rating = await prisma.rating.create({
      data: {
        stadiumId,
        userId,
        lighting: parseInt(lighting),
        pitchQuality: parseInt(pitchQuality),
        cleanliness: parseInt(cleanliness),
        comment
      }
    });
    
    const stadium = await prisma.stadium.findUnique({ where: { id: stadiumId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const overall = Math.round((parseInt(lighting) + parseInt(pitchQuality) + parseInt(cleanliness)) / 3);
    
    if (stadium) {
      await prisma.notification.create({
        data: {
          userId: stadium.ownerId,
          type: 'rating_new',
          title: 'تقييم جديد',
          message: `قام اللاعب ${user?.fullName || 'لاعب'} بتقييم ملعبك (${stadium.name}) بـ ${overall} نجوم.`,
          relatedId: rating.id
        }
      });
    }

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
};

export const getStadiumRatings = async (req, res) => {
  try {
    const { stadiumId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { stadiumId },
      include: {
        user: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};
