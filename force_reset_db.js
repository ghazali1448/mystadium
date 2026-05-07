import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function forceReset() {
  console.log('--- STARTING FORCE RESET ---');
  try {
    // 1. Delete all existing data to avoid conflicts
    await prisma.notification.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.matchParticipant.deleteMany();
    await prisma.match.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.stadium.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleaned up previous data.');

    // 2. Create a fresh owner account without stadium info yet
    const hashedPassword = await bcrypt.hash('password123', 12);
    const owner = await prisma.user.create({
      data: {
        email: 'owner@test.com',
        password: hashedPassword,
        fullName: 'Captain Stadium',
        role: 'owner'
      }
    });
    console.log('Created Owner:', owner.email);

    // 3. Create the stadium manually for this owner
    const stadium = await prisma.stadium.create({
      data: {
        ownerId: owner.id,
        name: 'الملعب الملكي',
        location: 'الجزائر العاصمة',
        pricePerHour: 1500,
        capacity: 10,
        workingHours: '08:00 - 22:00',
        photoUrl: null
      }
    });
    console.log('Created Stadium:', stadium.name);

    console.log('--- RESET SUCCESSFUL ---');
    console.log('Login with: owner@test.com / password123');
  } catch (err) {
    console.error('FORCE RESET FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

forceReset();
