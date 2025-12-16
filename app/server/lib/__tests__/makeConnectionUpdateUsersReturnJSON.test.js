const { makeConnectionUpdateUsersReturnJSON } = require('../makeConnectionUpdateUsersReturnJSON');
const DB = require('./../testFunctions').DB;
const getFunGetResponseJSON = require('./../getFunGetResponseJSON');
const deleteConnection = require('./../deleteConnection');
const { getTokenFunction } = {
  getTokenFunction: (params, tokenSecret) => {
    // pframs -- это объект в котором, элементами являются данные, котороые будут зашифрованы в данной случае { username, usersId, connectionId }
    if (typeof params !== 'object' || typeof tokenSecret !== 'string') {
      return false;
    }
    return (accessTokenExpire) => {
      if (typeof accessTokenExpire !== 'number') {
        return false;
      }
      return 'qwerty';
    };
  },
};
const credentials = require(`./../../.credentials.${process.env.NODE_ENV || 'test'}`);
const { accessTokenExpire, refreshTokenExpire } = require('./../../config');
test('getResponseJSON_0001000', () => {
  // res.status(200).json(return0001003_1)
  // надо определиться какой из вариантов res использовать
  let res = {
    status: (statusNumber) => {
      return {
        json: (json) => json,
      };
    },
  };
  res = {
    status(statusNumber) {
      return this;
    },
    json(jsonStruct) {
      return jsonStruct;
    },
  };

  let next = {};
  // const db = DB(
  //   (query, paramArr, innerFun, otherThis) => {
  //     if (query === otherThis.queryList[0]) {
  //       if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
  //       if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
  //       if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
  //       return innerFun(false, { insertId: 1 });
  //     }
  //     if (query === otherThis.queryList[1]) {
  //       if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
  //       return innerFun(false, [
  //         { connection_id: 1, connection_userAgent: 'someUserAgent1' },
  //         { connection_id: 2, connection_userAgent: 'someUserAgent2' },
  //       ]);
  //     }
  //   },
  //   [
  //     'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
  //     'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
  //   ],
  // );
  const DB1 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
        return innerFun({ code: 'somethingErr4' });
      }
      // if (query === otherThis.queryList[1]) {
      //   if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
      //   return innerFun(true);
      // }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      // 'DELETE FROM owners WHERE owner_id = ?',
    ],
  );
  let app = (environment) => {
    return {
      get() {
        return environment;
      },
    };
  };
  let getResponseJSON = getFunGetResponseJSON(app('test'));
  // req?.headers['user-agent'] ?? 'Unknown'
  let req = {
    headers: {
      'user-agent': 'Vova',
    },
  };
  const deleteOwner = (toDeleteOwner, comment, ownerId, db, res, getResponseJSON, fun) => fun();
  const deleteConnection = (db, connectionId) => true;
  // let addTextInComment = '';
  let userId = 4;
  let userName = 'lkjlkj';
  let objOwnerId = { id: 5, toDeleteOwner: true };
  let status = 'reg';
  expect(
    makeConnectionUpdateUsersReturnJSON(
      req,
      res,
      next,
      DB1,
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
    ),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
    responseCode: '0001003',
  });
  const DB2 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
        return innerFun({ code: 'somethingErr5' });
      }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
    ],
  );
  expect(
    makeConnectionUpdateUsersReturnJSON(
      req,
      res,
      next,
      DB2,
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
    ),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ошибка БД SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
    responseCode: '0001003',
  });

  userName = '';
  const DB3 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
        return innerFun(false, [
          { connection_id: 1, connection_userAgent: 'SomeAgent' },
          { connection_id: 2, connection_userAgent: 'SomeAgent2' },
        ]);
      }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
    ],
  );
  expect(
    makeConnectionUpdateUsersReturnJSON(
      req,
      res,
      next,
      DB3,
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
    ),
  ).toEqual({
    result: 'OK',
    description: 'Tokens are get',
    responseCode: '0040000',
    accessToken: 'qwerty',
    refreshToken: 'qwerty',
    ownerId: 5,
    userId: 4,
    connectedUserAgent: [
      {
        connectedId: 1,
        connectedUserAgentName: 'SomeAgent',
      },
      {
        connectedId: 2,
        connectedUserAgentName: 'SomeAgent2',
      },
    ],
    status: 'reg',
    userName: '',
  });

  userName = 'Vasa';
  const DB4 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
        return innerFun(false, { insertId: 1 });
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
        return innerFun(false, [
          { connection_id: 1, connection_userAgent: 'SomeAgent' },
          { connection_id: 2, connection_userAgent: 'SomeAgent2' },
        ]);
      }
      if (query === otherThis.queryList[2]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        return innerFun({ code: 'somethingErr2' });
      }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
      'UPDATE users SET user_name = ? WHERE user_id = ?',
    ],
  );
  expect(
    makeConnectionUpdateUsersReturnJSON(
      req,
      res,
      next,
      DB4,
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
    ),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД UPDATE users SET user_name = ? WHERE user_id = ?',
    responseCode: '0001003',
  });
});
