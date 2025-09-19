const { getTokenFunction } = require('./../getTokenFunction');
test('getTokenFunction', () => {
  // params, tokenSecret, accessTokenExpire
  expect(typeof getTokenFunction({}, '') === 'function').toBeTruthy();
  expect(typeof getTokenFunction(1, 1) === 'function').toBeFalsy();
  expect(typeof getTokenFunction() === 'function').toBeFalsy();
  let params = {},
    tokenSecret = 'b',
    accessTokenExpire = 0;
  expect(typeof getTokenFunction(params, tokenSecret)(accessTokenExpire) === 'string').toBeTruthy();
});
