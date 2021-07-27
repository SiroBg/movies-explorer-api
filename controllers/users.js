const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorManage = require('../middlewares/error-manage');

const { NODE_ENV, JWT_SECRET } = process.env;

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
            next(new ErrorManage('переданы некорректные данные в методы создания пользователя').manageBadRequestError());
          }

          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ErrorManage('пользователь с такой почтой уже зарегестрирован').manageConflictError());
          }

          next(err);
        });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManage('переданы некорректные данные в методы обновления информации о пользователе').manageBadRequestError());
      }
      if (err.name === 'CastError') {
        next(new ErrorManage('некорректный id пользователя').manageBadRequestError());
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ErrorManage('пользователь с такой почтой уже зарегестрирован').manageConflictError());
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new ErrorManage('неправильная почта или пароль').manageAuthError()));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorManage('пользователь не найден').manageNotFoundError();
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorManage('некорректный id пользователя').manageBadRequestError());
      }

      next(err);
    });
};
