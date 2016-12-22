var configuration = require('../../config/configuration.json')

module.exports = {
	startUserChecking: function(redisClient, accountModelObject, callback){
		this.checkUserExistenceByUsername(redisClient, accountModelObject.username, function(err, replies) {
			if (err)
				callback(err, null)
			else
				this.checkUserExistenceByEmail(redisClient, accountModelObject.email, function(err, replies) {
					if (err)
						callback(err, null)
					else
						this.checkUserExistenceByCompanyName(redisClient, accountModelObject.companyName, function(err, replies) {
							if (err)
								callback(err, null)
							callback(null, replies)
						})
				})
		})
	},

	checkUserExistenceByEmail: function(redisClient, email, callback) {
		this.getAccountIdentifierByEmail(redisClient, email, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.account.notExist)
			else
				callback(new Error(configuration.message.account.exist), null)
		})
	},

	checkUserExistenceByUsername: function(redisClient, username, callback) {
		this.getAccountIdentifierByUsername(redisClient, username, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.account.notExist)
			else
				callback(new Error(configuration.message.account.exist), null)
		})
	},

	checkUserExistenceByCompanyName: function(redisClient, companyName, callback) {
		this.getAccountIdentifierByCompanyName(redisClient, companyName, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.account.notExist)
			else
				callback(new Error(configuration.message.account.exist), null)
		})
	},

	getAccountIdentifierByEmail: function(redisClient, email, callback) {
		var emailTable = configuration.TableMSAccountModelEmail + email
		redisClient.get(emailTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		})
	},

	getAccountIdentifierByUsername: function(redisClient, username, callback) {
		var userTable = configuration.TableMSAccountModelUsername + username
		redisClient.get(userTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		})
	},

	getAccountIdentifierByCompanyName: function(redisClient, companyName, callback) {
		var companyTable = configuration.TableMSAccountModelCompanyName + companyName
		redisClient.get(companyTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		})
	}	
}
