const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    const fetchedUser = await User.findOne({ where: { email }});
    if (fetchedUser !== null) {
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

})

module.exports = router;