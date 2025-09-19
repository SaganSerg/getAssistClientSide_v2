const getFunGetResponseJSON = require('../getFunGetResponseJSON')
test('getResponseJSON_0001000', () => {
    let app = { get(env) { return 'test' } }
    let getResponseJSON = getFunGetResponseJSON(app)
    expect(getResponseJSON("0001000")).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL",
        "responseCode": "0001000"
    })
    expect(getResponseJSON("0001000", 'something')).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL -- something",
        "responseCode": "0001000"
    })
    app = { get(env) { return 'development' } }
    getResponseJSON = getFunGetResponseJSON(app)
    expect(getResponseJSON("0001000")).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL",
        "responseCode": "0001000"
    })
    expect(getResponseJSON("0001000", 'something')).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL -- something",
        "responseCode": "0001000"
    })
    app = { get(env) { return 'prod' } } // специально указана кривая строка (не 'production' а 'prod'. Чтобы под него подходили и другие строки)
    getResponseJSON = getFunGetResponseJSON(app)
    expect(getResponseJSON("0001000")).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL",
        "responseCode": "0001000"
    })
    expect(getResponseJSON("0001000", 'something')).toEqual({
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL",
        "responseCode": "0001000"
    })
})