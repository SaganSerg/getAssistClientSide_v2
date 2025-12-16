const handlers = require('./../handlers');
const DB = require('./../testFunctions').DB;
const getFunGetResponseJSON = require('./../getFunGetResponseJSON');
const { fakeTelephoneForTest, fakeSMS } = require('./../../config');
test('getSMSCode', () => {
  const smsGenerator = () => {
    return {
      result: 'OK',
      description: 'SMS is sent',
      responseCode: '0010000',
    };
  };
  const getFunIfGetCheckGooglePlay = () => () => {};
  const app = (environment) => {
    return {
      get() {
        return environment;
      },
    };
  };
  const req = {
    body: {
      telephoneNumber: '79001234567',
    },
  };
  const res = {
    status(statusNumber) {
      return this;
    },
    json(jsonStruct) {
      return jsonStruct;
    },
  };
  const next = {};

  const DB1 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        // let telephoneNumber = Number(paramArr[0])
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, [{ delete_: 0, telephone_id: 1 }]);
      }
      // if (query === otherThis.queryList[1]) {
      //     return innerFun(false, [])
      // }
      // if (query === otherThis.queryList[2]) {
      //     console.log(paramArr[1])
      //     if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
      //     return innerFun(false, [])
      // }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' });
        return innerFun(false, []);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      // 'INSERT INTO users () VALUE ()',
      // 'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
      // 'DELETE FROM users WHERE user_id = ?',
      'SELECT * FROM smscodes WHERE telephone_id = ?',
    ],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB1,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'OK',
    description: 'SMS is sent',
    responseCode: '0010000',
  });
  const DB2 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun([true, true]);
      }
    },
    ['SELECT * FROM telephones WHERE telephone_number = ?'],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB2,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'Something went wrong',
    responseCode: '0001003',
  });

  const DB3 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, [{ delete_: 1, telephone_id: 1 }]);
      }
    },
    ['SELECT * FROM telephones WHERE telephone_number = ?'],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB3,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'The account associated with this phone number is marked for deletion.',
    responseCode: '0001004',
  });

  const DB4 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        // let telephoneNumber = Number(paramArr[0])
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, []);
      }
      if (query === otherThis.queryList[1]) {
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[2]) {
        if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number')
          return innerFun({ code: 'something3' });
        return innerFun(false, []);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'INSERT INTO users () VALUE ()',
      'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
    ],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB4,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'OK',
    description: 'SMS is sent',
    responseCode: '0010000',
  });

  const DB5 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, []);
      }
      if (query === otherThis.queryList[1]) {
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[2]) {
        if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number')
          return innerFun({ code: 'something3' });
        return innerFun(false, []);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'INSERT INTO users () VALUE ()',
      'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
    ],
  );
  const req5 = {
    body: {
      telephoneNumber: '79601302040',
    },
  };
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB4,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req5, res, next),
  ).toEqual({
    result: 'OK',
    description: 'SMS is sent -- fakeTel',
    responseCode: '0010000',
  });

  const DB6 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, []);
      }
      if (query === otherThis.queryList[1]) {
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[2]) {
        if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number')
          return innerFun({ code: 'something3' });
        return innerFun({ code: 'ER_DUP_ENTRY' });
      }
      if (query === otherThis.queryList[3]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' });
        return innerFun(false, []);
      }
      // if (query === otherThis.queryList[4]) {
      //     if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
      //     return innerFun(false, [])
      // }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'INSERT INTO users () VALUE ()',
      'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
      'DELETE FROM users WHERE user_id = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ?'
    ],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB6,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'This phone number is already registered in the process of registering other requests',
    responseCode: '0011002',
  });

  const DB7 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
        return innerFun(false, []);
      }
      if (query === otherThis.queryList[1]) {
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[2]) {
        if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number')
          return innerFun({ code: 'something3' });
        return innerFun({ code: 'someCode' });
      }
      if (query === otherThis.queryList[3]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' });
        return innerFun(false, []);
      }
      // if (query === otherThis.queryList[4]) {
      //     if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
      //     return innerFun(false, [])
      // }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'INSERT INTO users () VALUE ()',
      'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
      'DELETE FROM users WHERE user_id = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ?'
    ],
  );
  expect(
    handlers.getFunGetSMSCodeForRegistrationByTelephone(
      smsGenerator,
      getFunGetResponseJSON,
      DB7,
      getFunIfGetCheckGooglePlay,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ошибка БД INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
    responseCode: '0001003',
  });
});

