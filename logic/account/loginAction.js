var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../utility')

module.exports = {
  loginByUsername: function(username, password, callback) {
    var userTable = configuration.TableMSAccountModelUsername + username
		redisClient.get(userTable, function (err, replies) {
    	if (err)
				callback(err, null)
      if (replies === 'null')
        callback(null, configuration.message.login.notExistsUser)
      else
        this.passwordCheck(replies, password, function(err, replies) {
          if (err)
            callback(err, null)
          callback(null, replies)
        })
		})
  },

  loginByEmail: function(email, password, callback) {
    var emailTable = configuration.TableMSAccountModelEmail + email
		redisClient.get(emailTable, function (err, replies) {
    	if (err)
				callback(err, null)
			if (replies === 'null')
        callback(null, configuration.message.login.notExistsUser)
      else
        this.passwordCheck(replies, password, function(err, replies) {
          if (err)
            callback(err, null)
          callback(null, replies)
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
        callback(null, configuration.message.login.failedLogin)
    }
  },

  renewSessionForAccount: function(accountHashID, callback) {
    var sessionTable = configuration.TableMAAccountModelUserToken + accountHashID
    var sessionHashID = utility.generateUniqueHashID()
    redisClient.set(sessionTable, sessionHashID, 'EX', configuration.MaximumSessionLength, 'NX', function(err, replies) {
      if (err)
        callback(err, null)
      callback(null, configuration.message.login.renewSession)
    }
  }
}
