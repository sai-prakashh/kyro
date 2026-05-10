const express = require('express');
const { route } = require('../agents/masterRouter');
const { getModelStatus } = require('../agents/modelEngine');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Main ask endpoint
router.post('/ask', verifyToken, async (req, res) => {
  const { message, modelId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log(`\n[${new Date().toISOString()}] User: ${req.user.email}`);
  console.log(`Message: "${message}" | Model preference: ${modelId || 'auto'}`);

  try {
    const response = await route(message, req.user.userId, modelId || null);
    res.json(response);
  } catch (err) {
    console.error('Router error:', err.message);
    if (err.message === 'ALL_MODELS_FAILED') {
      return res.status(503).json({
        error: 'All AI models are currently busy. Please try again in a minute.'
      });
    }
    res.status(500).json({ error: 'KYRO failed to process your message' });
  }
});

// Get all available models + their status
router.get('/models', verifyToken, (req, res) => {
  res.json(getModelStatus());
});

module.exports = router;