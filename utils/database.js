//needs to be declared like this for intellisense work
const Sequelize = require('sequelize').Sequelize; 

const sequelize = new Sequelize('user_auth', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

module.exports = sequelize;