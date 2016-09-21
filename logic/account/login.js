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
                
                /* AccountModel:accountHashID */
                var tableModel = configuration.TableMAAccountModel + accountHashID
                redisClient.hashModel.getFieldModel(userToken, tableModel, configuration.ConstantAMPassword, function(error, result) 
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
                            redisClient.hashModel.createFieldModel(userToken, tableModel, configuration.ConstantAMAttempt, "0", function(error, result){})
                            var result = {}
	                        result.result =	userSessionToken
	                        callback(null, result)
                        }
                        else
                        {
                            redisClient.hashModel.updateFieldModelIncrBy(userToken, tableModel, configuration.ConstantAMAttempt, "1", function(error, result)
                            {
                                if (error)
                                    callback(error, null)
                                else
                                    if (parseInt(result.result) >= configuration.MaximumUserAttempt)
                                    {
                                        /* AccountModel:BlackList:accountHashID */
                                        var tableModel = configuration.TableMAAccountModelBlackList + accountHashID
                                        redisClient.stringModel.createTemporaryModel(userToken, tableModel, accountHashID, configuration.MaximumBlockPeriod, function(error, result){})
                                        /* AccountModel:accountHashID */
                                        tableModel = configuration.TableMAAccountModel + accountHashID
                                        redisClient.hashModel.createFieldModel(userToken, tableModel, configuration.ConstantAMAttempt, "0", function(error, result){})
                                }
                            })
                            callback(new Error("Error"), null)
                        }
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
                var tableModel = configuration.TableMAAccountModel + accountHashID
                redisClient.hashModel.getFieldModel(userToken, tableModel, configuration.ConstantAMPassword, function(error, result) 
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
                            redisClient.hashModel.createFieldModel(userToken, tableModel, configuration.ConstantAMAttempt, "0", function(error, result){})
                            var result = {}
	                        result.result =	userSessionToken
	                        callback(null, result)
                        }
                        else
                        {
                            redisClient.hashModel.updateFieldModelIncrBy(userToken, tableModel, configuration.ConstantAMAttempt, "1", function(error, result)
                            {
                                if (error)
                                    callback(error, null)
                                else
                                    if (parseInt(result.result) >= configuration.MaximumUserAttempt)
                                    {
                                        /* AccountModel:BlackList:accountHashID */
                                        var tableModel = configuration.TableMAAccountModelBlackList + accountHashID
                                        redisClient.stringModel.createTemporaryModel(userToken, tableModel, accountHashID, configuration.MaximumBlockPeriod, function(error, result){})
                                        /* AccountModel:accountHashID */
                                        tableModel = configuration.TableMAAccountModel + accountHashID
                                        redisClient.hashModel.createFieldModel(userToken, tableModel, configuration.ConstantAMAttempt, "0", function(error, result){})
                                    }
                            })
                            callback(new Error("Error"), null)
                        }
                    }
                })
            }
        }
    })
}