test('getTokens', () => {
  // это вообще еще не готово и возможно нужно будет все менять.
  const smsGenerator = () => {
    return {
      result: 'OK',
      description: 'SMS is sent',
      responseCode: '0010000',
    };
  };
  const getFunIfGetCheckGooglePlay = () => () => {};
  const app = (environment) => {
    return {
      get() {
        return environment;
      },
    };
  };

  const res = {
    status(statusNumber) {
      return this;
    },
    json(jsonStruct) {
      return jsonStruct;
    },
  };
  const next = {};
  const makeConnectionUpdateUsersReturnJSON = (
    req,
    res,
    next,
    db,
    getResponseJSON,
    getTokenFunction,
    userId,
    deleteOwner,
    deleteConnection,
    accessTokenExpire,
    refreshTokenExpire,
    userName,
    objOwnerId,
    status,
  ) => {
    return {
      result: 'OK',
      description: 'Tokens are get',
      responseCode: '0040000',
      accessToken: 'qwerty',
      refreshToken: 'qwerty',
      ownerId: objOwnerId.id,
      userId: userId,
      connectedUserAgent: [
        {
          connectedId: '1',
          connectedUserAgentName: 'someAgent',
        },
      ],
      status: status,
      userName: userName,
    };
  };
  const DBfake = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {}, []);
  /*  в теле запроса нет ни телефона, ни смс */
  let req = {
    body: {},
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'the request requestJSON structure does not match URL',
    responseCode: '0001000',
  });

  /* в теле запроса нет телефона */
  req = {
    body: {
      smsCode: '11111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'the request requestJSON structure does not match URL',
    responseCode: '0001000',
  });

  /* в теле запроса нет sms */
  req = {
    body: {
      telephoneNumber: '11111111111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'the request requestJSON structure does not match URL',
    responseCode: '0001000',
  });

  /* номер телефона короче чем нужно */
  req = {
    body: {
      smsCode: '11111',
      telephoneNumber: '1111111111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'TelephoneNumber is not format',
    responseCode: '0001002',
  });

  /* номер телефона длиннее чем нужно */
  req = {
    body: {
      smsCode: '11111',
      telephoneNumber: '1111111111111111111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'TelephoneNumber is not format',
    responseCode: '0001002',
  });

  /* смс-код короче чем надо */
  req = {
    body: {
      smsCode: '1111',
      telephoneNumber: '11111111111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'SMS code is wrong',
    responseCode: '0041001',
  });

  /* смс-код длиннее чем надо */
  req = {
    body: {
      smsCode: '111111',
      telephoneNumber: '11111111111',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'SMS code is wrong',
    responseCode: '0041001',
  });

  /* имя пользователя длиннее чем нужно */
  req = {
    body: {
      smsCode: '11111',
      telephoneNumber: '11111111111',
      userName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',
    },
  };
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DBfake,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'Username is too long',
    responseCode: '0041002',
  });

  /* 'SELECT * FROM telephones WHERE telephone_number = ?' err */
  req = {
    body: {
      smsCode: '11111',
      telephoneNumber: '11111111111',
      userName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
  };
  const DB1 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB1' });
        return innerFun({ code: 'something2_DB1' });
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB1,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
    responseCode: '0001003',
  });

  /* 'SELECT * FROM telephones WHERE telephone_number = ?' selectTelephonesRows.length > 1 */
  const DB2 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB2' });
        return innerFun(false, [1, 2]);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB2,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
    responseCode: '0001003',
  });

  /* 'SELECT * FROM telephones WHERE telephone_number = ?' !selectTelephonesRows.length */
  const DB3 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB3' });
        return innerFun(false, []);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB3,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'telephoneNumber is not registration',
    responseCode: '0041000',
  });

  /* 'SELECT * FROM telephones WHERE telephone_number = ?' selectTelephonesRows[0]['delete_'] */
  const DB4 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB3' });
        return innerFun(false, [{ delete_: 1 }]);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB4,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'The account associated with this phone number is marked for deletion.',
    responseCode: '0001004',
  });

  /* 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?' err */
  const DB5 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB5' });
        return innerFun(false, [{ user_id: 1, telephone_id: 1 }]);
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something2_DB5' });
        if (typeof paramArr[1] !== 'string') return innerFun({ code: 'something3_DB5' });
        return innerFun({ code: 'something4_DB5' });
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB5,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
    responseCode: '0001003',
  });

  /* 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?' selectSmsCodeRows.length > 1 */
  const DB6 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB5' });
        return innerFun(false, [{ user_id: 1, telephone_id: 1 }]);
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something2_DB5' });
        if (typeof paramArr[1] !== 'string') return innerFun({ code: 'something3_DB5' });
        return innerFun(false, [{}, {}]);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB6,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
    responseCode: '0001003',
  });

  /* 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?' !selectSmsCodeRows.length */
  const DB7 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something1_DB5' });
        return innerFun(false, [{ user_id: 1, telephone_id: 1 }]);
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something2_DB5' });
        if (typeof paramArr[1] !== 'string') return innerFun({ code: 'something3_DB5' });
        return innerFun(false, []);
      }
    },
    [
      'SELECT * FROM telephones WHERE telephone_number = ?',
      'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
      // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
      // 'INSERT INTO owners (user_id) VALUES (?)',
    ],
  );
  expect(
    handlers.getFunGetTokens(
      getFunGetResponseJSON,
      DB7,
      makeConnectionUpdateUsersReturnJSON,
    )(app('test'))(req, res, next),
  ).toEqual({
    result: 'ERR',
    description: 'SMS code is wrong -- в таблице smscodes записи для данного телефона нет',
    responseCode: '0041001',
  });

  // const DB1 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' });
  //       return innerFun(false, [1, 2]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB1,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'the request requestJSON structure does not match URL',
  //   responseCode: '0001000',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: 'ffff',
  //     smsCode: '11111',
  //   },
  // };
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB1,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'TelephoneNumber is not format',
  //   responseCode: '0001002',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '1111',
  //   },
  // };
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB1,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'SMS code is wrong',
  //   responseCode: '0041001',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111',
  //     userName: 'vvvvlkjlkjljlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjljlklk',
  //   },
  // };
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB1,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'Username is too long',
  //   responseCode: '0041002',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111',
  //   },
  // };
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB1,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description:
  //     'Something went wrong -- ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
  //   responseCode: '0001003',
  // });

  // const DB2 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun({ code: 'something2' });
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB2,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description:
  //     'Something went wrong -- ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
  //   responseCode: '0001003',
  // });

  // const DB3 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, []);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB3,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'telephoneNumber is not registration',
  //   responseCode: '0041000',
  // });

  // const DB4 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [{ delete_: 1 }]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     // 'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB4,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'The account associated with this phone number is marked for deletion.',
  //   responseCode: '0001004',
  // });

  // const DB5 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun({ code: 'something2' });
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB5,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description:
  //     'Something went wrong -- ощибка БД SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //   responseCode: '0001003',
  // });

  // const DB6 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [1, 2]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB6,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description:
  //     'Something went wrong -- ощибка БД SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //   responseCode: '0001003',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: fakeTelephoneForTest,
  //     smsCode: '11111',
  //   },
  // };
  // const DB7 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [1]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB7,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'SMS code is wrong -- код смс не соответсвует фейковой смс',
  //   responseCode: '0041001',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111',
  //   },
  // };
  // const DB8 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [{ smscode_value: '00000' }]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     // 'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB8,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'SMS code is wrong -- код смс не соответсвует реальной смс',
  //   responseCode: '0041001',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111', // смс-ки совпадают
  //   },
  // };
  // const DB9 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [{ smscode_value: '11111' }]); // смс-ки совпадают
  //     }
  //     if (query === otherThis.queryList[2]) {
  //       return innerFun({ code: 'something err' });
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB9,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'Something went wrong -- ощибка БД SELECT * FROM owners WHERE user_id = ?',
  //   responseCode: '0001003',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111', // смс-ки совпадают
  //   },
  // };
  // const DB10 = DB(
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [{ smscode_value: '11111' }]); // смс-ки совпадают
  //     }
  //     if (query === otherThis.queryList[2]) {
  //       return innerFun(false, [1]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB10,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'Something went wrong -- ощибка БД SELECT * FROM owners WHERE user_id = ?',
  //   responseCode: '0001003',
  // });

  // req = {
  //   body: {
  //     telephoneNumber: '79001234567',
  //     smsCode: '11111', // смс-ки совпадают
  //   },
  // };
  // const DB11 = DB(
  //   // это не закончено
  //   (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
  //     if (query === otherThis.queryList[0]) {
  //       return innerFun(false, [1]);
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       return innerFun(false, [{ smscode_value: '11111' }]); // смс-ки совпадают
  //     }
  //     if (query === otherThis.queryList[2]) {
  //       return innerFun(false, [1]);
  //     }
  //   },
  //   [
  //     'SELECT * FROM telephones WHERE telephone_number = ?',
  //     'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
  //     'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
  //     // 'INSERT INTO owners (user_id) VALUES (?)',
  //   ],
  // );
  // expect(
  //   handlers.getFunGetTokens(
  //     getFunGetResponseJSON,
  //     DB11,
  //     makeConnectionUpdateUsersReturnJSON,
  //   )(app('test'))(req, res, next),
  // ).toEqual({
  //   result: 'ERR',
  //   description: 'Something went wrong -- ощибка БД SELECT * FROM owners WHERE user_id = ?',
  //   responseCode: '0001003',
  // });
});
