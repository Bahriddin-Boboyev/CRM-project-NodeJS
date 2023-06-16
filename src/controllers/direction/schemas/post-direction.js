const Joi = require("joi");

module.exports.postDirectionSchema = Joi.object({
  name: Joi.string().max(15).min(3).required()
});
