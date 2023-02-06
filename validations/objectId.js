const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.objectId = Joi.objectId();

exports.validateObjectId = (id) => {
  return Joi.object({ id: Joi.objectId() }).validate({ id });
};
