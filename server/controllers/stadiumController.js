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
    const {
      ownerId, name, location, pricePerHour, capacity,
      workingHours, photoUrl, ownershipDocUrl, latitude, longitude
    } = req.body;

    // Build data object, only including provided fields for update
    const data = {};
    if (name !== undefined) data.name = name;
    if (location !== undefined) data.location = location;
    if (pricePerHour !== undefined) data.pricePerHour = parseFloat(pricePerHour) || 0;
    if (capacity !== undefined) data.capacity = parseInt(capacity) || 0;
    if (workingHours !== undefined) data.workingHours = workingHours;
    if (photoUrl !== undefined) data.photoUrl = photoUrl;
    if (ownershipDocUrl !== undefined) data.ownershipDocUrl = ownershipDocUrl;
    if (latitude !== undefined) data.latitude = parseFloat(latitude) || null;
    if (longitude !== undefined) data.longitude = parseFloat(longitude) || null;

    const stadium = await prisma.stadium.upsert({
      where: { id: req.body.id || 'new-dummy-id' },
      update: data,
      create: {
        ownerId,
        name: name || '',
        location: location || '',
        pricePerHour: parseFloat(pricePerHour) || 0,
        capacity: parseInt(capacity) || 0,
        workingHours: workingHours || '08:00 - 22:00',
        photoUrl: photoUrl || null,
        ownershipDocUrl: ownershipDocUrl || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      }
    });
    
    res.status(201).json(stadium);
  } catch (error) {
    res.status(500).json({ message: 'Error saving stadium', error: error.message });
  }
};

export const getStadiumById = async (req, res) => {
  try {
    const { id } = req.params;
    const stadium = await prisma.stadium.findUnique({
      where: { id },
      include: {
        owner: { select: { fullName: true, email: true } },
        bookings: true,
        ratings: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }

    res.status(200).json(stadium);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stadium', error: error.message });
  }
};
