const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { usersDB, tokensDB, removeToken } = require('../inMemoryDatabase/users');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  let user = null;
  let userIndex = usersDB.findIndex((x) => x.email === email);
  if (userIndex !== -1) {
    user = { ...usersDB[userIndex] };
  }

  if (!user || !((await user.password) === password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  let tokenIndex = tokensDB.findIndex((x) => x.token === refreshToken);

  if (tokenIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  removeToken(tokenIndex);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    console.log('refreshTokenDoc', refreshTokenDoc);
    const user = await userService.getUserById(refreshTokenDoc.user);
    console.log('user', user);
    if (!user) {
      throw new Error();
    }

    removeToken(refreshTokenDoc.index);
    // await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
};
