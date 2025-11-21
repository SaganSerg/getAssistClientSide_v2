const db = require('./db');
const {
  fakeTelephoneForProduction,
  fakeTelephoneForDevelopment,
  fakeTelephoneForTest,
} = require('./../config');

const getFunIfGetCheckGooglePlay = (db) => {
  return () => {
    db.run(
      'INSERT INTO checkGoogleCome () VALUE ()',
      [],
      (err) => (err ? false : true), // данная функция сделана исключительно для проведение тестирования
    );
  };
};

const getTimeForMySQL = (timeStamp) => {
  const getTwoSimbols = (x) => {
    return x > 9 ? x : '0' + x;
  };
  const time = new Date(Number(timeStamp));
  const hours = getTwoSimbols(time.getHours());
  const minutes = getTwoSimbols(time.getMinutes());
  const seconds = getTwoSimbols(time.getSeconds());
  const month = getTwoSimbols(time.getMonth() + 1);
  const date = getTwoSimbols(time.getDate());
  return `${time.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

const getFakeTel = (app) => {
  let fakeTel;
  switch (app.get('env')) {
    case 'production':
      fakeTel = fakeTelephoneForProduction;
      break;
    case 'test':
      fakeTel = fakeTelephoneForTest;
      break;
    case 'development':
      fakeTel = fakeTelephoneForDevelopment;
      break;
    default:
      fakeTel = fakeTelephoneForProduction;
  }
  return fakeTel;
};

exports.ifGetCheckGooglePlay = getFunIfGetCheckGooglePlay(db);
exports.getFunIfGetCheckGooglePlay = getFunIfGetCheckGooglePlay;
exports.getTimeForMySQL = getTimeForMySQL;
exports.getFakeTel = getFakeTel;
