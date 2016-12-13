var loginAction       = require ('../logic/account/loginAction')
var suspensionChecker = require ('../logic/account/suspensionChecker')
var attemptChecker    = require ('../logic/account/attemptChecker')
var networkChecker    = require ('../logic/account/networkChecker')
var sessionManager    = require ('../logic/account/sessionManager')

var Input: {
  loginObject: {
    required: true,
    validator: function(param, connection, actionTemplate) {
      if(!param.accountModel.user)
        return ('email' + configuration.message.missingKey)
      else if(!param.accountModel.password)
        return ('password' + configuration.message.missingKey)
      else if(!param.accountModel.option)
        return ('option' + configuration.message.missingKey)
      else if(!param.ipAddress)
        return ('ipAddress' + configuration.message.missingKey)
      else if(!param.networkModel.isp)
        return ('isp' + configuration.message.missingKey)
      else if(!param.networkModel.agent)
        return ('agent' + configuration.message.missingKey)
      else if(!param.networkModel.country)
        return ('country' + configuration.message.missingKey)
      else if(!param.networkModel.macAddress)
        return ('macAddress' + configuration.message.missingKey)
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
  inputs: Input

  run: function(api, data, next)
  {
    var accountHashID
    loginAction.login(data.params.loginObject.accountModel, function(error, replies){
      if(error){
        data.response.error = error.error
        next(error)
      }
      accountHashID = replies
      suspentionChecker.checkAccountSuspension(accountHashID, function(error, replies) {
        if(error) {
          data.response.error = error.error
          next(error)
        }
        attemptChecker.checkUserBlack(accountHashID, function(error, replies) {
          if(error) {
            data.response.error = error.error
            next(error)
          }
          networkChecker.startNetworkChecking(accountHashID, data.params.loginObject.ipAddress, data.params.loginObject.networkModel, function(error, replies) {
            if(error) {
              data.response.error = error.error
              next(error)
            }
            sessionManager.renewSessionForAccount(accountHashID, function(error, replies) {
              if(error) {
                data.response.error = error.error
                next(error)
              }
              data.response.result = replies
              next()
            }
          }
        })
      })
    })
  }
}