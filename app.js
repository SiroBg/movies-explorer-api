require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const {
  validateSignUp,
  validateSignIn,
} = require('./middlewares/celebrate');
const ErrorManage = require('./middlewares/error-manage');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use('*', (req, res, next) => next(new ErrorManage('страница не найдена').manageNotFoundError()));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
