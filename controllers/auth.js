const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const randomBytes = require('../utils/resetToken');

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
    const resetToken = await randomBytes();
    const user = await User.findOne({ where: { email: userEmail }});
    if(!user){
      return res.status(404).send({ 
        error: true,
        message: 'user not found in the database' 
      });
    }
    // sets the expiration date to 1 hour from now
    user.resetTokenExpiration = Date.now() + 3600000;
    user.resetToken = resetToken;
    user.save()
    
    res.status(201).send({ token: resetToken });
  } catch (error) {
    console.log(error);
  }
}

exports.resetPassword = async (req, res, next) => {
  const token = req.params.tokenId; 
  const newPassword = req.body.password;
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOne({ where: { 
      resetToken: token, 
      resetTokenExpiration: {
        [Op.gt]: new Date()
      }}});
      
    if(!user) {
      return res.status(401).send({ 
        error: true,
        message: 'something went wrong' 
      });
    }

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.save();

    res.send({message: 'successfuly changed user password'});
  } catch (error) {
    console.log(error);
  }
}