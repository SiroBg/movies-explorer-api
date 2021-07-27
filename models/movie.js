const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?.{1,}#?$/.test(v);
      },
      message: 'Это не ссылка!',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?.{1,}#?$/.test(v);
      },
      message: 'Это не ссылка!',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?.{1,}#?$/.test(v);
      },
      message: 'Это не ссылка!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', cardSchema);
