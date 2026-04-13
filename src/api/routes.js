const express = require('express');

const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
// 👇 TAMBAH INI
const gacha = require('./components/gacha/gacha-route');

module.exports = () => {
  const app = express.Router();

  books(app);
  users(app);
  // 👇 TAMBAH INI
  gacha(app);

  return app;
};
