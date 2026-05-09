const express = require('express');
const { route } = require('../agents/masterRouter');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/ask', verifyToken, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log(`\n[${new Date().toISOString()}] User: ${req.user.email}`);
  console.log(`Message: "${message}"`);

  try {
    const response = await route(message, req.user.userId);
    res.json(response);
  } catch (err) {
    console.error('Router error:', err);
    res.status(500).json({ error: 'Kyro failed to process your message' });
  }
});

module.exports = router;