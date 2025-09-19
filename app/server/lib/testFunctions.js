const {
    smsCodeNumberOfCharacters
} = require('./../config')
function DB(fun, queryList) {
    let db = Object.create(DB.properties)
    db.fun = fun
    db.queryList = queryList
    return db
}
DB.properties = {
    counterDB: 0,
    run: function (query, paramArr, fun) {
        this.counterDB++
        const innerFun = function (err, rows, fields) {
            if (typeof fun === 'function') return fun(err, rows)
        }
        const otherThis = this
        const connection = {
            otherThis,
            query(query, paramArr, innerFun) {
                if (typeof query !== 'string' || typeof paramArr !== 'object' || paramArr.length === undefined || typeof innerFun !== 'function' || !otherThis.queryList.find(x => x === query)) return innerFun({ code: 'something1' })
                return otherThis.fun(query, paramArr, innerFun, otherThis, smsCodeNumberOfCharacters)
            }
        }
        return connection.query(query, paramArr, innerFun) // здесь дожне быть json
    }
}

exports.DB = DB