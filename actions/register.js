var registerAction  = require('../logic/account/registerAction')
var userChecker     = require('../logic/account/userChecker')
var payloadChecker  = require('../public/payloadChecker')

exports.register = {
  name: "register",
  description: "Register a User",

  run: function(api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    payloadChecker.startChecking(payload, function(error, result) {
      if (error) {
        data.response.error = error.error
        next(error)
      }
      userChecker.startUserChecking(payload.accountModel, function(error, result) {
        if (error) {
          data.response.error = error.error
          next(error)
        }
        registerAction.register(payload, function (error, replies) {
          if (error) {
            data.response.error = error.error
            next(error)
          }
          data.response.result = replies
          next()
        })
      })
    })
  }
}
