const Joi = require("joi");

module.exports.postStudentGroup = Joi.object({
  student_id: Joi.number().integer(),
  group_id: Joi.number().integer(),
});
