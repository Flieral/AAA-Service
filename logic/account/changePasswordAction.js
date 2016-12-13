var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var userChecker   = require('./userChcker')

module.exports = {
  startPasswordChanging: function(accountModelObject, callback) {
    var accountHashID
    if (accountModelObject.option === 'username') {
      userChecker.getAccountIdentifierByUsername(accountModelObject.user, function (err, replies) {
        if (err)
        callback(err, null)
        accountHashID = replies
        this.checkPassword(accountHashID, accountModelObject.password, function(err, replies) {
          if (err)
          callback(err, null)
          passwordChange(accountHashID, accountModelObject.newPassword, function(err, replies) {
            if (err)
            callback(err, null)
            callback(null, replies)
          })
        })
      }
    }
    else if (accountModelObject.option === 'email') {
      userChecker.getAccountIdentifierByEmail(accountModelObject.user, function (err, replies) {
        if (err)
        callback(err, null)
        accountHashID = replies
        this.checkPassword(accountHashID, accountModelObject.password, function(err, replies) {
          if (err)
          callback(err, null)
          passwordChange(accountHashID, accountModelObject.newPassword, function(err, replies) {
            if (err)
            callback(err, null)
            callback(null, replies)
          })
        })
      }
    }
  },

  passwordCheck: function(accountHashID, password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === password)
      callback(null, configuration.message.password.right)
      else
      attemptChecker.incrementAccountAttempt(accountHashID, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, configuration.message.account.attempt)
      })
    }
  },

  passwordChange: function(accountHashID, Password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hset(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.changePassword.successful)
    })
  }
}
