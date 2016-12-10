var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../../public/utility')

module.exports = {
  addIPAddressToSafeIPAddress: function(accountHashID, networkModel, callback) {
    var ipListTable = configuration.TableMSNetworkPrivacyIPList + accountHashID
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    multi.zadd(ipListTable, 'NX', score, networkModel.ipAddress)
    var ipAddressTable = configuration.TableMANetworkPrivacyIPDetails + networkModel.ipAddress
    multi.hmset(ipAddressTable,
      configuration.ConstantNPMMacAddress, networkModel.macAddress,
      configuration.ConstantNPMCountry, networkModel.country,
      configuration.ConstantNPMAgent, networkModel.agent,
      configuration.ConstantNPMISP, networkModel.isp
    )
    multi.exec(function (err, replies) {
      if (err)
        callback(err, null)
      callback(null, configuration.message.safeIPAddressAddition)
    })
  },

  checkUserNetworkChangeByCountry: function(accountHashID, countryType, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMRegistrationCountry, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies === countryType)
        callback(null, configuration.message.country.notChanged)
      else
      {
        // do appropriate tasks
        callback(null, configuration.message.country.changed)
      }
    })
  },

  checkUserNetworkChangeByIPAddress: function(accountHashID, ipAddress, callback) {
    var ipListTable = configuration.TableMSNetworkPrivacyIPList + accountHashID
    redisClient.zscore(ipListTable, ipAddress, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies !== 'null')
        callback(configuration.message.ipAddress.notChanged)
      else
      {
        // do appropriate tasks
        callback(configuration.message.ipAddress.changed)
      }
    })
  },

  checkUserNetworkChangeByMacAddress: function(accountHashID, macAddress, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMRegistrationMacAddress, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies === macAddress)
        callback(null, configuration.message.madAddress.notChanged)
      else
      {
        // do appropriate tasks
        callback(null, configuration.message.madAddress.changed)
      }
    })
  }
}
