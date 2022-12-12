const { v4: uuidv4 } = require('uuid');

var usersDB = [
  {
    email: 'fake@example.com',
    password: 'password1',
    username: 'fake',
    id: 'fakeuserid73',
  },
];

var tokensDB = [];

const addUser = (user) => {
  let newObj = { ...user, id: uuidv4() };
  usersDB.push({ ...newObj });
  return newObj;
};

const updateUser = (index, newObj) => {
  usersDB[index] = { ...newObj };
};

const removeToken = (index) => {
  tokensDB.splice(index, 1);
};

const addToken = (token) => {
  let newObj = { ...token };
  tokensDB.push({ ...newObj });
  return newObj;
};

module.exports = {
  usersDB,
  addUser,
  tokensDB,
  addToken,
  removeToken,
};
