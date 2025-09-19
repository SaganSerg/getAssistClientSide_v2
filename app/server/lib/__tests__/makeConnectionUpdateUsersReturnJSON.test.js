const { makeConnectionUpdateUsersReturnJSON } = require('../makeConnectionUpdateUsersReturnJSON');
const DB = require('./../testFunctions').DB;
const getFunGetResponseJSON = require('./../getFunGetResponseJSON');
const getTokenFunction = require('./../getTokenFunction');
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
  let db = DB(
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
          { connection_id: 1, connection_userAgent: 'someUserAgent1' },
          { connection_id: 2, connection_userAgent: 'someUserAgent2' },
        ]);
      }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
    ],
  );
  db = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'string') return innerFun({ code: 'somethingErr1' });
        if (typeof paramArr[1] !== 'number') return innerFun({ code: 'somethingErr2' });
        if (typeof paramArr[2] !== 'string') return innerFun({ code: 'somethingErr3' });
        return innerFun(true);
      }
      if (query === otherThis.queryList[1]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr4' });
        return innerFun(true);
      }
    },
    [
      'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
      'DELETE FROM owners WHERE owner_id = ?',
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
  let addTextInComment = '';
  let userId = 1;
  let userName = 'lkjlkj';
  let objOwnerId = { id: 1, toDeleteOwner: true };
  let status = 'reg';
  expect(
    makeConnectionUpdateUsersReturnJSON(
      req,
      res,
      next,
      db,
      getResponseJSON,
      addTextInComment,
      getTokenFunction,
      userId,
      credentials,
      accessTokenExpire,
      refreshTokenExpire,
      userName,
      objOwnerId,
      status,
    ),
  ).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ошибка INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
    responseCode: '0001003',
  });
});
