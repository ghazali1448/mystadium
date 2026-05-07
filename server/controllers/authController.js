import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

export const signup = async (req, res) => {
  try {
    const { 
      email, password, fullName, role,
      stadiumName, location, workingHours, pricePerHour, capacity 
    } = req.body;

    // Direct DB connection to bypass Prisma locks
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Check existing
    const existing = await db.get('SELECT id FROM User WHERE email = ?', [email]);
    if (existing) {
      await db.close();
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const now = new Date().toISOString();

    // 1. Create User
    await db.run(
      'INSERT INTO User (id, email, password, fullName, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, fullName, role || 'player', now, now]
    );

    let stadium = null;
    if (role === 'owner' && stadiumName) {
      const stadiumId = uuidv4();
      
      const photoFile = req.files?.['photo']?.[0];
      const docFile = req.files?.['ownershipDoc']?.[0];
      
      const photoUrl = photoFile ? `/uploads/${photoFile.filename}` : null;
      const ownershipDocUrl = docFile ? `/uploads/${docFile.filename}` : null;
      
      // 2. Create Stadium
      await db.run(
        'INSERT INTO Stadium (id, name, location, pricePerHour, capacity, workingHours, photoUrl, ownershipDocUrl, ownerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [stadiumId, stadiumName, location || '', parseFloat(pricePerHour) || 0, parseInt(capacity) || 0, workingHours || '08:00 - 22:00', photoUrl, ownershipDocUrl, userId, now, now]
      );
      
      stadium = { id: stadiumId, name: stadiumName, photoUrl, ownershipDocUrl };
    }

    await db.close();

    const token = jwt.sign(
      { userId, email, role: role || 'player' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token, 
      user: { id: userId, email, fullName, role, stadium } 
    });

  } catch (error) {
    console.error('DIRECT DB SIGNUP ERROR:', error);
    res.status(500).json({ message: 'Internal Server Error', debug: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, fullName, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { fullName, email }
    });
    res.status(200).json({ user: { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName, role: updatedUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    res.status(200).json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { latitude, longitude }
    });
    res.status(200).json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};
