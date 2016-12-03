var configuration 	= require('../config/configuration.json')
var utility			= require('../logic/utility')
var requestHandler 	= require('./requestHandler')

module.exports = 
{
	/* Add Member to Set Table */
	createKeyModel: function(userToken, tableName, member, callback)
	{
		var dict = {
			"UserToken"	: userToken,
			"Key"		: tableName,
			"Member"	: member
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RSet/Add?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	}
}