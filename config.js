const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  sendgrid_key: process.env.SENDGRID_API_KEY,
  session_key: process.env.SESSION_KEY,

};