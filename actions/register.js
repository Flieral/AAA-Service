var registerAction = require('../logic/account/registerAction')
var userChecker = require('../logic/account/userChecker')

exports.register = {
  name: "register",
  description: "Register a User",

  run: function (api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    userChecker.startUserChecking(api.redisClient, payload.accountModel, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      } else {
        registerAction.register(api.redisClient, payload, function (err, replies) {
          if (err) {
            data.response.error = err.error
            next(err)
          } else {
            data.response.result = replies
            next()
          }
        })
      }
    })
  }
}