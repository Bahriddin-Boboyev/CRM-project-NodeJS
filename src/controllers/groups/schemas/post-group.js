const Joi = require("joi");

exports.postGroupSchema = Joi.object({
  name: Joi.string().required(),
  teacher_id: Joi.number().integer(),
  assistant_teacher_id: Joi.number().integer(),
});
