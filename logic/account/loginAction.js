var configuration = require('../../config/configuration.json')
var utility       = require('../../public/utility')
var userChecker   = require('./userChecker')
var attemptChecker= require('./attemptChecker')

module.exports = {
  login: function(redisClient, loginObject, callback) {
    if (loginObject.accountModel.option === 'email')
    this.loginByEmail(redisClient, loginObject.accountModel.user, loginObject.accountModel.password, function(err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.login.successful)
    })
    else if (loginObject.accountModel.option === 'username')
    this.loginByUsername(redisClient, loginObject.accountModel.user, loginObject.accountModel.password, function(err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.login.successful)
    })
  },

  loginByUsername: function(redisClient, username, password, callback) {
    userChecker.getAccountIdentifierByUsername(redisClient, username, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === 'null')
      callback(new Error(configuration.message.account.notExist), null)
      this.passwordCheck(redisClient, replies, password, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, result)
      })
    })
  },

  loginByEmail: function(redisClient, email, password, callback) {
    userChecker.getAccountIdentifierByEmail(redisClient, email, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === 'null')
      callback(new Error(configuration.message.account.notExist), null)
      this.passwordCheck(redisClient, replies, password, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, result)
      })
    })
  },

  passwordCheck: function(redisClient, accountHashID, password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === password)
      callback(null, configuration.message.password.right)
      else
      attemptChecker.incrementAccountAttempt(redisClient, accountHashID, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, configuration.message.account.attempt)
      })
    })
  }
}
