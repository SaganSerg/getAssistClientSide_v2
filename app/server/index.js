const
  express = require('express'),
  expressHandlebars = require('express-handlebars'),
  crypto = require('crypto'),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'),
  morgan = require('morgan'),
  fs = require('fs'),
  cluster = require('cluster'),
  { SmsAero, SmsAeroError, SmsAeroHTTPError } = require('smsaero'), // для этого нужно npm i axios
  path = require('node:path'),

  db = require('./lib/db'),
  getFunGetResponseJSON = require('./lib/getFunGetResponseJSON'),
  handlers = require('./lib/handlers')

const app = express()
app.use(express.static(__dirname + '/public'))

switch (app.get('env')) {
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'test':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    const stream = fs.createWriteStream(__dirname + '/access.log',
      { flags: 'a' })
    app.use(morgan('combined', { stream }))
    break
}
const expressHandlebarObj = expressHandlebars.create({
  defaultLayout: 'main'
})
app.use(express.json())

app.engine('handlebars', expressHandlebarObj.engine)

app.set('view engine', 'handlebars')

app.use((req, res, next) => {
  if (cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} received request`)
  next()
})

app.use(bodyParser.urlencoded({ extended: true }))


// запросы /confident /deleteAccount нужны только для того, чтобы пройти проверку google-ом 
app.get('/confident', (req, res, next) => {
  res.render('confident', { layout: null })
})
app.get('/deleteAccount', (req, res, next) => {
  res.render('deleteAccount', { layout: 'deleteAccount', message: null })
})
app.post('/deleteAccount', (req, res, next) => {
  const tel = req.body?.tel
  let message = ''
  if (tel?.length !== 11) message += 'В номере телефона должно быть 11 символов. Включая код страны и код оператора<br>'
  if (isNaN(Number(tel))) message += 'В номере телефона не все символы цифры<br>'
  if (message) return res.render('deleteAccount', { layout: 'deleteAccount', message })
  db.run('SELECT * FROM telephones WHERE telephone_number = ? AND delete_ = 0', [tel], (err, selectTelephonesRows) => {
    if (err) return res.render('deleteAccount', { layout: 'deleteAccount', message: "Что-то пошло не так!1" })
    if (!selectTelephonesRows.length) return res.render('deleteAccount', { layout: 'deleteAccount', message: `Учетной записи, ассоциированной с телефонным номером ${tel}, не обнаружено.` })
    db.run('UPDATE users SET delete_ = 1 WHERE user_id = ?', [selectTelephonesRows[0]['user_id']], (err, updateUsersRows) => {
      if (err) return res.render('deleteAccount', { layout: 'deleteAccount', message: "Что-то пошло не так!2" })
      db.run('UPDATE telephones SET delete_ = 1 WHERE user_id = ?', [selectTelephonesRows[0]['user_id']], (err, updateTelephonesRows) => {
        if (err) return res.render('deleteAccount', { layout: 'deleteAccount', message: "Что-то пошло не так!3" })
        db.run('UPDATE owners SET delete_ = 1 WHERE user_id = ?', [selectTelephonesRows[0]['user_id']], (err, updateOwnersRows) => {
          if (err) return res.render('deleteAccount', { layout: 'deleteAccount', message: "Что-то пошло не так!4" })
          return res.render('deleteAccount', { layout: 'deleteAccount', message: `Учетная запись, ассоциированная с телефонным номером ${tel}, удалена!.` })
        })
      })
    })
  })
})

// это действительно нужные запросы
app.post('/api/getSMSCodeForRegistrationByTelephone', handlers.getSMSCodeFun(app))
app.post('/api/getTokens', handlers.getTokens(app))








app.get('/getAPI', (req, res, next) => {
  res.render('getAPI', {
    layout: 'getAPI',
  })
})
app.get('/testform', (req, res, next) => res.render('testform'))
app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not Found')
})
// custom 500 page
app.use((err, req, res, next) => {
  res.type('text/plain')
  res.status(500)
  res.send('500 - Server Error')
})
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION\n', err.stack);
  // сюда нужно вставить действия которые нужно закончить до того, как сервер ляжет
  process.exit(1)
})
if (require.main === module) {
  (port => app.listen(port, '127.0.0.1', () => console.log(`Express started on ${port} port ${app.get('env')} press Ctrl-C to terminate.`)))(process.env.PORT || 3000)
} else {
  module.exports = startServer
}

