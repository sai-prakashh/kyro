const express = require('express');
const jwt = require('jsonwebtoken');
const { oauth2Client, SCOPES } = require('../config/googleOAuth');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Step 1: Redirect user to Google login
router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(url);
});

// Step 2: Google redirects back here with a code
router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;

  console.log('=== CALLBACK HIT ===');
  console.log('Error from Google:', error);
  console.log('Code:', code ? code.substring(0, 20) + '...' : 'MISSING');

  if (error) {
    console.log('Google returned error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`);
  }

  if (!code) {
    console.log('No code received');
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
  }

  try {
    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', {
      access_token: tokens.access_token ? 'YES' : 'NO',
      refresh_token: tokens.refresh_token ? 'YES' : 'NO',
      expiry_date: tokens.expiry_date
    });

    oauth2Client.setCredentials(tokens);

    console.log('Getting user info from Google...');
    const { google } = require('googleapis');
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log('User info received:', {
      id: data.id,
      email: data.email,
      name: data.name
    });

    console.log('Saving user to MongoDB...');
    let user = await User.findOne({ googleId: data.id });
    if (!user) {
      user = await User.create({
        name:         data.name,
        email:        data.email,
        googleId:     data.id,
        picture:      data.picture,
        accessToken:  tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry:  new Date(tokens.expiry_date)
      });
      console.log('New user created:', user._id);
    } else {
      user.accessToken  = tokens.access_token;
      user.refreshToken = tokens.refresh_token || user.refreshToken;
      user.tokenExpiry  = new Date(tokens.expiry_date);
      await user.save();
      console.log('Existing user updated:', user._id);
    }

    console.log('Issuing JWT...');
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`;
    console.log('Redirect URL:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (err) {
    console.error('=== FULL ERROR ===');
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

// Get current logged-in user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-accessToken -refreshToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;