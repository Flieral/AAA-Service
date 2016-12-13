var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var sessionManager= require('./sessionManager')

module.exports = {
	incrementAccountAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hincrby(modelTable, configuration.ConstantAMAttempt, 1, function(err, replies) {
			if (err)
			callback(err, null)
			this.checkAccountAttempt(accountHashID, function(err, replies) {
				if (err)
				callback(err, null)
				callback(null, replies)
			})
		})
	},

	resetAccountAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hset(modelTable, configuration.ConstantAMAttempt, 0, function(err, replies) {
			if (err)
			callback(err, null)
			callback(null, replies)
		})
	},

	checkAccountAttempt: function(accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hget(modelTable, configuration.ConstantAMAttempt, function(err, replies) {
			if (err)
			callback(err, null)
			if (replies >= configuration.maximumAccountAttempt) {
				redisClient.set(blockListTable, accountHashID, 'EX', configuration.maximumBlockPeriod, 'NX', function(err, replies) {
					if (err)
					callback(err, null)
					this.resetAccountAttempt(accountHashID, function(err, replies) {
						if (err)
						callback(err, null)
						sessionManager.terminateSessionForAccount(accountHashID, function(err, replies) {
							if (err)
							callback(err, null)
							callback(new Error(configuration.message.account.block), null)
						})
					})
				})
			}
			callback(null, configuration.message.account.safe)
		})
	},

	checkAccountBlock: function(accountHashID, callback) {
		var blockListTable = configuration.TableMAAccountModelBlockList + accountHashID
		redisClient.get(blockListTable, function(err, replies) {
			if (err)
			callback(err, null)
			if (replies === 'null')
			callback(null, configuration.message.account.safe)
			else
			callback(new Error(configuration.message.account.block), null)
		})
	}
}
