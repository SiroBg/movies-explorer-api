const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/celebrate');

const {
  createUser, login,
} = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

router.use(auth);

router.use('/', require('./users'));
router.use('/', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
