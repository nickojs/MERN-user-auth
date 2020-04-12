const bcrypt = require('bcrypt');
const User = require('../models/user');

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
    user.save()
      .then(user => res.status(201).send({ user }))
      .catch(err => console.log(err));  

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
        message: 'incorrect password for the user ' + user.username
      });
    }
  
    return res.status(200).send({ 
      message: 'user ' + user.username + ' logged in'
    });

  } catch (error) {
    console.log(error);
  }
}