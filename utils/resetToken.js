const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

const token = async () => { 
  const rawToken = await randomBytes(32);
  return rawToken.toString('hex')
}

module.exports = token;