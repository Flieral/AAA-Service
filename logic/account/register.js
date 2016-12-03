var utility			= require('../logic/utility')
var redisClient		= require('../redis_client/redisClient')
var configuration 	= require('../config/configuration.json')

/*
	payload = {
		IPAddress: 											-> Required, Any Arbitary UTF8 String
		ReferralAccount:									-> Required, Any Arbitary UTF8 String
		AccountModel: {
			Email: emailX									-> Required, Any Arbitary UTF8 String
			CompanyName: companyNameX						-> Required, Any Arbitary UTF8 String
			Username: usernameX								-> Required, Any Arbitary UTF8 String
			Password: passwordX								-> Required, Any Arbitary UTF8 String
			RegistrationCountry: SampleX					-> Required, Based on config/configuration JSON file
			RegistrationMacAddress: registerMacAddressX		-> Required, Any Arbitary UTF8 String
		},
		NetworkModel: {
			ISP:											-> Required, Any Arbitary UTF8 String
			Agent:											-> Required, Any Arbitary UTF8 String
		}
	}
*/
module.exports = function(userToken, payload, callback)
{
	var tableName
	var userSessionToken
	var sessionLength = 1000
	var valueTime = payload[configuration.ConstantMMTime]
	var accountHashID = payload.CompanyName + "-" + payload.Username

	payload.AccountModel.RegistrationStatus = configuration.Enum.Sample1
	payload.AccountModel.SuspendStatus = configuration.Enum.Sample1
	payload.AccountModel.WebhookBaseURL = payload.AccountModel.CompanyName
	payload.AccountModel.Attempt = 0

	payload.NetworkModel.Country = payload.AccountModel.RegistrationCountry
	payload.NetworkModel.MacAddress = payload.AccountModel.RegistrationMacAddress

	/* Add to AccountModel:accountHashID */
	tableName 	= configuration.TableMAAccountModel + accountHashID
	redisClient.hashModel.createModel(userToken, tableName, payload.AccountModel, function(error, result){})

	/* Add to NetworkPrivacy:IPDetails:IPAddress */
	tableName 	= configuration.TableMANetworkPrivacyIPDetails + payload.IPAddress
	redisClient.hashModel.createModel(userToken, tableName, payload.NetworkModel, function(error, result){})

	/* Add to AccountModel:ReferralPlan:AccountHashID */
	tableName 	= configuration.TableMSAccountModelReferralPlan + payload.ReferralAccount
	redisClient.zSetModel.createKeyModel(userToken, tableName, accountHashID, valueTime, function(error, result){})

	/* Add to NetworkPrivacy:IPList:AccountHashID */
	tableName 	= configuration.TableMSNetworkPrivacyIPList + accountHashID
	redisClient.zSetModel.createKeyModel(userToken, tableName, payload.IPAddress, valueTime, function(error, result){})

	/* Add to AccountModel:CompanyName:companyName */
	tableName 	= configuration.TableMSAccountModelCompanyName + payload.AccountModel.CompanyName
	redisClient.stringModel.createModel(userToken, tableName, accountHashID, function(error, result){})

	/* Add to AccountModel:Username:username */
	tableName 	= configuration.TableMSAccountModelUsername + payload.AccountModel.Username
	redisClient.stringModel.createModel(userToken, tableName, accountHashID, function(error, result){})

	/* Add to AccountModel:Email:email */
	tableName 	= configuration.TableMSAccountModelEmail + payload.AccountModel.Email
	redisClient.stringModel.createModel(userToken, tableName, accountHashID, function(error, result){})

	/* Add to AccountModel:RegistrationStatusType1: */
	tableName 	= configuration.TableAccountModel.RegistrationStatus[payload[configuration.ConstantAMRegistrationStatus]]
	redisClient.zSetModel.createKeyModel(userToken, tableName, accountHashID, valueTime, function(error, result){})

	/* Add to AccountModel:SuspendStatusType1: */
	tableName 	= configuration.TableAccountModel.SuspendStatus[payload[configuration.ConstantAMSuspendStatus]]
	redisClient.zSetModel.createKeyModel(userToken, tableName, accountHashID, valueTime, function(error, result){})

	/* Add to AccountModel:CountryType1: */
	tableName 	= configuration.TableAccountModel.RegistrationCountry[payload[configuration.ConstantAMRegistrationCountry]]
	redisClient.zSetModel.createKeyModel(userToken, tableName, accountHashID, valueTime, function(error, result){})

	/* Add to AccountModel:UserToken:accountHashID */
	tableName 	= configuration.TableMAAccountModelUserToken + accountHashID
	userSessionToken = utility.generateUniqueHashID()
	redisClient.stringModel.createTemporaryModel(userToken, tableName, userSessionToken, sessionLength, function(error, result){})

	var result = {}
	result.result =	userSessionToken
	callback(null, result)
}