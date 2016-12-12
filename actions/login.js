var loginAction = require ('../logic/account/loginAction.js')
var suspensionChecker = require ('../logic/account/suspensionChecker.js')
var attemptChecker = require ('../logic/account/attemptChecker.js')
var networkChecker = require ('../logic/account/networkChecker.js')

var Input: {
  loginObject: {
    required: true,
    validator: function(param, connection, actionTemplate) {
      if(!param.accountModel.user)
        return 'email key missing'
      if(!param.accountModel.password)
        return 'password is missing'
      if(!param.accountModel.option)
        return 'option is missing'
      if(!param.networkModel.isp)
        return 'isp is missing'
      if(!param.networkModel.agent)
        return 'agent is missing'
      if(!param.networkModel.country)
        return'country is missing'
      if(!param.networkModel.macAddress)
        return'macaddress is missing'

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
    loginAction.login(data.params.accountModel, data.params.networkModel, function(error, replies){
      if(error){
        data.response.error = error.error
        next(error)
      }
      accountHashID = replies
      suspentionChecker.checkAccountSuspension(accountHashID, function(error, replies) {
        if(error){
          data.response.error = error.error
          next(error)
        }
        attemptChecker.checkUserBlack(accountHashID, function(error, replies) {
          if(error){
            data.response.error = error.error
            next(error)
          }
          loginAction.renewSessionForAccount(accountHashID, function(error, replies) {
            if(error){
              data.response.error = error.error
              next(error)
            }
            networkChecker.startNetworkChecking(accountHashID, data.params.networkModel, function(error, replies) {
              if(error){
                data.response.error = error.error
                next(error)
              }
              data.response.result = replies
            })
          })
        })
      })
    })

  }
}
