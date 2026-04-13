const express = require('express');

const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
const gacha = require('./components/gacha/gacha-route'); // ⬅️ TAMBAH INI

module.exports = () => {
  const app = express.Router();

  books(app);
  users(app);
  gacha(app); // ⬅️ TAMBAH INI

  return app;
};
