var configuration 	= require('../config/configuration.json')
var utility			= require('../logic/utility')
var requestHandler 	= require('./requestHandler')

module.exports = 
{
	/* Add Value to Set Table */
	createKeyModel: function(userToken, tableName, value, callback)
	{
		var values = [value]
		var innerDict = { "Values" : values }
		var encodedValues = utility.base64Encoding(JSON.stringify(innerDict))
		var dict = {
			"UserToken"	: userToken,
			"Key"		: tableName,
			"Value"		: encodedValues
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RList/PUSH?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	}
}