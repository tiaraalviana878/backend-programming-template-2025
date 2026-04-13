module.exports = (app) => {
  app.post('/gacha', (req, res) => {
    const { userId } = req.body;

    res.json({
      message: 'Gacha endpoint berhasil!',
      userId,
    });
  });
};
