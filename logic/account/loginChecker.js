var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json') 

exports.EmailLoginChecker = function(userToken, copmanyName, password, email, callback)
{
	/* Get AccountModel:Email:email */
	var tableName 	= configuration.TableMSAccountModelEmail + email
	redisClient.stringModel.getModel(userToken, tableName, function(error, result)
    {
        if (error)
            callback(error, null)
        else
        {
            if (result.result === 'null')
                callback(new Error("Doesn't Exists"), null)
            else
            {
                var accountHashID = result.result
            	/* Get AccountModel:UserToken:accountHashID */
	            tableName 	= configuration.TableMAAccountModelUserToken + accountHashID
	            redisClient.stringModel.getModel(userToken, tableName, function(error, result)
                {
                    if (error)
                        callback(error, null)
                    else
                    {
                        if (result.result === 'null')
                            callback(new Error("Login Needed"), null)
                        else
                            callback(null, result)
                    } 
                })
            }
        }
    })
}

exports.UsernameLoginChecker = function(userToken, copmanyName, password, username, callback)
{
 	/* Get AccountModel:Username:username */
	tableName 	= configuration.TableMSAccountModelUsername + username
	redisClient.stringModel.getModel(userToken, tableName, function(error, result)
    {
       if (error)
            callback(error, null)
        else
        {
            if (result.result === 'null')
                callback(new Error("Doesn't Exists"), null)
            else
            {
                var accountHashID = result.result
            	/* Get AccountModel:UserToken:accountHashID */
	            tableName 	= configuration.TableMAAccountModelUserToken + accountHashID
	            redisClient.stringModel.getModel(userToken, tableName, function(error, result)
                {
                    if (error)
                        callback(error, null)
                    else
                    {
                        if (result.result === 'null')
                            callback(new Error("Login Needed"), null)
                        else
                            callback(null, result)
                    } 
                })
            }
        }
    })
}