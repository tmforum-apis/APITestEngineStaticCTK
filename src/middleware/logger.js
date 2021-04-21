const moment = require('moment');

const logger = (req, res, next) => {
  if (!req.originalUrl.includes('health')) {
    console.log(`\n${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} at ${moment().format()}\n`);
  }
  next();
};

module.exports = logger;
