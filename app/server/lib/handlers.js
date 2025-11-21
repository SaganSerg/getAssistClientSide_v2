const smsGenerator = require('./smsGenerator').generator;
// const ifGetCheckGooglePlay = require('./commonFunctions').ifGetCheckGooglePlay;
const { getTimeForMySQL, getFakeTel, ifGetCheckGooglePlay } = require('./commonFunctions');
const getFunGetResponseJSON = require('./getFunGetResponseJSON');
const makeConnectionUpdateUsersReturnJSON = require('./makeConnectionUpdateUsersReturnJSON');
const db = require('./db');
const {
  telephoneNumberMin,
  telephoneNumberMax,
  // fakeTelephoneForProduction,
  // fakeTelephoneForDevelopment,
  // fakeTelephoneForTest,
  smsCodeNumberOfCharacters,
  maxLenghtOfUserName,
  deleteSmsTime,
  fakeSMS,
} = require('./../config');

const getFunGetSMSCodeForRegistrationByTelephone = (
  smsGenerator,
  getFunGetResponseJSON,
  db,
  ifGetCheckGooglePlay,
) => {
  return (app) => {
    const getResponseJSON = getFunGetResponseJSON(app);
    let fakeTel = getFakeTel(app);
    return (req, res, next) => {
      const body = req?.body,
        telephoneNumber = body?.telephoneNumber;
      if (!telephoneNumber) return res.status(400).json(getResponseJSON('0001000'));
      // так как в дальнейшем номер телефона потребуется именно в виде строки, то в число преорбазовываю только в нужных местах
      const telephoneNumberLength = telephoneNumber.length;
      if (
        isNaN(Number(telephoneNumber)) ||
        telephoneNumberLength < telephoneNumberMin ||
        telephoneNumberLength > telephoneNumberMax
      )
        return res.status(200).json(getResponseJSON('0001002'));
      return db.run(
        'SELECT * FROM telephones WHERE telephone_number = ?',
        [telephoneNumber],
        (err, selectTelephonesRows) => {
          // [] -- данное значение имеет selectTelephonesRows если в базе ничего не найдено
          if (err || selectTelephonesRows.length > 1) {
            // console.log(selectTelephonesRows.length)
            return res.status(200).json(getResponseJSON('0001003'));
          }
          if (!selectTelephonesRows.length) {
            // это означает, что ранее не было НИ ОДНОГО запроса для этого номера телефона, поэтому можно ничего не проверять
            return db.run('INSERT INTO users () VALUE ()', [], (err, insertUsersRows) => {
              if (err)
                return res
                  .status(200)
                  .json(getResponseJSON('0001003', 'ошибка БД INSERT INTO users () VALUE ()'));
              const userId = insertUsersRows.insertId;
              return db.run(
                'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
                [telephoneNumber, userId],
                (err, insertTelephoneRows) => {
                  /* проверка err?.code === "ER_DUP_ENTRY" нужна для того, чтобы исключить создание мусорных user-ов, в случае, когда во время одного запроса к БД, другой запрос успел создать учетную записи. Такое возможно в асинхронном коде  */
                  if (err?.code === 'ER_DUP_ENTRY') {
                    db.run('DELETE FROM users WHERE user_id = ?', [userId], () => {}); // сюда нужно будет передать функцию которая будет записывать логи с ошибками
                    return res.status(200).json(getResponseJSON('0011002'));
                  }
                  if (err) {
                    return res
                      .status(200)
                      .json(
                        getResponseJSON(
                          '0001003',
                          'ошибка БД INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
                        ),
                      );
                  }
                  if (telephoneNumber === fakeTel) {
                    ifGetCheckGooglePlay();
                    return res.status(200).json(getResponseJSON('0010000', 'fakeTel'));
                  }
                  return smsGenerator(
                    req,
                    res,
                    next,
                    insertTelephoneRows.insertId,
                    telephoneNumber,
                    app,
                  );
                },
              );
            });
          } else if (selectTelephonesRows[0]['delete_'] === 1) {
            return res.status(400).json(getResponseJSON('0001004'));
          } else {
            // такая ситуация, при которой user и его телефон уже существуют, но токена у клиента нет -- возможна, при утрате токена или при запросе первичной СМС, но когда на первую СМС-ку пользователь не отреагировал.
            return db.run(
              'SELECT * FROM smscodes WHERE telephone_id = ?',
              [selectTelephonesRows[0].telephone_id],
              (err, selectSmsCodeRows) => {
                if (err)
                  return res
                    .status(200)
                    .json(
                      getResponseJSON(
                        '0001003',
                        'ошибка БД SELECT * FROM smscodes WHERE telephone_id = ?',
                      ),
                    );
                if (selectSmsCodeRows.length) {
                  const json = getResponseJSON('0011001', 'where selectSmsCodeRows.length');
                  let smsTimeout = Math.floor(
                    (deleteSmsTime - (new Date() - new Date(selectSmsCodeRows[0].time_))) / 1000,
                  );
                  json['smsTimeout'] = smsTimeout > 0 ? smsTimeout : 0;
                  return res.status(200).json(json);
                }
                // это пиздец какой кастыль сделан для того, чтобы
                if (telephoneNumber === fakeTel) {
                  ifGetCheckGooglePlay();
                  return res.status(200).json(getResponseJSON('0010000'));
                }
                return smsGenerator(
                  req,
                  res,
                  next,
                  selectTelephonesRows[0].telephone_id,
                  telephoneNumber,
                  app,
                );
              },
            );
          }
        },
      );
    };
  };
};
const getFunGetTokens = (getFunGetResponseJSON, db, makeConnectionUpdateUsersReturnJSON) => {
  // надо будет переписать фукцию getFunGetTokens, чтобы туда можно было передавать функцию makeConnectionUpdateUsersReturnJSON
  return (app) => {
    const getResponseJSON = getFunGetResponseJSON(app);
    let fakeTel = getFakeTel(app);
    return (req, res, next) => {
      const body = req?.body,
        telephoneNumber = body?.telephoneNumber,
        smsCode = body?.smsCode,
        userName = body?.userName;
      if (!telephoneNumber || !smsCode) return res.status(200).json(getResponseJSON('0001000'));
      const telephoneNumberLength = telephoneNumber.length;
      if (
        isNaN(Number(telephoneNumber)) ||
        telephoneNumberLength < telephoneNumberMin ||
        telephoneNumberLength > telephoneNumberMax
      )
        return res.status(200).json(getResponseJSON('0001002'));
      if (smsCode.length !== smsCodeNumberOfCharacters)
        return res.status(200).json(getResponseJSON('0041001'));
      if (userName && userName.length > maxLenghtOfUserName)
        return res.status(200).json(getResponseJSON('0041002'));
      return db.run(
        'SELECT * FROM telephones WHERE telephone_number = ?',
        [telephoneNumber],
        (err, selectTelephonesRows) => {
          if (err) {
            return res
              .status(200)
              .json(
                getResponseJSON(
                  '0001003',
                  'ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
                ),
              );
          }
          if (selectTelephonesRows.length > 1) {
            return res
              .status(200)
              .json(
                getResponseJSON(
                  '0001003',
                  'ощибка БД SELECT * FROM telephones WHERE telephone_number = ?',
                ),
              );
          }
          if (!selectTelephonesRows.length) return res.status(200).json(getResponseJSON('0041000'));
          if (selectTelephonesRows[0]['delete_'])
            return res.status(400).json(getResponseJSON('0001004'));
          const now = new Date();
          const userId = selectTelephonesRows[0].user_id;
          return db.run(
            'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
            [
              selectTelephonesRows[0].telephone_id,
              getTimeForMySQL(now.setMilliseconds(now.getMilliseconds() - deleteSmsTime)),
            ],
            (err, selectSmsCodeRows) => {
              if (err || selectSmsCodeRows.length > 1)
                return res
                  .status(200)
                  .json(
                    getResponseJSON(
                      '0001003',
                      'ощибка БД SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
                    ),
                  );
              if (telephoneNumber !== fakeTel) {
                if (!selectSmsCodeRows.length)
                  return res
                    .status(200)
                    .json(
                      getResponseJSON(
                        '0041001',
                        'в таблице smscodes записи для данного телефона нет',
                      ),
                    );
                if (selectSmsCodeRows[0].smscode_value != smsCode)
                  return res
                    .status(200)
                    .json(getResponseJSON('0041001', 'код смс не соответсвует реальной смс'));
              } else {
                ifGetCheckGooglePlay();
                if (smsCode !== fakeSMS)
                  return res
                    .status(200)
                    .json(getResponseJSON('0041001', 'код смс не соответсвует фейковой смс'));
              }
              return db.run(
                'SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?',
                [userId],
                (err, selectOwnersRows) => {
                  if (err)
                    return res
                      .status(200)
                      .json(
                        getResponseJSON(
                          '0001003',
                          'ощибка БД SELECT * FROM owners WHERE user_id = ?',
                        ),
                      );
                  if (!selectOwnersRows.length) {
                    // это потом протестируем
                    db.run(
                      'INSERT INTO owners (user_id) VALUES (?)',
                      [userId],
                      (err, insertOwnersRows) => {
                        if (err?.code === 'ER_DUP_ENTRY')
                          return res
                            .status(200)
                            .json(
                              getResponseJSON(
                                '0041002',
                                'ощибка БД INSERT INTO owners (user_id) VALUES (?)',
                              ),
                            );
                        if (err)
                          return res
                            .status(200)
                            .json(
                              getResponseJSON(
                                '0001003',
                                'ощибка БД INSERT INTO owners (user_id) VALUES (?)',
                              ),
                            );
                        return makeConnectionUpdateUsersReturnJSON(
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
                          { id: insertOwnersRows.insertId, toDeleteOwner: true },
                          'reg',
                        );
                      },
                    );
                  } else {
                    return makeConnectionUpdateUsersReturnJSON(
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
                      userName ? userName : selectOwnersRows[0].u_user_name,
                      { id: selectOwnersRows[0].o_owner_id, toDeleteOwner: false },
                      'auth',
                    );
                  }
                },
              );
            },
          );
        },
      );
    };
  };
};

exports.getSMSCodeFun = getFunGetSMSCodeForRegistrationByTelephone(
  smsGenerator,
  getFunGetResponseJSON,
  db,
  ifGetCheckGooglePlay,
);
exports.getFunGetSMSCodeForRegistrationByTelephone = getFunGetSMSCodeForRegistrationByTelephone;
exports.getTokens = getFunGetTokens(getFunGetResponseJSON, db, makeConnectionUpdateUsersReturnJSON);
exports.getFunGetTokens = getFunGetTokens;
