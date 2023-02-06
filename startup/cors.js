var cors = require('cors');

module.exports = (app) => {
  // need to check on production
  var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  app.use(cors(corsOptions));
};
