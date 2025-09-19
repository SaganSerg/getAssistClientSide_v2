const db = require('./db')
const { SmsAero } = require('smsaero') // для этого нужно npm i axios
const getFunGetResponseJSON = require('./getFunGetResponseJSON')

const {
    loginForSMS,
    keyForSMS,
    deleteSmsTime,
    smsCodeNumberOfCharacters
} = require('./../config')

const getSmsCode = (smsCodeNumberOfCharacters) => {
    let smsCode = ''
    for (let i = 1; i <= smsCodeNumberOfCharacters; i++) {
        smsCode += String(Math.floor(Math.random() * 9))
    }
    return smsCode
}


const getGenerator = (db, SmsAero, getFunGetResponseJSON, setTimeout) => {
    return (req, res, next, telephoneId, telephoneNumber, app) => { // должна вернуть json
        const getResponseJSON = getFunGetResponseJSON(app)
        const telephoneSerialNumber = req.body?.serialNumberOfPhone ?? 'unknown'
        const smsCode = getSmsCode(smsCodeNumberOfCharacters)
        return db.run('INSERT INTO smscodes (smscode_value, smscode_telephoneSerialNumber, telephone_id) VALUE (?, ?, ?)', [smsCode, telephoneSerialNumber, telephoneId], (err, insertSmscodesRows) => {
            /* проверка err?.code === "ER_DUP_ENTRY" нужна для того, чтобы исключить создание мусорных user-ов, в случае, когда во время одного запроса к БД, другой запрос успел создать учетную записи. Такое возможно в асинхронном коде  */
            if (err?.code === "ER_DUP_ENTRY") {
                return res.status(200).json(getResponseJSON("0011001"))
            }
            if (err) {
                return res.status(200).json(getResponseJSON("0001003"))
            }
            setTimeout((telephoneId) => {
                return db.run("DELETE FROM smscodes WHERE telephone_id = ?", [telephoneId])
            }, deleteSmsTime, telephoneId)
            const client = new SmsAero(loginForSMS, keyForSMS)
            return client.send(telephoneNumber, `GETaxle. Код для регистрации ${smsCode}`)
                .then(response => {
                    return res.status(200).json(getResponseJSON("0010000"))
                })
                .catch(error => {
                    return res.status(400).json(getResponseJSON("0011000"))
                })
        })
    }
}

exports.getSmsCode = getSmsCode // for testing
exports.getGenerator = getGenerator // for testing функция которая возращает функция которая возращает json


exports.generator = getGenerator(db, SmsAero, getFunGetResponseJSON, setTimeout)

