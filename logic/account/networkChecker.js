var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../../public/utility')

module.exports = {

  startNetworkChecking: function (accountHashID, networkModel, callback) {
    checkUserNetworkChangeByCountry(accountHashID, networkModel.country, function(err, replies) {
      if (err)
        callback(err, null)
      if (!replies)
        callback(new Error(configuration.message.country.Changed), null)

      checkUserNetworkChangeByIPAddress(accountHashID, networkModel.ipAddress, function(err, replies) {
        if (err)
          callback(err, null)
        if (!replies)
          callback(new Error(configuration.message.ipAddress.changed), null)

        checkUserNetworkChangeByMacAddress(accountHashID, networkModel.macAddress, function(err, replies) {
          if (err)
            callback(err, null)
          if (!replies)
            callback(new Error(configuration.message.macAddress.Changed), null)
        })
      })
    })
    //do apropriate task
    callback(null, 'networkModel not changed message')
  }
}

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
    if (replies !== countryType)
      callback(new Error('country changed message'), null)
    callback(null, true)
  })
},

checkUserNetworkChangeByIPAddress: function(accountHashID, ipAddress, callback) {
  var ipListTable = configuration.TableMSNetworkPrivacyIPList + accountHashID
  redisClient.zscore(ipListTable, ipAddress, function(err, replies) {
    if (err)
      callback(err, null)
    if (replies !== ipAddress)
      callback(new Error('ipAddress changed message'), null)
    callback(null, true)
  })
},

checkUserNetworkChangeByMacAddress: function(accountHashID, macAddress, callback) {
  var modelTable = configuration.TableMAAccountModel + accountHashID
  redisClient.hget(modelTable, configuration.ConstantAMRegistrationMacAddress, function(err, replies) {
    if (err)
      callback(err, null)
    if (replies !== macAddress)
      callback(new Error('macAddress changed message'), null)
    callback(null, true)
  })
}
}
