const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    const fetchedUser = await User.findOne({ where: { email }});
    if (fetchedUser) {
      return res.status(302).send({ 
        error: true,
        message: 'user already registered' 
      });
    }
    
    const user = new User({ username, email, password })
    user.save()
      .then(user => res.status(201).send({ user }))
      .catch(err => console.log(err));  

  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email }});
  if (!user) {
    return res.status(404).send({ 
      error: true,
      message: 'user not found in the database' 
    });
  }

  if(user.password !== password) {
    return res.status(401).send({ 
      error: true,
      message: 'incorrect password for the user ' + user.username
    });
  }

  return res.status(200).send({ 
    message: 'user ' + user.username + ' logged in'
  });

})

module.exports = router;