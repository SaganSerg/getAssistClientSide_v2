const commonFunctions = require('./../commonFunctions')

test('getFunIfGetCheckGooglePlay', () => {
    class DB {
        constructor() {
            this.queryList = ['INSERT INTO checkGoogleCome () VALUE ()',
            ]
            this.counterDB = 0
            this.run = (query, paramArr, fun) => {
                this.counterDB++
                const innerFun = function (err, rows, fields) {
                    if (typeof fun === 'function') return fun(err, rows)
                }
                const otherThis = this
                const connection = {
                    otherThis,
                    query(query, paramArr, innerFun) {
                        if (typeof query !== 'string' || typeof paramArr !== 'object' || paramArr.length === undefined || typeof innerFun !== 'function') return innerFun({ code: 'something1' })
                        if (otherThis.counterDB === 1) {
                            if (query !== otherThis.queryList[0]) return innerFun({ code: 'something' })
                            if (paramArr[0].length !== smsCodeNumberOfCharacters || !(new RegExp(/^\d+$/)).test(paramArr[0]) || typeof paramArr[1] !== 'string' || typeof paramArr[2] !== 'number') return innerFun({ code: 'something2' })
                            return innerFun(false, [])
                        }
                    }
                }
                return connection.query(query, paramArr, innerFun) // здесь дожне быть json
            }
        }
    }
    expect(commonFunctions.getFunIfGetCheckGooglePlay(new DB)).toBeTruthy()
})