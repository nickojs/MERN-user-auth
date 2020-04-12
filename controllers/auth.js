const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body
  
  try {
    const fetchedUser = await User.findOne({ where: { email }});
    if (fetchedUser) {
      return res.status(302).send({ 
        error: true,
        message: 'user already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);    
    const user = new User({ username, email, password: hashedPassword });
    user.save();
    res.status(201).send({ user });

  } catch (error) {
    console.log(error);
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email }});
    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(404).send({ 
        error: true,
        message: 'user not found in the database' 
      });
    }
    
    if(!hashedPassword) {
      return res.status(401).send({ 
        error: true,
        message: 'incorrect password for this user'
      });
    }
  
    return res.status(200).send({ 
      message: `user ${user.email} logged in`
    });

  } catch (error) {
    console.log(error);
  }
}

exports.setToken = async (req, res, next) => {
  const userEmail = req.body.email;

  try {
    const rawToken = await randomBytes(32);
    const parsedToken = rawToken.toString('hex');

    const user = await User.findOne({ where: { email: userEmail }});
    if(!user){
      return res.status(404).send({ 
        error: true,
        message: 'user not found in the database' 
      });
    }
    // sets the expiration date to 1 hour from now
    user.resetTokenExpiration = Date.now() + 3600000;
    user.resetToken = parsedToken;
    user.save()
    
    res.status(201).send({ token: parsedToken });
  } catch (error) {
    console.log(error);
  }
}