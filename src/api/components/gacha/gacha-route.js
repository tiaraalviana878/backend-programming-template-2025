const Gacha = require('../../../models/gacha-model');

module.exports = (app) => {
  app.post('/gacha', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      // 🔹 limit 5x per hari
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalToday = await Gacha.countDocuments({
        userId,
        createdAt: { $gte: today },
      });

      if (totalToday >= 5) {
        return res.status(400).json({
          message: 'Limit gacha hari ini sudah habis',
        });
      }

      // 🔹 daftar hadiah
      const rewards = [
        { name: 'Emas 10 gram', quota: 1 },
        { name: 'Smartphone X', quota: 5 },
        { name: 'Smartwatch Y', quota: 10 },
        { name: 'Voucher Rp100.000', quota: 100 },
        { name: 'Pulsa Rp50.000', quota: 500 },
      ];

      // 🔹 filter reward yang masih tersedia
      const availableRewards = (
        await Promise.all(
          rewards.map(async (r) => {
            const total = await Gacha.countDocuments({ reward: r.name });
            return total < r.quota ? r.name : null;
          })
        )
      ).filter(Boolean);

      // 🔹 kalau ga ada hadiah
      if (availableRewards.length === 0) {
        await Gacha.create({ userId, reward: null });

        return res.json({
          message: 'Tidak mendapatkan hadiah',
        });
      }

      // 🔹 random hadiah
      const randomIndex = Math.floor(Math.random() * availableRewards.length);
      const reward = availableRewards[randomIndex];

      // 🔹 simpan ke DB
      await Gacha.create({
        userId,
        reward,
      });

      return res.json({
        message: 'Berhasil gacha',
        reward,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  });
};
