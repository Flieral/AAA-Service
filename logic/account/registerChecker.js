var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json')

exports.EmailChecker = function(userToken, email, callback)
{
	/* Get AccountModel:Email:email */
	var tableName 	= configuration.TableMSAccountModelEmail + email
	redisClient.stringModel.getModel(userToken, tableName, function(error, result)
    {
        if (error)
            callback(error, null)
        else
        {
            var response = {}
            if (result.result === 'null')
                response.exists = false;
            else
                response.exists = true;
            callback(null, response)
        }
    })
}

exports.UsernameChecker = function(userToken, username, callback)
{
	/* Get AccountModel:Username:username */
	tableName 	= configuration.TableMSAccountModelUsername + username
	redisClient.stringModel.getModel(userToken, tableName, function(error, result)
    {
        if (error)
            callback(error, null)
        else
        {
            var response = {}
            if (result.result === 'null')
                response.exists = false;
            else
                response.exists = true;
            callback(null, response)
        }        
    })
}

exports.CompanyNameChecker = function(userToken, companyName, callback)
{
	/* Get AccountModel:CompanyName:companyName */
	var tableName 	= configuration.TableMSAccountModelCompanyName + companyName
	redisClient.stringModel.getModel(userToken, tableName, function(error, result)
    {
        if (error)
            callback(error, null)
        else
        {
            var response = {}
            if (result.result === 'null')
                response.exists = false;
            else
                response.exists = true;
            callback(null, response)
        }
    })
}