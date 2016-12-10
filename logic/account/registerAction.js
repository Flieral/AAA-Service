var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')

module.exports = {
  register: function(payload, callback) {
    var tableName
    var accountHashID = payload.accountModel.companyName + "-" + payload.accountModel.username
    var score = payload[configuration.ConstantMMTime]
    var multi = redisClient.multi()

    payload.accountModel.registrationStatus  = configuration.Enum.RegistrationStatusType.Pending
    payload.accountModel.suspendStatus       = configuration.Enum.SuspendType.None
    payload.accountModel.time                = payload.time
    payload.accountModel.webhookBaseURL      = 'http://' + payload.accountModel.companyName + '.Flieral.com'
    payload.accountModel.attempt = 0
    payload.accountModel.message = configuration.message.registerUser

    payload.networkModel.country     = payload.accountModel.registrationCountry
    payload.networkModel.macAddress  = payload.accountModel.registrationMacAddress

    /* Add to accountModel:accountHashID */
    tableName 	= configuration.TableMAAccountModel + accountHashID
    multi.hmset(tableName,
      configuration.ConstantAMEmail, payload.accountModel.email,
      configuration.ConstantAMCompanyName, payload.accountModel.companyName,
      configuration.ConstantAMUsername, payload.accountModel.username,
      configuration.ConstantAMPassword, payload.accountModel.password,
      configuration.ConstantMMTime, payload.accountModel.time,
      configuration.ConstantAMRegistrationCountry, payload.accountModel.registrationCountry,
      configuration.ConstantAMRegistrationMacAddress, payload.accountModel.registrationMacAddress,
      configuration.ConstantAMRegistrationStatus, payload.accountModel.registrationStatus,
      configuration.ConstantAMSuspendStatus, payload.accountModel.suspendStatus,
      configuration.ConstantAMWebhookBaseURL, payload.accountModel.webhookBaseURL,
      configuration.ConstantAMAttempt, payload.accountModel.attempt,
      configuration.ConstantAMMessage, payload.accountModel.message
    )

    /* Add to NetworkPrivacy:IPDetails:IPAddress */
    tableName 	= configuration.TableMANetworkPrivacyIPDetails + payload.ipAddress
    multi.hmset(tableName,
      configuration.ConstantNPMMacAddress, payload.networkModel.macAddress,
      configuration.ConstantNPMCountry, payload.networkModel.country,
      configuration.ConstantNPMAgent, payload.networkModel.agent,
      configuration.ConstantNPMISP, payload.networkModel.isp
    )

    /* Add to accountModel:ReferralPlan:AccountHashID */
    tableName 	= configuration.TableMSAccountModelReferralPlan + payload.referralAccount
    multi.zadd(tableName, score, accountHashID)

    /* Add to NetworkPrivacy:IPList:AccountHashID */
    tableName 	= configuration.TableMSNetworkPrivacyIPList + accountHashID
    multi.zadd(tableName, score, payload.networkModel.IPAddress)

    /* Add to accountModel:CompanyName:companyName */
    tableName 	= configuration.TableMSAccountModelCompanyName + payload.accountModel.companyName
    multi.zadd(tableName, score, accountHashID)

    /* Add to accountModel:Username:username */
    tableName 	= configuration.TableMSAccountModelUsername + payload.accountModel.username
    multi.zadd(tableName, score, accountHashID)

    /* Add to accountModel:Email:email */
    tableName 	= configuration.TableMSAccountModelEmail + payload.accountModel.email
    multi.zadd(tableName, score, accountHashID)

    /* Add to accountModel:RegistrationStatusType1: */
    tableName 	= configuration.TableAccountModel.RegistrationStatus[payload[configuration.ConstantAMRegistrationStatus]]
    multi.zadd(tableName, score, accountHashID)

    /* Add to accountModel:SuspendStatusType1: */
    tableName 	= configuration.TableAccountModel.SuspendStatus[payload[configuration.ConstantAMSuspendStatus]]
    multi.zadd(tableName, score, accountHashID)

    /* Add to accountModel:CountryType1: */
    tableName 	= configuration.TableAccountModel.RegistrationCountry[payload[configuration.ConstantAMRegistrationCountry]]
    multi.zadd(tableName, score, accountHashID)

    multi.exec(function (err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.safeRegistration)
    })
  },

  confirmRegistration: function(accountHashID, callback) {

  }
}