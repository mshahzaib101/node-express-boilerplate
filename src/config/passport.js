const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const { usersDB } = require('../inMemoryDatabase/users');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    console.log('passport verify run', payload);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    let userIndex = usersDB.findIndex((x) => x.id === payload.sub);
    var user = null;
    if (userIndex !== -1) {
      user = { ...usersDB[userIndex] };
    }
    // const user = await User.findById();

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
