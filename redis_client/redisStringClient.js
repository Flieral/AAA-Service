var configuration 	= require('../config/configuration.json')
var utility			= require('../logic/utility')
var requestHandler 	= require('./requestHandler')

module.exports = 
{
	/* Add a String to StringTable */
	createModel: function(userToken, tableName, value, callback)
	{
		var dict = {
			"UserToken"	: userToken,
			"Key"		: tableName,
			"Value" 	: value
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RString/Set?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Add a String to StringTable */
	createTemporaryModel: function(userToken, tableName, value, expireTimeInSce, callback)
	{
		var dict = {
			"UserToken"	: userToken,
			"Key"		: tableName,
			"Value" 	: value,
            "EX"        : expireTimeInSce
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RString/Set?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Read a String from StringTable */
	getModel: function(userToken, tableName, callback)
	{
		var dict = {
			"UserToken"	: userToken,
			"Key"		: tableName
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RString/Get?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	}
}