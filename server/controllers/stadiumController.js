import prisma from '../lib/prismaClient.js';

export const getAllStadiums = async (req, res) => {
  try {
    const stadiums = await prisma.stadium.findMany({
      include: {
        owner: {
          select: { fullName: true }
        },
        ratings: true
      }
    });

    // Calculate average rating for each stadium
    const formattedStadiums = stadiums.map(s => {
      const count = s.ratings.length;
      let avg = 0;
      if (count > 0) {
        const sum = s.ratings.reduce((acc, r) => acc + (r.lighting + r.pitchQuality + r.cleanliness), 0);
        avg = (sum / (count * 3)).toFixed(1);
      }
      return { ...s, avgRating: avg, ratingCount: count };
    });

    res.status(200).json(formattedStadiums);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stadiums', error: error.message });
  }
};

export const getStadiumByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const stadium = await prisma.stadium.findFirst({
      where: { ownerId },
      include: {
        bookings: true,
        ratings: true
      }
    });
    res.status(200).json(stadium);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stadium', error: error.message });
  }
};

export const createOrUpdateStadium = async (req, res) => {
  try {
    const { ownerId, name, location, pricePerHour, capacity, workingHours, photoUrl } = req.body;
    
    const stadium = await prisma.stadium.upsert({
      where: { id: req.body.id || 'new-dummy-id' }, // Simplified for initial setup
      update: { name, location, pricePerHour, capacity, workingHours, photoUrl },
      create: { ownerId, name, location, pricePerHour, capacity, workingHours, photoUrl }
    });
    
    res.status(201).json(stadium);
  } catch (error) {
    res.status(500).json({ message: 'Error saving stadium', error: error.message });
  }
};
