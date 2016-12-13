var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var sessionManager= require('./sessionManager')

module.exports = {
	incrementUserAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hincrby(modelTable, configuration.ConstantAMAttempt, 1, function(err, replies) {
			if (err)
			callback(err, null)
			this.checkUserAttempt(accountHashID, function(err, replies) {
				if (err)
				callback(err, null)
				callback(null, replies)
			})
		})
	},

	resetUserAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hset(modelTable, configuration.ConstantAMAttempt, 0, function(err, replies) {
			if (err)
			callback(err, null)
		})
	},

	checkUserAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hget(modelTable, configuration.ConstantAMAttempt, function(err, replies) {
			if (err)
			callback(err, null)
			if (replies >= configuration.MaximumUserAttempt) {
				redisClient.set(blackListTable, accountHashID, 'EX', configuration.MaximumblackPeriod, 'NX', function(err, replies) {
					if (err)
					callback(err, null)
					this.resetUserAttempt(accountHashID, function(err, replies) {
						if (err)
						callback(err, null)
						sessionManager.terminateSessionForAccount(accountHashID, function(err, replies) {
							if (err)
							callback(err, null)
							callback(new Error(configuration.message.user.black), null)
						})
					})
				})
			}
			callback(null, configuration.message.user.safe)
		})
	},

	checkUserBlack: function(accountHashID, callback) {
		var blackListTable = configuration.TableMAAccountModelBlackList + accountHashID
		redisClient.get(blackListTable, function(err, replies) {
			if (err)
			callback(err, null)
			if (replies === 'null')
			callback(null, configuration.message.user.safe)
			else
			callback(new Error(configuration.message.user.black), null)
		})
	}
}
