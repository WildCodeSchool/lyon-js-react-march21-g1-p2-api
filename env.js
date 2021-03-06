require('dotenv').config();

function getEnv(variable) {
  const value = process.env[variable];
  if (typeof value === 'undefined') {
    console.warn(`Seems like the variable "${variable}" is not set in the environment. 
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

const inProdEnv = getEnv('NODE_ENV') === 'production';
const inDevEnv = getEnv('NODE_ENV') === 'development';
const inTestEnv = getEnv('NODE_ENV') === 'test';

const PORT = getEnv(`PORT${inTestEnv ? '_TEST' : ''}`);
const CORS_ALLOWED_ORIGINS = getEnv(`CORS_ALLOWED_ORIGINS`);
const EDAMAM_API_ID = getEnv('EDAMAM_API_ID');
const EDAMAM_SECRET_API_KEY = getEnv('EDAMAM_SECRET_API_KEY');

module.exports = {
  getEnv,
  inTestEnv,
  inProdEnv,
  inDevEnv,
  PORT,
  CORS_ALLOWED_ORIGINS,
  EDAMAM_SECRET_API_KEY,
  EDAMAM_API_ID,
};
