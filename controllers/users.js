const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../config');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const {
        name,
        email,
      } = req.body;
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => res.status(200).send({
          name, email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные в методы создания пользователя.'));
          }

          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже зарегестрирован.'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы обновления информации о пользователе.'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегестрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new AuthError('Неправильная почта или пароль.')));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }

      return res.send(user);
    })
    .catch(next);
};
