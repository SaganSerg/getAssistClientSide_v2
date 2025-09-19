const jwt = require('jsonwebtoken');
exports.getTokenFunction = (params, tokenSecret) => {
  // pframs -- это объект в котором, элементами являются данные, котороые будут зашифрованы в данной случае { username, usersId, connectionId }
  if (typeof params !== 'object' || typeof tokenSecret !== 'string') {
    return false;
  }
  return (accessTokenExpire) => {
    if (typeof accessTokenExpire !== 'number') {
      return false;
    }
    return jwt.sign(params, tokenSecret, { expiresIn: accessTokenExpire });
  };
};
