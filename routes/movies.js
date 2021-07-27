const router = require('express').Router();
const {
  validateCreateMovie,
} = require('../middlewares/celebrate');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
