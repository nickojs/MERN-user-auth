require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});


//error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.send({ error: err.message });
});

sequelize
  .sync({ force: true })
  .then(() => {
    
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
