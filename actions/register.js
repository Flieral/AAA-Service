var registerAction  = require('../logic/account/registerAction')
var userChecker     = require('../logic/account/userChecker')
var payloadChecker  = require('../public/payloadChecker')

exports.register = {
  name: "register",
  description: "Register a User",

  run: function(api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    payloadChecker.startChecking(payload, function(err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      userChecker.startUserChecking(api.redisClient, payload.accountModel, function(err, result) {
        if (err) {
          data.response.error = err.error
          next(err)
        }
        registerAction.register(api.redisClient, payload, function (err, replies) {
          if (err) {
            data.response.error = err.error
            next(err)
          }
          data.response.result = replies
          next()
        })
      })
    })
  }
}
