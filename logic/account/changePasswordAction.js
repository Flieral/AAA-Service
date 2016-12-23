var configuration = require('../../config/configuration.json')
var userChecker = require('./userChecker')

module.exports = {
  startPasswordChanging: function (redisClient, accountModelObject, callback) {
    var accountHashID
    if (accountModelObject.option === 'username') {
      userChecker.getAccountIdentifierByUsername(redisClient, accountModelObject.user, function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        accountHashID = replies
        this.passwordCheck(redisClient, accountHashID, accountModelObject.password, function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          this.passwordChange(redisClient, accountHashID, accountModelObject.newPassword, function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, replies)
          })
        })
      })
    } else if (accountModelObject.option === 'email') {
      userChecker.getAccountIdentifierByEmail(redisClient, accountModelObject.user, function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        accountHashID = replies
        this.passwordCheck(redisClient, accountHashID, accountModelObject.password, function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          this.passwordChange(redisClient, accountHashID, accountModelObject.newPassword, function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, replies)
          })
        })
      })
    }
  },

  passwordCheck: function (redisClient, accountHashID, password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies === password)
        callback(null, configuration.message.password.right)
      else
        attemptChecker.incrementAccountAttempt(redisClient, accountHashID, function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, configuration.message.account.attempt)
        })
    })
  },

  passwordChange: function (redisClient, accountHashID, Password, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hset(modelTable, configuration.ConstantAMPassword, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, configuration.message.changePassword.successful)
    })
  }
}