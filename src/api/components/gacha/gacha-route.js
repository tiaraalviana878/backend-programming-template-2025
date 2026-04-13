const Gacha = require('../../../models/gacha-model');

// Function to mask user name
function maskName(name) {
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return '*'.repeat(word.length);
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    })
    .join(' ');
}

module.exports = (app) => {
  app.post('/gacha', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      // Limit: max 5 gacha per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalToday = await Gacha.countDocuments({
        userId,
        createdAt: { $gte: today },
      });

      if (totalToday >= 5) {
        return res.status(400).json({
          message: 'Daily gacha limit has been reached',
        });
      }

      // List of rewards
      const rewards = [
        { name: 'Emas 10 gram', quota: 1 },
        { name: 'Smartphone X', quota: 5 },
        { name: 'Smartwatch Y', quota: 10 },
        { name: 'Voucher Rp100.000', quota: 100 },
        { name: 'Pulsa Rp50.000', quota: 500 },
      ];

      // Filter available rewards based on quota
      const availableRewards = (
        await Promise.all(
          rewards.map(async (r) => {
            const total = await Gacha.countDocuments({ reward: r.name });
            return total < r.quota ? r.name : null;
          })
        )
      ).filter(Boolean);

      // If no rewards available
      if (availableRewards.length === 0) {
        await Gacha.create({ userId, reward: null });

        return res.json({
          message: 'No reward obtained',
        });
      }

      // Randomize reward
      const randomIndex = Math.floor(Math.random() * availableRewards.length);
      const reward = availableRewards[randomIndex];

      // Save result to database
      await Gacha.create({
        userId,
        reward,
      });

      return res.json({
        message: 'Gacha success',
        reward,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  });

  // Get user gacha history
  app.get('/gacha/history/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      const history = await Gacha.find({ userId }).sort({ createdAt: -1 });

      return res.json({
        userId,
        total: history.length,
        data: history,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  // Get rewards and remaining quota
  app.get('/gacha/rewards', async (req, res) => {
    try {
      const rewards = [
        { name: 'Emas 10 gram', quota: 1 },
        { name: 'Smartphone X', quota: 5 },
        { name: 'Smartwatch Y', quota: 10 },
        { name: 'Voucher Rp100.000', quota: 100 },
        { name: 'Pulsa Rp50.000', quota: 500 },
      ];

      const result = await Promise.all(
        rewards.map(async (r) => {
          const total = await Gacha.countDocuments({ reward: r.name });

          return {
            name: r.name,
            quota: r.quota,
            remaining: r.quota - total,
          };
        })
      );

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  // Get masked winners list
  app.get('/gacha/winners', async (req, res) => {
    try {
      const winners = await Gacha.find({ reward: { $ne: null } });

      const result = winners.map((w) => ({
        userId: maskName(w.userId),
        reward: w.reward,
      }));

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};
