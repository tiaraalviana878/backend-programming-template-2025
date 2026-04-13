const mongoose = require('mongoose');

const GachaSchema = new mongoose.Schema(
  {
    userId: String,
    reward: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gacha', GachaSchema);
