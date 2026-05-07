import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDB() {
  console.log('Clearing database...');
  try {
    await prisma.notification.deleteMany({});
    await prisma.matchParticipant.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.stadium.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Database successfully cleared!');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

clearDB();
