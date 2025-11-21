const { smsCodeNumberOfCharacters } = require('./../config');
/* Это мы эмулируем объект db */
function DB(fun, queryList) {
  let db = Object.create(DB.properties);
  db.fun = fun;
  db.queryList = queryList;
  return db;
}
DB.properties = {
  counterDB: 0,
  run: function (query, paramArr, fun) {
    // данный метод напоминает метод run в оригинальном объекте db
    this.counterDB++;
    const innerFun = function (err, rows, fields) {
      if (typeof fun === 'function') return fun(err, rows);
    };
    const otherThis = this;
    const connection = {
      otherThis,
      query(query, paramArr, innerFun) {
        // это мы эмулируем метод query оригинального объекта db
        if (
          typeof query !== 'string' || // это мы убеждаемся что запрос -- это хотя бы строка
          typeof paramArr !== 'object' || // это мы убеждаемся
          paramArr.length === undefined || // что paravArr -- массив
          typeof innerFun !== 'function' || // проверяем что это функция
          !otherThis.queryList.find((x) => x === query) // проверяем есть вообще в списке данный запрос. А то может быть этот запрос вообще от балды
        )
          return innerFun({ code: 'something1' }); // если функция получает не null в первом параметре, то значит произошла ошибка с взаимодействием с БД
        return otherThis.fun(query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters); // если все хорошо, то вызывается функция переданная при инициации объекта. При вызове ей будет передаваться указанные параметры
      },
    };
    return connection.query(query, paramArr, innerFun); // здесь дожне быть json
  },
};

exports.DB = DB;
