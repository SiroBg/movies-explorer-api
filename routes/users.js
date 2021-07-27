const router = require('express').Router();
const {
  validateUpdateUser,
} = require('../middlewares/celebrate');

const {
  updateUserInfo, getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdateUser, updateUserInfo);

module.exports = router;
