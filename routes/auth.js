const express = require('express');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
  const user = { username, email, password };
  
  res.status(201).send({ user });
})

module.exports = router;