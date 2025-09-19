const dataForAPI = require('./dataForAPInode')
const deleteDiscriptionRus = response => {
    delete response.discriptionRus
    return response
}
const getFunGetResponseJSON = (app) => {
    return function (responseCode, comment) {
        if (!comment) comment = ''
        if (typeof comment !== 'string') throw new Error('comment should be string')
        let putComment = response => {
            let com = ((app, text) => {
                const env = app.get('env')
                if (text && (env === 'test' || env === 'development')) {
                    return ` -- ${text}`
                }
                return ''
            })(app, comment)
            response.description = `${response.description}${com}`
            return response
        }

        let getResponseObj = (obj) => {
            return JSON.parse(JSON.stringify(obj))
        }
        if (!responseCode || (typeof responseCode !== 'string')) {
            throw new Error('responseCode should be and should be string')
        }
        for (let elem of dataForAPI.responses) {
            if (elem.responseCode === responseCode) {
                let ret = deleteDiscriptionRus(putComment(getResponseObj(elem)))
                return ret
            }
        }
    }
}
module.exports = getFunGetResponseJSON