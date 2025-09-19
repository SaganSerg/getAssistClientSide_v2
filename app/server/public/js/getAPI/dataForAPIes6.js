const universalResponses = {
    "result": 'ERR',
    "description": "Something went wrong",
    "responseCode": "0001003",
    "discriptionRus": "Что-то пошло не так"
}
const responses = [
    {
        "result": 'ERR',
        "description": "the request requestJSON structure does not match URL",
        "responseCode": "0001000",
        "discriptionRus": "Структура requestJSON ответа не соответсвует url-у. Т.е. по данному url-у сервер ждет определенный данные в requestJSON, но этих данных в данном requestJSON нет!"
    },
    {
        "result": 'ERR',
        "description": "Token is wrong",
        "responseCode": "0001001",
        "discriptionRus": "Токен ошибочный, либо просроченный."
    },
    {
        "result": 'ERR',
        "description": "TelephoneNumber is not format",
        "responseCode": "0001002",
        "discriptionRus": "Номер телефона не соответсует формату: или слошком длинный, или слишком короткий, или содержит не только цифры"
    },
    universalResponses,
    {
        "result": 'ERR',
        "description": "The account associated with this phone number is marked for deletion.",
        "responseCode": "0001004",
        "discriptionRus": "Аккаунт, ассоциированный с таким номером телефона, помечен на удаление"
    },
    {
        "result": 'OK',
        "description": "SMS is sent",
        "responseCode": "0010000",
        "discriptionRus": "СМС-ка отправлена"
    },
    {
        "result": 'ERR',
        "description": "SMS in not sent. Something went wrong",
        "responseCode": "0011000",
        "discriptionRus": "СМС-ка не отправлена. Что-то пошло не так. Скорее всего проблема у сервиса отправки СМС"
    },
    {
        "result": 'ERR',
        "description": "For this telephone number the SMS request has already been made",
        "responseCode": "0011001",
        "smsTimeout": '0',
        "discriptionRus": "Для данного телефона смс-ка уже отправлена. Скорее всего --- это означает, что не прошел еще временной период в течении которого смс-ку отправлять нельзя"
    },
    {
        "result": 'ERR',
        "description": "This phone number is already registered in the process of registering other requests",
        "responseCode": "0011002",
        "discriptionRus": "Такой номер телефона уже зарегистрирован в рамках другого процесса регистрации. Такое возможно из-за многопоточности"
    },

    {
        "result": 'OK',
        "description": "Owner is registered by telephone",
        "responseCode": "0020000",
        "accessToken": "",
        "refreshToken": "",
        "ownerId": '0',
        "userId": '0',
        "connectedUserAgent": [
            {
                "connectedId": '0',
                "connectedUserAgentName": ""
            }
        ],
        "discriptionRus": "Хозяин зарегестрирован по номеру телефона"
    },
    {
        "result": 'ERR',
        "description": "telephoneNumber is not registration",
        "responseCode": "0021000",
        "discriptionRus": "Если номер телефона не был зарегестрирован в базе. Это значит, что в данном запросе был указан невереный телефон"
    },
    {
        "result": 'ERR',
        "description": "SMS code is wrong",
        "responseCode": "0021001",
        "discriptionRus": "Это значит код не соответсует коду, который был напрален",
    },
    {
        "result": 'ERR',
        "description": "Username is too long",
        "responseCode": "0021002",
        "discriptionRus": "Пришло слишком длинное имя пользователя"
    },
    {
        "result": 'ERR',
        "description": "the owner was already registered",
        "responseCode": "0021003",
        "discriptionRus": "Для данного номера телефона уже был зарегестрировать хозяин"
    },


    {
        "result": "OK",
        "description": "Token is try",
        "responseCode": "0030000",
        "discriptionRus": "Токен верный",
        "tokenExpireDate": "0 -- временная метка в секундах"
    },
    {
        "result": "ERR",
        "description": "The account associated with this token has been marked for deletion.",
        "responseCode": "0031000",
        "discriptionRus": "Аккаунт, ассоциированный с данным токеном, помечен на удаление"
    },
     
    {
        "result": "ERR",
        "description": "Token expired",
        "responseCode": "0031001",
        "discriptionRus": "Срок действия токена истек",
        "tokenExpireDate": "0 -- временная метка в секундах"
    },
    {
        "result": "ERR",
        "description": "The account associated with this token is not in the database.",
        "responseCode": "0031002",
        "discriptionRus": "Аккаунта, ассоциированного с данным токеном нет в базе"
    },


    {
        "result": 'OK',
        "description": "Tokens are get",
        "responseCode": "0040000",
        "accessToken": "",
        "refreshToken": "",
        "ownerId": '0',
        "userId": '0',
        "connectedUserAgent": [
            {
                "connectedId": '0',
                "connectedUserAgentName": ""
            }
        ],
        "status": "",
        "userName": "",
        "discriptionRus": "Токен передан"

    },
    {
        "result": 'ERR',
        "description": "telephoneNumber is not registration",
        "responseCode": "0041000",
        "discriptionRus": "Телефонный номер не зарегистрирован. Это значит, что в данном запросе был указан невереный телефон"
    },
    {
        "result": 'ERR',
        "description": "SMS code is wrong",
        "responseCode": "0041001",
        "discriptionRus": "СМС-код неправильный"
    },
    {
        "result": 'ERR',
        "description": "Username is too long",
        "responseCode": "0041002",
        "discriptionRus": "Имя пользователя слишком длинное"
    },
    {
        "result": 'ERR',
        "description": "the owner was already registered",
        "responseCode": "0041003",
        "discriptionRus": "Пользователь был уже зарегестрирован. Такое может быть из-за многопоточности"
    },
    {
        "result": 'ERR',
        "description": "The account associated with this token has been marked for deletion.",
        "responseCode": "0041004",
        "discriptionRus": "Токен не отправлен. Потому что аккант помечен на удаление."
    },
    {
        "result": 'OK',
        "description": "The legality of the device has been confirmed. Data has been transferred.",
        "responseCode": "0050000",
        "discriptionRus": "Легальность устройства поддтерждена. Данные переданы.",
        "data": {
            "id": '0',
            "bar": '',
            "qr": '',
            "type": '',
            "role": '',
            "mac": '',
            "prodtime": '',
            "fwversion": ''
        }
    },
    {
        "result": 'ERR',
        "description": "The device with this QR code is not registered",
        "responseCode": "0051000",
        "discriptionRus": "Устройство с таким qr-кодом не зарегестрировано"
    },
    {
        "result": 'ERR',
        "description": "Not all data is available in the database for this device.",
        "responseCode": "0051001",
        "discriptionRus": "Для данного устройства в базе присутствуют не все данные"
    },
    {
        "result": 'OK',
        "description": "Email sent",
        "responseCode": "0060000",
        "discriptionRus": "Письмо на электронную почту отправлено"
    },
    {
        "result": 'ERR',
        "description": "Email address is missing from message",
        "responseCode": "0061000",
        "discriptionRus": "Адрес электронной почты отсутствует в сообщении"
    },
    {
        "result": 'ERR',
        "description": "The email address contains more than 50 characters. This is too long.",
        "responseCode": "0061001",
        "discriptionRus": "Адрес электронной почты содержить более 50 симоволов. Это слишком длинный адрес"
    },
    {
        "result": 'ERR',
        "description": "The email address does not look like an email address",
        "responseCode": "0061002",
        "discriptionRus": "Электронный адрес не похож на электронный адрес"
    },
    {
        "result": 'ERR',
        "description": "This email address has already been registered as part of another registration process. This is possible due to multithreading",
        "responseCode": "0061003",
        "discriptionRus": "Такой адрес электронной почты уже зарегистрирован в рамках другого процесса регистрации. Такое возможно из-за многопоточности"
    },
    {
        "result": 'ERR',
        "description": "The code has already been sent for this email address. Most likely --- this means that the time period during which the letter cannot be sent has not yet passed",
        "responseCode": "0061004",
        "discriptionRus": "Для данного электронного адреса код уже отправлена. Скорее всего --- это означает, что не прошел еще временной период в течении которого письмо отправлять нельзя"
    },
    {
        "result": 'ERR',
        "description": "The letter with the code could not be sent",
        "responseCode": "0061005",
        "discriptionRus": "Письмо с кодом не получилось отправить"
    },




    // это не завершено
    {
        "result": 'ERR',
        "description": "The request is missing either an email address or a code",
        "responseCode": "0071000",
        "discriptionRus": "В запросе отсутствует либо электронный адрес, либо код"
    },
    {
        "result": 'ERR',
        "description": "The number of characters in the code is not equal to the required number",
        "responseCode": "0071001",
        "discriptionRus": "Количество символов в коде не равно требуемому"
    },
    {
        "result": 'ERR',
        "description": "The code contains more than just numbers. It should contain only numbers.",
        "responseCode": "0071002",
        "discriptionRus": "В коде присутствуют не только цифры. А должны быть только цифры"
    },
    {
        "result": 'ERR',
        "description": "The number of characters in the email address is more than 50",
        "responseCode": "0071003",
        "discriptionRus": "Количество символов в адресе электронной почты больше 50"
    },
    {
        "result": 'ERR',
        "description": "The email address does not look like an email address",
        "responseCode": "0071004",
        "discriptionRus": "Электронный адрес не похож на электронный адрес"
    },
    {
        "result": 'ERR',
        "description": "There is no such email address in the database. This means that the code was sent to another address.",
        "responseCode": "0071005",
        "discriptionRus": "Такого адреса электронной почты в базе нет. Это значит, что код был отправлен на другой адрес"
    },
    {
        "result": 'ERR',
        "description": "There is no registration code for this email address, or the code has expired.",
        "responseCode": "0071006",
        "discriptionRus": "Для данного электронного адреса отсутствует, либо просрочен код для регистрации"
    },


    {
        "result": 'OK',
        "description": "Configuration saved",
        "responseCode": "0080000",
        "discriptionRus": "Конфигурация сохранена"
    },
    {
        "result": 'ERR',
        "description": "Conf parameter is missing value",
        "responseCode": "0081000",
        "discriptionRus": "В параметре conf отсутствует значение"
    },
    {
        "result": 'ERR',
        "description": "The conf parameter does not contain JSON",
        "responseCode": "0081001",
        "discriptionRus": "В параметре conf содержиться не JSON"
    },


    {
        "result": 'OK',
        "description": "Configuration transferred",
        "responseCode": "0090000",
        "discriptionRus": "Конфигурация передана",
        "configuration": 'JSON structure',
        "configurationTimeMark": '0',
    },
    {
        "result": 'ERR',
        "description": "No configuration was saved for this user.",
        "responseCode": "0091000",
        "discriptionRus": "Для данного пользователя никакая конфигурация не сохранялась",
    },

     {
        "result": 'OK',
        "description": "Configuration deleted",
        "responseCode": "0100000",
        "discriptionRus": "Конфигурация удалена",
    },
    {
        "result": 'ERR',
        "description": "There was no configuration in the database",
        "responseCode": "0101000",
        "discriptionRus": "Конфигурации в базе не было",
    },
    {
        "result": 'OK',
        "description": "New access token are get",
        "responseCode": "0110000",
        "discriptionRus": "Новый access token передан",
        "accessToken": ''
    },
    {
        "result": 'ERR',
        "description": "There is no user associated with this token in the database.",
        "responseCode": "0111000",
        "discriptionRus": "Пользователя ассициированного с данным токеном в базе нет",
    },
    {
        "result": 'ERR',
        "description": "There is no user associated with this token in the database.",
        "responseCode": "0111001",
        "discriptionRus": "Пользователь ассициированный с данным токеном помечен на удаление",
    },
    {
        "result": 'ERR',
        "description": "Refresh token expired",
        "responseCode": "0111002",
        "discriptionRus": "Срок действия refresh token истек",
        "tokenExpireDate": "0 -- временная метка в секундах"
    }
];

