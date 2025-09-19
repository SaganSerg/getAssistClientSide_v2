const db = require('./db')
const { SmsAero } = require('smsaero') // для этого нужно npm i axios
const getFunGetResponseJSON = require('./getFunGetResponseJSON')()
const dataForAPInode = require('./dataForAPInode')

const {
    loginForSMS,
    keyForSMS,
    deleteSmsTime,
    smsCodeNumberOfCharacters
} = require('./../config')

const smsCodeFun = (smsCodeNumberOfCharacters) => {
    let smsCode = ''
    for (let i = 1; i <= smsCodeNumberOfCharacters; i++) {
        smsCode += String(Math.floor(Math.random() * 9))
    }
    return smsCode
}
const getInsertSmscodes = (db, SmsAero, telephoneId) => {
    return (err, insertSmscodesRows) => {
        /* проверка err?.code === "ER_DUP_ENTRY" нужна для того, чтобы исключить создание мусорных user-ов, в случае, когда во время одного запроса к БД, другой запрос успел создать учетную записи. Такое возможно в асинхронном коде  */
        const getResponseJSON = getFunGetResponseJSON(app)
        if (err?.code === "ER_DUP_ENTRY") return res.status(200).json(getResponseJSON("0011001"))
        if (err) return res.status(200).json(getResponseJSON("0001003"))
        setTimeout((telephoneId) => {
            return db.run("DELETE FROM smscodes WHERE telephone_id = ?", [telephoneId])
        }, deleteSmsTime, telephoneId)
        const client = new SmsAero(loginForSMS, keyForSMS)
        return client.send(telephoneNumber, `GETaxle. Код для регистрации ${smsCode}`)
            .then(response => {
                res.status(200).json(getResponseJSON("0010000"))
            })
            .catch(error => {
                res.status(200).json(getResponseJSON("0011000"))
            })
    }
}
const insertSmsCodes = getInsertSmscodes(db, SmsAero)
const getGenerator = (db, insertSmsCodes) => {
    return (req, res, next, telephoneId, telephoneNumber, app) => {
        const addTextComment = getFunAddTextComment(app)
        const telephoneSerialNumber = req.body?.serialNumberOfPhone ?? 'unknown'
        const smsCode = smsCodeFun(smsCodeNumberOfCharacters)
        return db.run('INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)', [smsCode, telephoneSerialNumber, telephoneId], insertSmsCodes)
    }
}

exports.generator = getGenerator(db, insertSmsCodes) // это рабочий

exports.getGenerator = getGenerator // это для тестирования
exports.smsCodeFun = smsCodeFun // это для тестирования
exports.getInsertSmscodes = getInsertSmscodes // это для тестирования



