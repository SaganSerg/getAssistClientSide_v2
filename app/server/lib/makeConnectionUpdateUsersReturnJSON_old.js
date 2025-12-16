let makeConnectionUpdateUsersReturnJSON = (
  req,
  res,
  next,
  db,
  getResponseJSON,
  // addTextInComment,
  getTokenFunction,
  userId,
  credentials,
  accessTokenExpire,
  refreshTokenExpire,
  userName,
  objOwnerId, // { id: "Number: owner_id", toDeleteOwner: false or true } удалять владельца или нет
  status, // здесь может быть строка 'reg' или 'auth': регистрация или аутентификация соответственно т.е мы должны передать ту или иную строку, в зависимости от процедуры при которой данная функция применяется
) => {
  let returnedValue = 'unchanged'; // это для тестирования
  const userAgent = req?.headers['user-agent'] ?? 'Unknown';
  const ownerId = objOwnerId.id;

  /* 
    deleteOwner
    данной функции надо передать функцию fun которая не должна ничего получать в качестве аргумента и должна вернуть res.status.json
    toDeleteOwner это objOwnerId.toDeleteOwner
    comment это комментарий который вставляется в getResponseJSON вторым аргументом, в данном случае это строка с SQL-запроса который вызывался в данном случае
  */
  const deleteOwner = (fun, toDeleteOwner, comment) => {
    const innerFun = (fun) => {
      return (err, deleteRows) => {
        if (err) return res.status(500).json(getResponseJSON('0001003', String(comment)));
        fun();
      };
    };

    if (toDeleteOwner)
      return db.run('DELETE FROM owners WHERE owner_id = ?', [ownerId], innerFun(fun));
    return fun();
  };

  return db.run(
    'INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
    [userAgent, userId, 'token'],
    (err, insertConnectionsRows) => {
      if (err) {
        return deleteOwner(
          () => {
            return res
              .status(200)
              .json(
                getResponseJSON(
                  '0001003',
                  'ощибка БД INSERT INTO connections (connection_userAgent, user_id) VALUES (?, ?)',
                ),
              );
          },
          objOwnerId.toDeleteOwner,
          'ошибка INSERT INTO connections (connection_userAgent, user_id, connection_type) VALUES (?, ?, ?)',
        );
      }
      const connectionId = insertConnectionsRows.insertId;
      const params = { userId, connectionId };
      const accessToken = getTokenFunction(
        params,
        credentials.accessTokenSecret,
      )(accessTokenExpire);
      const refreshToken = getTokenFunction(
        params,
        credentials.refreshTokenSecret,
      )(refreshTokenExpire);
      return db.run(
        'SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
        [userId],
        (err, selectConnectionsUserID) => {
          if (err) {
            let return0001003_3 = res
              .status(200)
              .json(
                getResponseJSON(
                  '0001003',
                  'ошибка БД SELECT connection_userAgent, connection_id FROM connections WHERE user_id = ?',
                ),
              );
            return (returnedValue = return0001003_3);
          }
          /* 
      "connectedUserAgent": [
      {
          "connectedId": 0,
          "connectedUserAgentName": ""
      }
      ],
      */
          const connectedUserAgent = [];
          selectConnectionsUserID.forEach((elem) => {
            connectedUserAgent.push({
              connectedId: elem.connection_id,
              connectedUserAgentName: elem.connection_userAgent,
            });
          });
          let return0040000 = {
            ...getResponseJSON('0040000'),
            ...{
              accessToken,
              refreshToken,
              ownerId,
              userId,
              connectedUserAgent,
              status,
              userName,
            },
          };
          if (userName) {
            return db.run(
              'UPDATE users SET user_name = ? WHERE user_id = ?',
              [userName, userId],
              (err, updateUsersRows) => {
                if (err) {
                  deleteOwner();
                  db.run('DELETE FROM connectons WHERE connection_id = ?', [connectionId]);
                  // console.log('this is addedText', addedText)
                  let return0001003_2 = getResponseJSON(
                    `0001003`,
                    'ощибка БД UPDATE users SET user_name = ? WHERE user_id = ?',
                  );
                  res.status(200).json(return0001003_2);
                  return (returnedValue = return0001003_2); // это для тестирования
                  // 'возврат ошибки при попытке обновить user_name при userName заполненном'
                }
              },
            );
            res.status(200).json(return0040000);
            return (returnedValue = return0040000); // это для тестирования
            // 'возрат токено при userName заполненном'
          } else {
            res.status(200).json(return0040000);
            return (returnedValue = return0040000); // это для тестирования
            // 'возрат токенов при userName пустом'
          }
        },
      );
    },
  );
  return returnedValue; // это для тестирования
};
exports.makeConnectionUpdateUsersReturnJSON = makeConnectionUpdateUsersReturnJSON;
