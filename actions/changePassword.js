var loginAction = require ('../logic/account/loginAction.js')
var suspensionChecker = require ('../logic/account/suspensionChecker.js')
var attemptChecker = require ('../logic/account/attemptChecker.js')
var networkChecker = require ('../logic/account/networkChecker.js')
var changePassword = require ('../logic/account/passwordChange.js')

var Input: {
  changePasswordObject: {
    required: true,
    validator: function(param, connection, actionTemplate) {
      if(!param.accountModel.user)
        return 'email key missing'
      if(!param.accountModel.password)
        return 'password is missing'
      if(!param.accountModel.option)
        return 'option is missing'
      if(!param.accountModel.newPassword)
        return 'new password is missing'
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
  inputs: Input

  run: function(api, data, next)
  {
    changePassword.startPasswordChanging(data.params.accountModel, function(err, replies) {
        if (err) {
          data.response.error = error.error
          next(error)
        }
        data.response.result = replies
    })
  }
