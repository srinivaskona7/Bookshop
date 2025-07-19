const express = require('express');
const router = express.Router();

// @route   GET /api/health/status
// @desc    Provides a simple status check to confirm backend connectivity.
// @access  Public
router.get('/status', (req, res) => {
  // Respond with a success status and a confirmation message.
  res.status(200).json({
    status: 'ok',
    message: 'Backend is connected and running.'
  });
});

module.exports = router;