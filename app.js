require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const helmet = require('helmet');

const limiter = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const { MONGO_URL } = require('./config');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(require('./middlewares/handle-errors'));

app.listen(PORT);
