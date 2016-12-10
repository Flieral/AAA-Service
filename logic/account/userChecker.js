var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')

module.exports = {
	checkUserExistenceByEmail: function(email, callback) {
		var emailTable = configuration.TableMSAccountModelEmail + email
		redisClient.get(emailTable, function (err, replies) {
    	if (err)
				callback(err, null)
			callback(null, replies)
		})
	},

	checkUserExistenceByUsername: function(username, callback) {
		var userTable = configuration.TableMSAccountModelUsername + username
		redisClient.get(userTable, function (err, replies) {
    	if (err)
				callback(err, null)
			callback(null, replies)
		})
	},

	checkUserExistenceByCompanyName: function(companyName, callback) {
		var companyTable = configuration.TableMSAccountModelCompanyName + companyName
		redisClient.get(companyTable, function (err, replies) {
    	if (err)
				callback(err, null)
			callback(null, replies)
		})
	}
}
