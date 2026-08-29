const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, address, role)
      VALUES (?, ?, ?, ?, ?, 'customer')
    `).run(name.trim(), email.toLowerCase().trim(), hashedPassword, phone ? phone.trim() : '', address ? address.trim() : '');

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      role: 'customer'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    // Send Welcome Email asynchronously
    emailService.sendWelcomeEmail(user).catch(err => {
      console.error('Welcome email error:', err.message);
    });

    res.status(201).json({
      message: 'Account registered successfully. Welcome email dispatched!',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User / Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      profile_image: user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
    };

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    // Send Login Security Alert asynchronously
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Web Client';
    emailService.sendLoginAlertEmail(userData, { ip }).catch(err => {
      console.error('Login alert email error:', err.message);
    });

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Forgot Password - Send OTP to Email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email address' });
    }

    // Generate 6-digit OTP and reset token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes validity

    // Invalidate previous OTPs for this email
    db.prepare('UPDATE password_resets SET used = 1 WHERE email = ?').run(normalizedEmail);

    // Save new OTP
    db.prepare(`
      INSERT INTO password_resets (email, otp, token, expires_at, used)
      VALUES (?, ?, ?, ?, 0)
    `).run(normalizedEmail, otp, token, expiresAt);

    // Send Email
    await emailService.sendForgotPasswordOtpEmail(normalizedEmail, otp, token);

    res.json({
      message: `Password reset OTP has been sent to ${normalizedEmail}`,
      email: normalizedEmail,
      token
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset Password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = db.prepare(`
      SELECT * FROM password_resets 
      WHERE email = ? AND otp = ? AND used = 0 
      ORDER BY id DESC LIMIT 1
    `).get(normalizedEmail, otp.trim());

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
    }

    // Mark OTP as used
    db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(record.id);

    // Update user password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, normalizedEmail);

    const updatedUser = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(normalizedEmail);

    // Send confirmation email
    emailService.sendPasswordChangedEmail(updatedUser).catch(() => {});

    res.json({
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get Current Profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, address, role, profile_image, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update Profile
router.put('/me', authenticateToken, (req, res) => {
  try {
    const { name, phone, address, profile_image } = req.body;
    db.prepare(`
      UPDATE users SET 
        name = COALESCE(?, name), 
        phone = COALESCE(?, phone), 
        address = COALESCE(?, address),
        profile_image = COALESCE(?, profile_image)
      WHERE id = ?
    `).run(name, phone, address, profile_image, req.user.id);

    const updatedUser = db.prepare('SELECT id, name, email, phone, address, role, profile_image FROM users WHERE id = ?').get(req.user.id);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
