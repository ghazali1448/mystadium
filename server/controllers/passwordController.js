import prisma from '../lib/prismaClient.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Email configuration (Recommend using environment variables for production)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email', // Default for testing
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Request Password Reset
 * Generates a secure token and sends an email to the user.
 */
export const requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal that the user doesn't exist
      // But for this internal implementation, we follow the user request to "Verify email exists"
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // 3. Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour expiration

    // 4. Save to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    });

    // 5. Send Email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"MyStadium Security" <${process.env.EMAIL_USER || 'security@mystadium.com'}>`,
      to: user.email,
      subject: 'Password Reset Request - MyStadium',
      html: `
        <div style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f7fafc;">
          <h2 style="color: #22c55e; text-align: center;">MyStadium</h2>
          <p style="font-size: 16px; color: #1a202c;">Hello ${user.fullName},</p>
          <p style="font-size: 16px; color: #1a202c;">You requested to reset your password. Please click the button below to set a new password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #718096;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">© 2026 MyStadium. All rights reserved.</p>
        </div>
      `
    };

    // Note: In real production, handle transport errors
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('MAIL SEND ERROR:', mailErr);
      // Even if email fails, we return success for security or error if user prefers
      // Returning error here for debugging purposes as requested "Handle email sending errors"
      return res.status(500).json({ message: 'Failed to send reset email. Please contact support.', error: mailErr.message });
    }

    res.status(200).json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error('RESET REQUEST ERROR:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

/**
 * Verify Reset Token
 * Checks if the token is valid and not expired.
 */
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() } // Greater than now
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    res.status(200).json({ message: 'Token is valid', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
};

/**
 * Reset Password
 * Updates the user's password and clears reset fields.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Find user by token and expiry
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // 2. Validate password strength (min 8 chars)
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 4. Update user and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({ message: 'Your password has been successfully reset. You can now log in.' });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};
