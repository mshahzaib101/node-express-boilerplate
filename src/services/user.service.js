const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { usersDB, addUser } = require('../inMemoryDatabase/users');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (usersDB.findIndex((x) => x.email.toLowerCase() === userBody.email.toLowerCase()) !== -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  //creating new user
  let userRes = addUser(userBody);
  return userRes;
};

module.exports = {
  createUser,
};
