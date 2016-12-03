var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json') 

exports.ChangePasswordByEmail = function(userToken, oldPassword, newPassword, email, callback)
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
                        if (oldPassword === password)
                        {
                        	/* Add to AccountModel:accountHashID */
	                        redisClient.hashModel.setFieldValue(userToken, tableName, configuration.ConstantAMPassword, newPassword, function(error, result)
                            {
                                if (error)
                                    callback(error, null)
                                else
                                    callback(null, result)
                            })
                        }
                        else
                            callback(new Error("Error"), null)
                    }
                })
            }
        }
    })
}

exports.ChangePasswordByUsername = function(userToken, oldPassword, newPassword, username, callback)
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
                        if (oldPassword === password)
                        {
                        	/* Add to AccountModel:accountHashID */
	                        redisClient.hashModel.setFieldValue(userToken, tableName, configuration.ConstantAMPassword, newPassword, function(error, result)
                            {
                                if (error)
                                    callback(error, null)
                                else
                                    callback(null, result)
                            })
                        }
                        else
                            callback(new Error("Error"), null)
                    }
                })
            }
        }
    })
}