var configuration = require('../../config/configuration.json')
var sessionManager = require('./sessionManager')

module.exports = {
	incrementAccountAttempt: function (redisClient, accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hincrby(modelTable, configuration.ConstantAMAttempt, 1, function (err, replies) {
			if (err) {
				callback(err, null)
				return
			} else {
				this.checkAccountAttempt(redisClient, accountHashID, function (err, replies) {
					if (err) {
						callback(err, null)
						return
					}
					callback(null, replies)
				})
			}
		})
	},

	resetAccountAttempt: function (redisClient, accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hset(modelTable, configuration.ConstantAMAttempt, 0, function (err, replies) {
			if (err) {
				callback(err, null)
				return
			}
			callback(null, replies)
		})
	},

	checkAccountAttempt: function (redisClient, accountHashID, callback) {
		var modelTable = configuration.TableMAAccountModel + accountHashID
		redisClient.hget(modelTable, configuration.ConstantAMAttempt, function (err, replies) {
			if (err) {
				callback(err, null)
				return
			} else {
				if (replies >= configuration.maximumAccountAttempt) {
					redisClient.set(blockListTable, accountHashID, 'EX', configuration.maximumBlockPeriod, 'NX', function (err, replies) {
						if (err) {
							callback(err, null)
							return
						}
						this.resetAccountAttempt(redisClient, accountHashID, function (err, replies) {
							if (err) {
								callback(err, null)
								return
							}
							sessionManager.terminateSessionForAccount(redisClient, accountHashID, function (err, replies) {
								if (err) {
									callback(err, null)
									return
								}
								callback(new Error(configuration.message.account.block), null)
							})
						})
					})
				}
				callback(null, configuration.message.account.safe)
			}
		})
	},

	checkAccountBlock: function (redisClient, accountHashID, callback) {
		var blockListTable = configuration.TableMAAccountModelBlockList + accountHashID
		redisClient.get(blockListTable, function (err, replies) {
			if (err) {
				callback(err, null)
				return
			}
			if (replies == null || replies == undefined)
				callback(null, configuration.message.account.safe)
			else
				callback(new Error(configuration.message.account.block), null)
		})
	}
}