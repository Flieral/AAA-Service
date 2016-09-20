var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json') 

/*
    payload = {
        IPAddress:                  -> Required, Any Arbitary UTF8 String
        NetworkModel = {
            Country:
            ISP:                    -> Required, Any Arbitary UTF8 String
            Agent:                  -> Required, Any Arbitary UTF8 String
            MacAddress:             -> Required, Any Arbitary UTF8 String
        }
    }
*/
exports.NetworkChecker = function(userToken, accountHashID, payload, callback)
{
    var tableName = configuration.TableMSNetworkPrivacyIPList + accountHashID
    redisClient.zSetModel.getReverseModel(userToken, tableName, "0", "-1", function(error, result)
    {
        if (error)
            callback(error, null)
        else
        {
            var found = false
            var ipArray = result.result
            for(var i = 0; i < ipArray.length; i++)
            {
                if (payload.IPAddress === ipArray[i])
                {
                    found = true
                    break
                }
            }

            if (!found)
            {
            	/* Add to NetworkPrivacy:IPDetails:IPAddress */
	            tableName 	= configuration.TableMANetworkPrivacyIPDetails + payload.IPAddress
	            redisClient.hashModel.createModel(userToken, tableName, payload.NetworkModel, function(error, result){})

            	/* Add to NetworkPrivacy:IPList:AccountHashID */
	            tableName 	= configuration.TableMSNetworkPrivacyIPList + accountHashID
	            redisClient.zSetModel.createKeyModel(userToken, tableName, payload.IPAddress, valueTime, function(error, result){})

                /* If Needed Call Alarm Client */
            }
        }
    })
}
