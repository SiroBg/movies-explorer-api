const { celebrate, Joi } = require('celebrate');

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/(www\.)?.{1,}#?$/),
    trailer: Joi.string().required().pattern(/^https?:\/\/(www\.)?.{1,}#?$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(www\.)?.{1,}#?$/),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
