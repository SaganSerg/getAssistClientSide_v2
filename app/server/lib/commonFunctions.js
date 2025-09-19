const db = require('./db')

const getFunIfGetCheckGooglePlay = db => {
  return () => {
    db.run(
      'INSERT INTO checkGoogleCome () VALUE ()',
      [],
      err => err ? false : true // данная функция сделана исключительно для проведение тестирования
    )
  }
}
exports.ifGetCheckGooglePlay = getFunIfGetCheckGooglePlay(db)
exports.getFunIfGetCheckGooglePlay = getFunIfGetCheckGooglePlay