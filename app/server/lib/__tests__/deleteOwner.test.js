const { deleteOwner } = require('./../deleteOwner');
const DB = require('./../testFunctions').DB;
const getFunGetResponseJSON = require('./../getFunGetResponseJSON');
test('getResponseJSON_0001000', () => {
  let res = {
    status(statusNumber) {
      return this;
    },
    json(jsonStruct) {
      return jsonStruct;
    },
  };

  let next = {};
  const DB1 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        return innerFun(false, [1]);
      }
    },
    ['DELETE FROM owners WHERE owner_id = ?'],
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
  let fun = () => {
    return res
      .status(500)
      .json(
        getResponseJSON(
          '0001003',
          'ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
        ),
      );
  };
  let toDeleteOwner = true;
  let comment = 'some comment';
  let ownerId = 1;
  // fun, toDeleteOwner, comment, ownerId, db, res
  expect(deleteOwner(toDeleteOwner, comment, ownerId, DB1, res, getResponseJSON, fun)).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
    responseCode: '0001003',
  });

  const DB2 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        return innerFun({});
      }
    },
    ['DELETE FROM owners WHERE owner_id = ?'],
  );
  expect(deleteOwner(toDeleteOwner, comment, ownerId, DB2, res, getResponseJSON, fun)).toEqual({
    result: 'ERR',
    description: 'Something went wrong -- some comment',
    responseCode: '0001003',
  });

  const DB3 = DB(
    (query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
      if (query === otherThis.queryList[0]) {
        return innerFun(false, {});
      }
    },
    ['DELETE FROM owners WHERE owner_id = ?'],
  );
  expect(deleteOwner(toDeleteOwner, comment, ownerId, DB3, res, getResponseJSON, fun)).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
    responseCode: '0001003',
  });

  toDeleteOwner = false;
  expect(deleteOwner(toDeleteOwner, comment, ownerId, DB3, res, getResponseJSON, fun)).toEqual({
    result: 'ERR',
    description:
      'Something went wrong -- ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
    responseCode: '0001003',
  });
});
