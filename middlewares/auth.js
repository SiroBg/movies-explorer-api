const jwt = require('jsonwebtoken');
const ErrorManage = require('./error-manage');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorManage('необходима авторизация').manageAuthError());
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new ErrorManage('необходима авторизация').manageAuthError());
  }

  req.user = payload;

  next();
};
