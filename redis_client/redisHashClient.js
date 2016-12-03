var configuration 	= require('../config/configuration.json')
var utility			= require('../logic/utility')
var requestHandler 	= require('./requestHandler')

module.exports = 
{
	/* Create a KeyValue Hash Table */
	createModel: function(userToken, tableName, keyValue, callback)
	{
		var fieldValues = []
		for (var key in keyValue)
		{
			if (keyValue.hasOwnProperty(key))
			{
				fieldValues.push(key)
				fieldValues.push(keyValue[key])
			}
		}

		var innerDict = { "FieldValues" : fieldValues }
		var encodedFieldValue = utility.base64Encoding(JSON.stringify(innerDict))
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"FieldValue": encodedFieldValue
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/MSet?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Create a Filed Value in Hash Table */
	createFieldModel: function(userToken, tableName, field, value, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Field"		: field,
			"Value"		: value
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/Set?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Update a Filed Value by Increasing in Hash Table */
	updateFieldModelIncrBy: function(userToken, tableName, field, Increment, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Field"		: field,
			"Increment"	: value
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/IncrBy?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get a Hash Table Content */
	getFieldModel: function(userToken, tableName, field, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Field"		: field
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/Get?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get a Hash Table Content */
	getModel: function(userToken, tableName, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/GetAll?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get Hash Table Content of Given Key Tables */
	getComplexModel: function(userToken, keyArray, callback)
	{
		var response = {}
		response.result = []
		var check = 0
		for (var i = 0; i < keyArray.length; i++)
		{
			var dict = {
				"UserToken" : userToken,
				"Key"		: keyArray[i]
			}
			var queryString = utility.generateQueryString(dict)
			var url = configuration.BaseURL + 'Database/RHash/GetAll?' + queryString
			requestHandler(url, function (error, result)
			{ 
				if (error)
					callback(error, null)
				else
				{
					check++
					if (check === keyArray.length)
					{
						response.result.push(result.result)
						callback(null, response)
					}
					else
						response.result.push(result.result)
				}
			})
		}
	},

	/* Delete a Hash Table */
	deleteModel: function(userToken, tableName, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/DelAll?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Delete Hash Table of Given Key Tables */
	deleteComplexModel: function(userToken, keyArray, callback)
	{
		var innerDict = {
			"Keys"		: keyArray
		}
		var encodedKeys = utility.base64Encoding(JSON.stringify(innerDict))
		var dict = {
			"UserToken" : userToken,
			"Key"		: encodedKeys
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RHash/ComplexDel?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	}
}