const commonTroubles = [

    `Если server не работает совсем, то не будет отправлено ничего и нужно будет поставить срок ожидания после которого что-то показать пользователю`,


    `Если server возвратить код ответа начинающийся на 5. Это значит проблемы на сервере. Нужно что-то показать пользователю`,


    `Если server возвратит код ответа 400. Это значит что что в запросе не так. Нужно что-то показать пользователю.`,


    `Если server возвратит код ответа 401. Это значит что пользователь в системе не зарегестрирован. Нужно что-то показать пользователю.`,


    `Если server возвратит код ответа 403. Это значит пользователь системе известен, но не аутентифицирован. Нужно что-то показть пользователю.`,


    `Если server возращает код ответа 404. Это значит что под данному url-у ничего нет. Нужно что-то показать пользователю.`,


    `Если server возвращее код начинающийся с 4. Это значит, что что-то в запросе не так. Нужно что-то показать пользователю.`

];

const userAgentHeader = { name: 'User-Agent', valueDescription: `Название клиента, длиной до 100 символов`, ofObligation: false };

const requests = [
    {
        title: 'Запрос СМС для верификации по телефону',
        method: 'POST',
        uri: '/api/getSMSСodeForRegistrationByTelephone',
        getParameters: [
            { name: 'someParameter', valueDescription: 'какое-то описание' }, // потом удалить
            { name: 'otherSomeParameter', valueDescription: 'какое-то описание' } // потом удалить
        ],
        body: {
            requestJSON: [
                { name: `telephoneNumber`, valueDescription: 'символы цифр в количестве от 11 до 18 включительно', ofObligation: true },
                { name: `serialNumberOfPhone`, valueDescription: 'строка длинной не более 25 символов', ofObligation: false }
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '001'
    },
    {
        title: 'Регистрация хозяина (делает хозяин) по телефону. ИСПОЛЬЗОВАТЬСЯ НЕ БУДЕТ',
        method: 'POST',
        uri: '/api/telephoneOwnerRegistration',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `telephoneNumber`, valueDescription: 'символы цифр в количестве от 11 до 18 включительно', ofObligation: true },
                { name: `smsCode`, valueDescription: 'символы цифр в количестве 5', ofObligation: true },
                { name: `userName`, valueDescription: 'символы в количестве не более 50', ofObligation: false }
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '002'
    },
    {
        title: 'Проверка токена',
        method: 'POST',
        uri: '/api/checkToken',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `accessToken`, valueDescription: 'token --- символы', ofObligation: true }
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '003'
    },
    {
        title: 'Получение  токенов (refreshToken и accessToken)',
        method: 'POST',
        uri: '/api/getTokens',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `telephoneNumber`, valueDescription: 'символы цифр в количестве от 11 до 18 включительно', ofObligation: true },
                { name: `smsCode`, valueDescription: 'символы цифр в количестве 5', ofObligation: true },
                { name: `userName`, valueDescription: 'символы в количестве не более 50', ofObligation: false }
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '004'
    },
    {
        title: 'Проверка легальности устойства. И получение его параметров',
        method: 'POST',
        uri: '/api/checkLegalDevice',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `accessToken`, valueDescription: 'token --- символы', ofObligation: true },
                { name: `deviceQRcode`, valueDescription: 'символы', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '005'
    },
    {
        title: 'Запрос кода авторизации на электронную почту',
        method: 'POST',
        uri: '/api/getCodeForRegistrationByEmail',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `email`, valueDescription: 'количество симоволов ограничено 50', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '006'
    },
    {
        title: 'Получение токенов по коду отправленному на электронную почту',
        method: 'POST',
        uri: '/api/getTokenByEmail',
        getParameters: [],
        body: {
            requestJSON: [ // userName
                { name: `email`, valueDescription: 'количество симоволов ограничено 50', ofObligation: true },
                { name: `сode`, valueDescription: 'количество симоволо равно 5', ofObligation: true },
                { name: `userName`, valueDescription: 'количество симоволов ограничено 50', ofObligation: false },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '007'
    },
    // {
    //     title: 'Регистрация транспортного средства',
    //     method: 'POST',
    //     uri: '/api/vehicleRegistration',
    //     getParameters: [],
    //     body: {
    //         requestJSON: [ // userName
    //             //  { name: `email`, valueDescription: 'количество симоволов ограничено 50', ofObligation: true }, // 
    //         ]
    //     },
    //     headers: [
    //         userAgentHeader
    //     ],
    //     stepNumber: ''
    // },
    {
        title: 'Сохранение конфигурации',
        method: 'POST',
        uri: '/api/setConfig',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `conf`, valueDescription: 'JSON -- символы', ofObligation: true },
                { name: `accessToken`, valueDescription: 'token --- символы', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '008'
    },
    {
        title: 'Получение конфигурации',
        method: 'POST',
        uri: '/api/getConfig',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `accessToken`, valueDescription: 'token --- символы', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '009'
    },
    {
        title: 'Удаление конфигурации',
        method: 'POST',
        uri: '/api/deleteConfig',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `accessToken`, valueDescription: 'token --- символы', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '010'
    },
    {
        title: 'Обновление access token',
        method: 'POST',
        uri: '/api/refreshtoken',
        getParameters: [],
        body: {
            requestJSON: [
                { name: `refreshToken`, valueDescription: 'token --- символы', ofObligation: true },
            ]
        },
        headers: [
            userAgentHeader
        ],
        stepNumber: '011'
    },



];
export  { responses, commonTroubles, requests, universalResponses };

