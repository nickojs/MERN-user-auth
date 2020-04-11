const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUIDV4,
    unique: true,
    allowNull: false
  },
  username: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;