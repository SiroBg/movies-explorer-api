require('dotenv').config();

const { MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb', JWT_SECRET = 'dev-secret' } = process.env;

module.exports = {
  MONGO_URL,
  JWT_SECRET,
};
