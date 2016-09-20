var configuration 	= require('../config/configuration.json')
var utility			= require('../logic/utility')
var requestHandler 	= require('./requestHandler')

module.exports = 
{
	/* Add Member Score to ZSet Table */
	createKeyModel: function(userToken, tableName, member, score, callback)
	{
		var scoreMembers = [score, member]
		var innerDict = { "ScoreMembers" : scoreMembers }
		var encodedScoreMember = utility.base64Encoding(JSON.stringify(innerDict))
		var dict = {
			"UserToken" 	: userToken,
			"Key"			: tableName,
			"ScoreMember"	: encodedScoreMember
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/Add?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get Intersection of ZSet Tables in ZSet DestinationTable */
	getIntersectModel: function(userToken, destinationTableName, tables, callback)
	{
		var innerDict = { "Keys" : tables }
		var encodedKeys = utility.base64Encoding(JSON.stringify(innerDict))
		var dict = {
			"UserToken" 	: userToken,
			"Key"			: encodedKeys,
			"Destination"	: destinationTableName,
			"Aggregate"		: "MAX",
			"Numkeys"		: tables.length
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/InterStore?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get ZSet Table Content from Start to Stop */
	getModel: function(userToken, tableName, start, stop, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Start"		: start,
			"Stop"		: stop
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/Range?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get ZSet Table Content from Start to Stop in Reverse Mode */
	getReverseModel: function(userToken, tableName, start, stop, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Start"		: start,
			"Stop"		: stop
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/RevRange?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Get ZSet Table Content by Score from Min to Max */
	getWithScoreModel: function(userToken, tableName, minScore, maxScore, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Min"		: minScore,
			"Max"		: maxScore
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/RangeByScore?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	},

	/* Delete a Key by Rank from ZSet Table */
	deleteKeyModel: function(userToken, tableName, member, callback)
	{
		var dict1 = {
			"UserToken"	: userToken,
			"Key"		: tableName,
			"Member"	: member
		}
		var queryString1 = utility.generateQueryString(dict1)
		var url1 = configuration.BaseURL + 'Database/RZSet/Rank?' + queryString1
		requestHandler(url1, function (error, result)
		{ 
			if (error)
				callback(error, null)
			else
			{
				if (result.result !== null)
				{
					var dict = {
						"UserToken" : userToken,
						"Key"		: tableName,
						"Start"		: result.result.toString(),
						"Stop"		: result.result.toString()
					}
					var queryString = utility.generateQueryString(dict)
					var url = configuration.BaseURL + 'Database/RZSet/RemRangeByRank?' + queryString
					requestHandler(url, function (error, result) { callback(error, result)})
				}	
			}
		})
	},

	/* Delete a ZSet Table */
	deleteModel: function(userToken, tableName, callback)
	{
		var dict = {
			"UserToken" : userToken,
			"Key"		: tableName,
			"Start"		: "0",
			"Stop"		: "-1"
		}
		var queryString = utility.generateQueryString(dict)
		var url = configuration.BaseURL + 'Database/RZSet/RemRangeByRank?' + queryString
		requestHandler(url, function (error, result) { callback(error, result)})
	}
}