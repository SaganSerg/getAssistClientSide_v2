const credentials = require(`./.credentials.${process.env.NODE_ENV || 'development'}`);
const oneHour = 60 * 60; // в секундах
const oneMinutesMMSecond = 60 * 1000; // в миллисекундах
// const oneHourMMSecond = oneHour * 1000 // в миллисекундах
const oneDaySecond = oneHour * 24; // в секундах
// const oneDayMMSecond = oneDaySecond * 1000 // в миллисекундах
const deleteSmsTime = oneMinutesMMSecond * 1; // данные по смс-ке удаляются через 3 минуты

module.exports = {
  credentials,
  // это БД с данными
  host: '127.0.0.1',
  user: 'adm_getAssistClientside', // adm_carEquipmentClientSideCrutch
  password: credentials.passDB,
  database: 'getAssistClientside', //carEquipmentClientSideCrutch

  refreshTokenExpire: oneDaySecond * 90, // 90 дней
  accessTokenExpire: oneDaySecond * 30, // 30 дней

  // cleanConnectionsTime: oneDayMMSecond * 1, // 1 day

  // // это строка, которая подставляется, если не известен user-agent
  // unknownUserAgent: 'unknown',

  // отправка СМС
  loginForSMS: 'info@fixelectro.pro',
  keyForSMS: 'NP_iIYrSDe6TjW1dozqP6JX1ldY1p0hb',
  deleteSmsTime,
  smsCodeNumberOfCharacters: 5, // это количество символов в смс коде
  telephoneNumberMax: 18, // это максимальное количество симоволов в телефоне (нужно для проверки номера телефона)
  telephoneNumberMin: 11, // это минимальное количество символов в телефоне (нужно для проверки номера телефона)
  fakeTelephoneForProduction: '79601302040',
  fakeTelephoneForDevelopment: '79601302040',
  fakeTelephoneForTest: '79601302040',
  // maxLenghtOfUserName: 50,
  // cleanSmsCodeTime: deleteSmsTime * 2, // данные в любом случае будут
  // serverToken: 'kuhalkulkjbgjhgjshgcnbvccvxdsgfdhgfjgvbfdsfgdsawqewydfdtjtjhgfjghfbnvcnbvcjgjhgfttygfdsgfdsgfdsgfdsgdfsgfdsgfdsvbvcxxdhgfdhgfd'
};
