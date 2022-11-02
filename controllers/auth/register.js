const User = require('../models/user');

exports.register = async (req, res, next) => {
  const user = new User({ email: 'guycohen85@gmail.com', password: '12345' });
  await user.save();
  res.render('index', { title: 'Express' });
}


