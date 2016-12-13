var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../../public/utility')
var userChecker   = require('../logic/account/userChecker')
var attemptChecker= require('./attemptChecker')

module.exports = {
  login: function(loginObject, callback) {
    if (loginObject.accountModel.option === 'email')
    this.loginByEmail(loginObject.accountModel.user, loginObject.accountModel.password, function(err, replies) {
      if (err)
      callback(err, null)
      callback(null, replies)
    })
    else if (loginObject.accountModel.option === 'username')
    this.loginByUsername(loginObject.accountModel.user, loginObject.accountModel.password, function(err, replies) {
      if (err)
      callback(err, null)
      callback(null, replies)
    })
  },

  loginByUsername: function(username, password, callback) {
    userChecker.getAccountIdentifierByUsername(username, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === 'null')
      callback(new Error(configuration.message.user.notExistUser), null)
      this.passwordCheck(replies, password, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, result)
      })
    })
  },

  loginByEmail: function(email, password, callback) {
    userChecker.getAccountIdentifierByEmail(email, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === 'null')
      callback(new Error(configuration.message.user.notExistUser), null)
      this.passwordCheck(replies, password, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, result)
      })
    })
  },

  passwordCheck: function(accountHashID, password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === password)
      callback(null, configuration.message.login.successfulLogin)
      else
      attemptChecker.incrementUserAttempt(accountHashID, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, replies)
      })
    }
  }
}
