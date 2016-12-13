var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')

module.exports = {
	startUserChecking: function(accountModelObject, callback){
		this.checkUserExistenceByUsername(accountModelObject.accountModel.username, function(err, replies) {
			if (err)
				callback(err, null)
			else
				this.checkUserExistenceByEmail(accountModelObject.accountModel.email, function(err, replies) {
					if (err)
						callback(err, null)
					else
						this.checkUserExistenceByCompanyName(accountModelObject.accountModel.companyName, function(err, replies) {
							if (err)
								callback(err, null)
							callback(null, replies)
						})
				})
		}
	},

	checkUserExistenceByEmail: function(email, callback) {
		this.getAccountIdentifierByEmail(email, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.user.notExistUser)
			else
				callback(new Error(configuration.message.user.existUser), null)
		})
	},

	checkUserExistenceByUsername: function(username, callback) {
		this.getAccountIdentifierByUsername(username, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.user.notExistUser)
			else
				callback(new Error(configuration.message.user.existUser), null)
		})
	},

	checkUserExistenceByCompanyName: function(companyName, callback) {
		this.getAccountIdentifierByCompanyName(companyName, function(err, replies) {
			if (err)
				callback(err, null)
			if (replies === 'null')
				callback(null, configuration.message.user.notExistUser)
			else
				callback(new Error(configuration.message.user.existUser), null)
		})
	},

	getAccountIdentifierByEmail: function(email, callback) {
		var emailTable = configuration.TableMSAccountModelEmail + email
		redisClient.get(emailTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		}
	},

	getAccountIdentifierByUsername: function(username, callback) {
		var userTable = configuration.TableMSAccountModelUsername + username
		redisClient.get(userTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		}
	},

	getAccountIdentifierByCompanyName: function(companyName, callback) {
		var companyTable = configuration.TableMSAccountModelCompanyName + companyName
		redisClient.get(companyTable, function (err, replies) {
			if (err)
				callback(err, null)
			callback(null, replies)
		}
	}
}
