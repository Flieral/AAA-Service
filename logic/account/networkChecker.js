var configuration = require('../../config/configuration.json')
var utility       = require('../../public/utility')

module.exports = {
  startNetworkChecking: function (redisClient, accountHashID, ipAddress, networkModel, callback) {
    this.checkAccountNetworkChangeByIPAddress(redisClient, accountHashID, ipAddress, function(err, replies) {
      if (err)
      callback(err, null)
      this.checkAccountNetworkChangeByCountry(redisClient, accountHashID, networkModel.country, function(err, replies) {
        if (err)
        callback(err, null)
        this.checkAccountNetworkChangeByMacAddress(redisClient, accountHashID, networkModel.macAddress, function(err, replies) {
          if (err)
          callback(err, null)
          callback(null, replies)
        })
      })
    })
  },

  addIPAddressToSafeIPAddress: function(redisClient, accountHashID, ipAddress, networkModel, callback) {
    var ipListTable = configuration.TableMSNetworkPrivacyIPList + accountHashID
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    multi.zadd(ipListTable, 'NX', score, ipAddress)
    var ipAddressTable = configuration.TableMANetworkPrivacyIPDetails + ipAddress
    multi.hmset(ipAddressTable,
      configuration.ConstantNPMMacAddress, networkModel.macAddress,
      configuration.ConstantNPMCountry, networkModel.country,
      configuration.ConstantNPMAgent, networkModel.agent,
      configuration.ConstantNPMISP, networkModel.isp
    )
    multi.exec(function (err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.network.safeAdd)
    })
  },

  checkAccountNetworkChangeByCountry: function(redisClient, accountHashID, countryType, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMRegistrationCountry, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies !== countryType)
      callback(new Error(configuration.message.network.changed), null)
      callback(null, configuration.message.network.safe)
    })
  },

  checkAccountNetworkChangeByIPAddress: function(redisClient, accountHashID, ipAddress, callback) {
    var ipListTable = configuration.TableMSNetworkPrivacyIPList + accountHashID
    redisClient.zscore(ipListTable, ipAddress, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies !== ipAddress)
      callback(new Error(configuration.message.network.changed), null)
      callback(null, configuration.message.network.safe)
    })
  },

  checkAccountNetworkChangeByMacAddress: function(redisClient, accountHashID, macAddress, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMRegistrationMacAddress, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies !== macAddress)
      callback(new Error(configuration.message.network.changed), null)
      callback(null, configuration.message.network.safe)
    })
  }
}
