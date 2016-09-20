var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json') 

exports.EmailLogin = function(userToken, copmanyName, password, email, callback)
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
                
                tableName = configuration.TableMAAccountModel + accountHashID
                redisClient.hashModel.getFieldModel(userToken, tableName, configuration.ConstantAMPassword, function(error, result) 
                {
                    if (error)
                        callback(error, null)
                    else
                    {
                        if (result.result === password)
                        {
                        	/* Add to AccountModel:UserToken:accountHashID */
	                        tableName 	= configuration.TableMAAccountModelUserToken + accountHashID
	                        userSessionToken = utility.generateUniqueHashID()
	                        redisClient.stringModel.createTemporaryModel(userToken, tableName, userSessionToken, sessionLength, function(error, result){})

                            var result = {}
	                        result.result =	userSessionToken
	                        callback(null, result)
                        }
                        else
                            callback(new Error("Error"), null)
                    }
                })
            }
        }
    })
}

exports.UsernameLogin = function(userToken, copmanyName, password, username, callback)
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
                tableName = configuration.TableMAAccountModel + accountHashID
                redisClient.hashModel.getFieldModel(userToken, tableName, configuration.ConstantAMPassword, function(error, result) 
                {
                    if (error)
                        callback(error, null)
                    else
                    {
                        if (result.result === password)
                        {
                        	/* Add to AccountModel:UserToken:accountHashID */
	                        tableName 	= configuration.TableMAAccountModelUserToken + accountHashID
	                        userSessionToken = utility.generateUniqueHashID()
	                        redisClient.stringModel.createTemporaryModel(userToken, tableName, userSessionToken, sessionLength, function(error, result){})

                            var result = {}
	                        result.result =	userSessionToken
	                        callback(null, result)
                        }
                        else
                            callback(new Error("Error"), null)
                    }
                })
            }
        }
    })
}