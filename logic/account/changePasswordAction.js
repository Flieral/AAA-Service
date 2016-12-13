var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var userChecker = require('./userChcker')

module.exports = {
  startPasswordChanging: function(accountModelObject, callback) {
    var accountHashID
    if (accountModelObject.option === 'username')
    {
      userChecker.getAccountIdentifierByUsername(accountModel.user, function (err, replies) {
        if (err)
        callback(err, null)
        accountHashID = replies
      }
    }
    else if (accountModelObject.option === 'email')
    {
      userChecker.getAccountIdentifierByEmail(accountModel.user, function (err, replies) {
        if (err)
        callback(err, null)
        accountHashID = replies
      }
    }

    this.checkPassword(accountHashID, accountModelObject.password, function(err, replies) {
      if (err)
      callback(err, null)
      passwordChange(accountHashID, accountModelObject.newPassword, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, configuration.message.changePassword.successful)
      })
    })
  },

  passwordCheck: function(accountHashID, password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === password)
      callback(null, configuration.message.changePassword.equalPassword)
      else
      attemptChecker.incrementUserAttempt(accountHashID, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, configuration.message.changePassword.wrongPassword)
      })
    }
  },

  passwordChange: function(accountHashID, Password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hset(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
      callback(err, null)
    })
  }
}
