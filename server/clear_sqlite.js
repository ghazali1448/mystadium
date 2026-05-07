import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function clearSqlite() {
  console.log('Connecting to old ghost dev.db...');
  try {
    const db = await open({
      filename: path.join(process.cwd(), 'dev.db'), // process.cwd will be server
      driver: sqlite3.Database
    });

    console.log('Clearing old SQLite tables...');
    await db.run('DELETE FROM Notification');
    await db.run('DELETE FROM MatchParticipant');
    await db.run('DELETE FROM Match');
    await db.run('DELETE FROM Booking');
    await db.run('DELETE FROM Stadium');
    await db.run('DELETE FROM User');

    console.log('✅ SQLite Ghost Database cleared successfully!');
    await db.close();
  } catch (e) {
    console.error('Failed to clear SQLite DB:', e);
  }
}

clearSqlite();
