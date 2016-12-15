var loginAction       = require ('../logic/account/loginAction')
var suspensionChecker = require ('../logic/account/suspensionChecker')
var attemptChecker    = require ('../logic/account/attemptChecker')
var networkChecker    = require ('../logic/account/networkChecker')
var sessionManager    = require ('../logic/account/sessionManager')

var Input = {
  loginObject: {
    required: true,
    validator: function(param, connection, actionTemplate) {
      if(!param.accountModel.user)
        return ('email' + ' ' + configuration.message.missingKey)
      else if(!param.accountModel.password)
        return ('password' + ' ' + configuration.message.missingKey)
      else if(!param.accountModel.option)
        return ('option' + ' ' + configuration.message.missingKey)
      else if(!param.ipAddress)
        return ('ipAddress' + ' ' + configuration.message.missingKey)
      else if(!param.networkModel.isp)
        return ('isp' + ' ' + configuration.message.missingKey)
      else if(!param.networkModel.agent)
        return ('agent' + ' ' + configuration.message.missingKey)
      else if(!param.networkModel.country)
        return ('country' + ' ' + configuration.message.missingKey)
      else if(!param.networkModel.macAddress)
        return ('macAddress' + ' ' + configuration.message.missingKey)
      return true
    },
    formatter: function(param, connection, actionTemplate) {
      return JSON.parse(new Buffer(param, 'base64'))
    }
  }
}

exports.login = {
  name: 'Login',
  description: 'Login process',
  inputs: Input,

  run: function(api, data, next) {
    var accountHashID
    loginAction.login(api.redisClient, data.params.loginObject.accountModel, function(err, replies){
      if(err){
        data.response.error = err.error
        next(err)
      }
      accountHashID = replies
      suspensionChecker.checkAccountSuspension(api.redisClient, accountHashID, function(err, replies) {
        if(err) {
          data.response.error = err.error
          next(err)
        }
        attemptChecker.checkAccountBlock(api.redisClient, accountHashID, function(err, replies) {
          if(err) {
            data.response.error = err.error
            next(err)
          }
          networkChecker.startNetworkChecking(api.redisClient, accountHashID, data.params.loginObject.ipAddress, data.params.loginObject.networkModel, function(err, replies) {
            if(err) {
              data.response.error = err.error
              next(err)
            }
            sessionManager.renewSessionForAccount(api.redisClient, accountHashID, function(err, replies) {
              if(err) {
                data.response.error = err.error
                next(err)
              }
              data.response.result = replies
              next()
            })
          })
        })
      })
    })
  }
}
