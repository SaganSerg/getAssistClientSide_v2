const {
    smsCodeNumberOfCharacters
} = require('./../../config'),
    smsGenerator = require('./../smsGenerator')
const getFunGetResponseJSON = require('./../getFunGetResponseJSON')
test('get sms test', () => {
    const sms = smsGenerator.getSmsCode(smsCodeNumberOfCharacters)
    expect(sms).toMatch(/^\d+$/)
    expect(sms?.length).toEqual(smsCodeNumberOfCharacters)
})
test('set sms test', () => {
    // const queryList = ['INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)',
    //     "DELETE FROM smscodes WHERE telephone_id = ?"
    // ]
    class DB {
        constructor() {
            this.queryList = ['INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)',
                "DELETE FROM smscodes WHERE telephone_id = ?"
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
                        if (otherThis.counterDB === 2) {
                            if (query !== otherThis.queryList[1]) return innerFun({ code: 'something3' })
                            if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
                            return innerFun(false, [])
                        }
                    }
                }
                return connection.query(query, paramArr, innerFun) // здесь дожне быть json
            }
        }
    }
    class DBerr1 {
        constructor() {
            this.queryList = ['INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)',
                "DELETE FROM smscodes WHERE telephone_id = ?"
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
                        if (otherThis.counterDB === 1) {
                            return innerFun({ code: "ER_DUP_ENTRY" })
                        }
                    }
                }
                return connection.query(query, paramArr, innerFun) // здесь дожне быть json
            }
        }
    }
    class DBerr2 {
        constructor() {
            this.queryList = ['INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)',
                "DELETE FROM smscodes WHERE telephone_id = ?"
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
                        if (otherThis.counterDB === 1) {
                            return innerFun({ code: "something" })
                        }
                    }
                }
                return connection.query(query, paramArr, innerFun) // здесь дожне быть json
            }
        }
    }
    class SmsAeroThen {
        constructor() {
            this.x = 1
            this.y = 2
            this.send = (telephoneNumber, text) => {
                return this
            }
            this.then = (fun) => {
                this.value = fun()
                return this
            }
            this.catch = (fun) => {
                return this.value

            }
        }
    }
    class SmsAeroErr {
        constructor() {
            this.x = 1
            this.y = 2
            this.send = (telephoneNumber, text) => {
                return this
            }
            this.then = (fun) => {
                return this
            }
            this.catch = (fun) => {
                this.value = fun()
                return this.value
            }
        }
    }
    // app.get('env') 'test' 'development'
    // req.body.serialNumberOfPhone undefinde 'somename'
    // res.status(200).json(getResponseJSON("0011001"))
    // next {}
    // telephoneId 1
    // telephoneNumber = '79611835081'
    const appTest = {
        get() {
            return 'test'
        }
    }
    const appDevelopment = {
        get() {
            return 'development'
        }
    }
    const reqSomename = {
        body: {
            serialNumberOfPhone: 'somename'
        }
    }
    const reqUndefind = {
        body: {}
    }
    const res = {
        status(statusNumber) {
            return this
        },
        json(jsonStruct) {
            return jsonStruct
        }
    }
    const next = {}
    const telephoneId = 1
    const telephoneNumber = '79611835081'
    let setTimeout = (fun, deleteSmsTime, telephoneId) => {
        fun(telephoneId)
    }
    expect((smsGenerator.getGenerator((new DB), SmsAeroThen, getFunGetResponseJSON, setTimeout))(reqSomename, res, next, telephoneId, telephoneNumber, appTest)).toEqual({
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000"
    })
    expect((smsGenerator.getGenerator((new DB), SmsAeroThen, getFunGetResponseJSON, setTimeout))(reqSomename, res, next, telephoneId, telephoneNumber, appDevelopment)).toEqual({
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000"
    })
    expect((smsGenerator.getGenerator((new DB), SmsAeroThen, getFunGetResponseJSON, setTimeout))(reqUndefind, res, next, telephoneId, telephoneNumber, appDevelopment)).toEqual({
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000"
    })
    expect((smsGenerator.getGenerator((new DB), SmsAeroErr, getFunGetResponseJSON, setTimeout))(reqSomename, res, next, telephoneId, telephoneNumber, appTest)).toEqual({
        "result": 'ERR',
        "description": "SMS in not sent. Something went wrong",
        "responseCode": "0011000"
    })
    expect((smsGenerator.getGenerator((new DBerr1), SmsAeroErr, getFunGetResponseJSON, setTimeout))(reqSomename, res, next, telephoneId, telephoneNumber, appTest)).toEqual({
        "result": 'ERR',
        "description": "For this telephone number the SMS request has already been made",
        "responseCode": "0011001",
        "smsTimeout": '0'
    })
    expect((smsGenerator.getGenerator((new DBerr2), SmsAeroErr, getFunGetResponseJSON, setTimeout))(reqSomename, res, next, telephoneId, telephoneNumber, appTest)).toEqual({
        "result": 'ERR',
        "description": "Something went wrong",
        "responseCode": "0001003"
    })

})