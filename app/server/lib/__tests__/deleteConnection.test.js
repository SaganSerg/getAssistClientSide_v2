const { deleteConnection } = require('./../deleteConnection');
const DB = require('./../testFunctions').DB;
/* 
const { checkedFunction } = require('./../checkedFunction');
test('testName', () => {
    expect().toBe();
    expect().toBeTruthy();
    expect().toEqual();
});
*/
test('deleteConnection', () => {
  const DB1 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr1' });
        return innerFun(true);
      }
      return 'The query strings did not match.';
    },
    ['DELETE FROM connectons WHERE connection_id = ?'],
  );
  expect(deleteConnection(DB1, 1)).toBeFalsy();
  const DB2 = DB(
    (query, paramArr, innerFun, otherThis) => {
      if (query === otherThis.queryList[0]) {
        if (typeof paramArr[0] !== 'number') return innerFun({ code: 'somethingErr1' });
        return innerFun(false);
      }
      return 'The query strings did not match.';
    },
    ['DELETE FROM connectons WHERE connection_id = ?'],
  );
  expect(deleteConnection(DB2, 1)).toBeTruthy();
});
