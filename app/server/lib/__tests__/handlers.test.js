const handlers = require('./../handlers')
const DB = require('./../testFunctions').DB
const getFunGetResponseJSON = require('./../getFunGetResponseJSON')
test('getSMSCode', () => {
    const smsGenerator = () => {
        return {
            "result": 'OK',
            "description": "SMS is sent",
            "responseCode": "0010000"
        }
    }
    const getFunIfGetCheckGooglePlay = () => () => { }
    const app = environment => {
        return {
            get() {
                return environment
            }
        }
    }
    const req = {
        body: {
            telephoneNumber: '79001234567'
        }
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

    const DB1 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            // let telephoneNumber = Number(paramArr[0])
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [{ 'delete_': 0, telephone_id: 1 }])
        }
        // if (query === otherThis.queryList[1]) {
        //     return innerFun(false, [])
        // }
        // if (query === otherThis.queryList[2]) {
        //     console.log(paramArr[1])
        //     if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
        //     return innerFun(false, [])
        // }
        if (query === otherThis.queryList[1]) {
            if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
            return innerFun(false, [])
        }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?',
        // 'INSERT INTO users () VALUE ()',
        // 'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
        // 'DELETE FROM users WHERE user_id = ?',
        'SELECT * FROM smscodes WHERE telephone_id = ?'
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB1, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000"
    })
    const DB2 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun([true, true])
        }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?'
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB2, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'ERR',
        "description": "Something went wrong",
        "responseCode": "0001003"
    })

    const DB3 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [{ 'delete_': 1, telephone_id: 1 }])
        }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?'
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB3, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'ERR',
        "description": "The account associated with this phone number is marked for deletion.",
        "responseCode": "0001004"
    })

    const DB4 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            // let telephoneNumber = Number(paramArr[0])
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [])
        }
        if (query === otherThis.queryList[1]) {
            return innerFun(false, { insertId: 1 })
        }
        if (query === otherThis.queryList[2]) {
            if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
            return innerFun(false, [])
        }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?',
        'INSERT INTO users () VALUE ()',
        'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB4, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000"
    })

    const DB5 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [])
        }
        if (query === otherThis.queryList[1]) {
            return innerFun(false, { insertId: 1 })
        }
        if (query === otherThis.queryList[2]) {
            if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
            return innerFun(false, [])
        }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?',
        'INSERT INTO users () VALUE ()',
        'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
    ])
    const req5 = {
        body: {
            telephoneNumber: '79601302040'
        }
    }
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB4, getFunIfGetCheckGooglePlay)(app('test'))(req5, res, next)).toEqual({
        "result": 'OK',
        "description": "SMS is sent -- fakeTel",
        "responseCode": "0010000"
    })

    const DB6 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [])
        }
        if (query === otherThis.queryList[1]) {
            return innerFun(false, { insertId: 1 })
        }
        if (query === otherThis.queryList[2]) {
            if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
            return innerFun({ code: "ER_DUP_ENTRY" })
        }
        if (query === otherThis.queryList[3]) {
            if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
            return innerFun(false, [])
        }
        // if (query === otherThis.queryList[4]) {
        //     if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
        //     return innerFun(false, [])
        // }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?',
        'INSERT INTO users () VALUE ()',
        'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
        'DELETE FROM users WHERE user_id = ?',
        // 'SELECT * FROM smscodes WHERE telephone_id = ?'
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB6, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'ERR',
        "description": "This phone number is already registered in the process of registering other requests",
        "responseCode": "0011002"
    })

    const DB7 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {
        if (query === otherThis.queryList[0]) {
            if (isNaN(Number(paramArr[0]))) return innerFun({ code: 'something2' })
            return innerFun(false, [])
        }
        if (query === otherThis.queryList[1]) {
            return innerFun(false, { insertId: 1 })
        }
        if (query === otherThis.queryList[2]) {
            if (isNaN(Number(paramArr[0])) || typeof paramArr[1] !== 'number') return innerFun({ code: 'something3' })
            return innerFun({ code: "someCode" })
        }
        if (query === otherThis.queryList[3]) {
            if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
            return innerFun(false, [])
        }
        // if (query === otherThis.queryList[4]) {
        //     if (typeof paramArr[0] !== 'number') return innerFun({ code: 'something4' })
        //     return innerFun(false, [])
        // }
    }, [
        'SELECT * FROM telephones WHERE telephone_number = ?',
        'INSERT INTO users () VALUE ()',
        'INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)',
        'DELETE FROM users WHERE user_id = ?',
        // 'SELECT * FROM smscodes WHERE telephone_id = ?'
    ])
    expect(handlers.getFunGetSMSCodeForRegistrationByTelephone(smsGenerator, getFunGetResponseJSON, DB7, getFunIfGetCheckGooglePlay)(app('test'))(req, res, next)).toEqual({
        "result": 'ERR',
        "description": "Something went wrong -- ошибка БД INSERT INTO telephones (telephone_number, user_id) VALUES (?, ?)",
        "responseCode": "0001003",
    })
})

// test('getTokens', () => { // это вообще еще не готово и возможно нужно будет все менять.
//     const smsGenerator = () => {
//         return {
//             "result": 'OK',
//             "description": "SMS is sent",
//             "responseCode": "0010000"
//         }
//     }
//     const getFunIfGetCheckGooglePlay = () => () => { }
//     const app = environment => {
//         return {
//             get() {
//                 return environment
//             }
//         }
//     }
//     const req = {
//         body: {
//             telephoneNumber: '79001234567'
//         }
//     }
//     const res = {
//         status(statusNumber) {
//             return this
//         },
//         json(jsonStruct) {
//             return jsonStruct
//         }
//     }
//     const next = {}
//     const DB1 = DB((query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters) => {

//     }, [
//         'SELECT * FROM telephones WHERE telephone_number = ?',
//         'SELECT * FROM smscodes WHERE telephone_id = ? AND smscode_timeLastAttempt > ?',
//         "SELECT o.owner_id AS o_owner_id , o.user_id AS o_user_id, o.comment_ AS o_comment_ , o.time_ AS o_time_, o.delete_ AS o_delete_, u.user_name AS u_user_name, u.comment_ AS u_comment_ , u.time_ AS u_time_, u.delete_ AS u_delete_ FROM owners o INNER JOIN users u ON o.user_id = u.user_id WHERE o.user_id = ?",
//         'INSERT INTO owners (user_id) VALUES (?)',
//     ])
//     expect(handlers.getFunGetTokens(getFunGetResponseJSON, DB1)(app('test'))(req, res, next)).toEqual()
// })
