const mysql = require('mysql');
const { host, user, password, database } = require('./../config');
const db = {
  run(query, paramArr, fun) {
    // запрос должен быть выполнен в виде строки с интерполяцией переменных в виде элементов массива paramArr
    const innerFun = function (err, rows, fields) {
      if (typeof fun === 'function') return fun(err, rows);
    };
    const connection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    connection.connect();
    connection.query(query, paramArr, innerFun);
    connection.end();
  },
  poolRun(query, paramArr, fun) {
    // запрос должен быть выполнен в виде строки с интерполяцией переменных в виде элементов массива paramArr
    const innerFun = function (err, rows, fields) {
      if (typeof fun === 'function') return fun(err, rows);
    };
    const pool = mysql.createPool({
      connectionLimit: 10, // максимальное количество соединений
      host,
      user,
      password,
      database,
      acquireTimeout: 60000, // таймаут получения соединения
      timeout: 60000, // тайм
    });
    pool.getConnection((err, connection) => {
      if (err) {
        throw new Error(err);
      }
      connection.query(query, paramArr, (err, results) => {
        connection.release();
        if (err) {
          return innerFun(err);
        }
        return innerFun(null, results);
      });
    });
  }
};
module.exports = db;

/* 
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.

*/
