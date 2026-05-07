import { createClient } from '@libsql/client';
import "dotenv/config";

const client = createClient({
  url: "file:server/dev.db",
});

async function bootstrap() {
  console.log("Starting manual database bootstrap...");
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME
      );
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Stadium" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "pricePerHour" REAL NOT NULL,
        "capacity" INTEGER NOT NULL,
        "workingHours" TEXT NOT NULL,
        "photoUrl" TEXT,
        "ownerId" TEXT NOT NULL,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("ownerId") REFERENCES "User" ("id")
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Booking" (
        "id" TEXT PRIMARY KEY,
        "stadiumId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "date" DATETIME NOT NULL,
        "slot" TEXT NOT NULL,
        "status" TEXT DEFAULT 'confirmed',
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("stadiumId") REFERENCES "Stadium" ("id"),
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Match" (
        "id" TEXT PRIMARY KEY,
        "bookingId" TEXT UNIQUE NOT NULL,
        "neededPlayers" INTEGER NOT NULL,
        "ageGroup" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "status" TEXT DEFAULT 'open',
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id")
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "MatchParticipant" (
        "id" TEXT PRIMARY KEY,
        "matchId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("matchId") REFERENCES "Match" ("id"),
        FOREIGN KEY ("userId") REFERENCES "User" ("id"),
        UNIQUE("matchId", "userId")
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Rating" (
        "id" TEXT PRIMARY KEY,
        "stadiumId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "lighting" INTEGER NOT NULL,
        "pitchQuality" INTEGER NOT NULL,
        "cleanliness" INTEGER NOT NULL,
        "comment" TEXT,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME,
        FOREIGN KEY ("stadiumId") REFERENCES "Stadium" ("id"),
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
      );
    `);

    console.log("Database bootstrap COMPLETED successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Manual bootstrap FAILED:", err);
    process.exit(1);
  }
}

bootstrap();
