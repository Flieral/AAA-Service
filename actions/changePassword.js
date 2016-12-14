var loginAction     = require ('../logic/account/loginAction')
var attemptChecker  = require ('../logic/account/attemptChecker')
var networkChecker  = require ('../logic/account/networkChecker')
var changePassword  = require ('../logic/account/changePasswordAction')
var suspensionChecker = require ('../logic/account/suspensionChecker')
var configuration = require('../config/configuration.json')

var Input = {
  changePasswordObject: {
    required: true,
    validator: function(param, connection, actionTemplate) {
      if(!param.accountModel.user)
        return ('user' + ' ' + configuration.message.missingKey)
      if(!param.accountModel.password)
        return ('password' + ' ' + configuration.message.missingKey)
      if(!param.accountModel.option)
        return ('option' + ' ' + configuration.message.missingKey)
      if(!param.accountModel.newPassword)
        return ('newPassword' + ' ' + configuration.message.missingKey)
      return true
    },
    formatter: function(param, connection, actionTemplate) {
      return JSON.parse(new Buffer(param, 'base64'))
    }
  }
}

exports.changePassword = {
  name: 'Login',
  description: 'Login process',
  inputs: Input,

  run: function(api, data, next) {
    changePassword.startPasswordChanging(data.params.changePasswordObject.accountModel, function(err, replies) {
        if (err) {
          data.response.error = err.error
          next(err)
        }
        data.response.result = replies
        next()
    })
  }
}
