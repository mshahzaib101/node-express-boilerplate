const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createEmployee = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    salary: Joi.number().required(),
    currency: Joi.string().required().valid('USD', 'INR', 'EUR'),
    department: Joi.string().required(),
    sub_department: Joi.string().required(),
    on_contract: Joi.boolean().required(),
  }),
};

const getEmployeesSS = {
  query: Joi.object().keys({
    currency: Joi.string().valid('USD', 'INR', 'EUR'),
    on_contract: Joi.boolean(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteEmployee = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  createEmployee,
  getUser,
  updateUser,
  getEmployeesSS,
  deleteEmployee,
};
