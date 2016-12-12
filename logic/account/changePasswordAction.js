var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var userChecker = require('./userChcker')
module.exports = {
  startPasswordChanging: function(accountModelObject, callback) {
    var accountHashID
    if (accountModelObject.option === 'username')
    {
      userChecker.checkUserExistenceByUsername(accountModel.user, function (err, replies) {
        if (err)
          callback(err, null)
        accountHashID = replies
      }
    }
    else if (accountModelObject.option === 'email')
    {
      userChecker.checkUserExistenceByEmail(accountModel.user, function (err, replies) {
        if (err)
          callback(err, null)
        accountHashID = replies
      }
    }
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies === accountModelObject.password)
        passwordChange(accountHashID, accountModelObject.newPassword, function(err, callback) {
          if (err)
            callback(err, null)
          callback(null, 'password succesfully changed message')
      })
    }
  }
  passwordChange: function(accountHashID, Password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hset(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
        callback(err, null)
    })
  }
}
