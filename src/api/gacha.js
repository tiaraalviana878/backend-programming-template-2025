const express = require('express');

const router = express.Router();

router.post('/gacha', async (req, res) => {
  const { userId } = req.body;

  res.json({
    message: 'Gacha endpoint berhasil!',
    userId,
  });
});

module.exports = router;
