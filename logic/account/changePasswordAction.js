var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')

module.exports = {
  changePasswordByUsername: function(username, password, callback) {
    var userTable = configuration.TableMSAccountModelUsername + username
		redisClient.get(userTable, function (err, replies) {
    	if (err)
				callback(err, null)
      if (replies === 'null')
        callback(null, configuration.message.login.notExistsUser)
      else
        this.passwordChange(replies, oldPassword, newPassword,function(err, replies) {
          if (err)
            callback(err, null)
          callback(null, replies)
        })
		})
  },

  changePasswordByEmail: function(email, password, callback) {
    var emailTable = configuration.TableMSAccountModelEmail + email
		redisClient.get(emailTable, function (err, replies) {
    	if (err)
				callback(err, null)
			if (replies === 'null')
        callback(null, configuration.message.login.notExistsUser)
      else
        this.passwordChange(replies, oldPassword, newPassword,function(err, replies) {
          if (err)
            callback(err, null)
          callback(null, replies)
        })
		})
  },

  passwordChange: function(accountHashID, oldPassword, newPassword, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMPassword, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies === oldPassword)
      {
        redisClient.hset(modelTable, configuration.ConstantAMPassword, function(err, replies) {
          if (err)
            callback(err, null)
          callback(null, configuration.message.changePassword.successfulChange)
        })
      }
      else
        callback(null, configuration.message.changePassword.successfulChange)
    }
  },
}
