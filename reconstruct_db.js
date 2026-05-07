import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

async function buildDb() {
  console.log('--- STARTING TOTAL DATABASE RECONSTRUCTION ---');
  const dbPath = path.join(process.cwd(), 'server', 'dev.db');
  
  // 1. Delete if exists to avoid corruption
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
      console.log('Deleted corrupted database.');
    } catch (e) {
      console.log('Database busy, it will be overwritten.');
    }
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Creating fresh tables...');

  // 2. Create User table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Create Stadium table (WITH photoUrl)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Stadium (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      pricePerHour REAL NOT NULL,
      capacity INTEGER NOT NULL,
      workingHours TEXT NOT NULL,
      photoUrl TEXT,
      ownerId TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ownerId) REFERENCES User(id)
    )
  `);

  // 4. Create other essential tables to avoid Prisma errors later
  await db.exec(`CREATE TABLE IF NOT EXISTS Booking (id TEXT PRIMARY KEY, stadiumId TEXT, userId TEXT, date DATETIME, slot TEXT, status TEXT DEFAULT 'confirmed', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  await db.exec(`CREATE TABLE IF NOT EXISTS Match (id TEXT PRIMARY KEY, bookingId TEXT UNIQUE, neededPlayers INTEGER, ageGroup TEXT, phone TEXT, status TEXT DEFAULT 'open', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  await db.exec(`CREATE TABLE IF NOT EXISTS MatchParticipant (id TEXT PRIMARY KEY, matchId TEXT, userId TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  await db.exec(`CREATE TABLE IF NOT EXISTS Rating (id TEXT PRIMARY KEY, stadiumId TEXT, userId TEXT, lighting INTEGER, pitchQuality INTEGER, cleanliness INTEGER, comment TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  await db.exec(`CREATE TABLE IF NOT EXISTS Notification (id TEXT PRIMARY KEY, userId TEXT, type TEXT, title TEXT, message TEXT, isRead BOOLEAN DEFAULT 0, relatedId TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  console.log('Database reconstructed successfully with photoUrl support.');
  await db.close();
  console.log('--- RECONSTRUCTION COMPLETE ---');
}

buildDb().catch(console.error);
