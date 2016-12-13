var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../../public/utility')

module.exports = {
  addToSuspensionList: function(accountHashID, suspendType, callback) {
    var suspendTable = configuration.TableAccountModel.suspendStatusType[suspendType]
    var modelTable = configuration.TableMAAccountModel + accountHashID
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    multi.zadd(suspendTable, 'NX', score, accountHashID)
    multi.hset(modelTable, configuration.ConstantAMSuspendStatus, suspendType)
    multi.exec(function (err, replies) {
      if (err)
      callback(err, null)
      callback(new Error(configuration.message.account.suspend), null)
    })
  },

  removeFromSuspensionList: function(accountHashID, suspendType, callback) {
    var suspendTable = configuration.TableAccountModel.suspendStatusType[suspendType]
    var modelTable = configuration.TableMAAccountModel + accountHashID
    var multi = redisClient.multi()
    multi.zrem(suspendTable, accountHashID)
    multi.hset(modelTable, configuration.ConstantAMSuspendStatus, configuration.enum.suspendStatusType.none)
    multi.exec(function (err, replies) {
      if (err)
      callback(err, null)
      callback(null, configuration.message.account.safe)
    })
  },

  changeSuspensionType: function(accountHashID, oldSuspendType, newSuspendType, callback) {
    this.removeFromSuspensionList(accountHashID, oldSuspendType, function(err, replies) {
      if (err)
      callback(err, null)
      this.addToSuspensionList(accountHashID, newSuspendType, function(err, replies) {
        if (err)
        callback(err, null)
        callback(null, replies)
      })
    })
  }

  checkAccountSuspension: function(accountHashID, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMSuspendStatus, function(err, replies) {
      if (err)
      callback(err, null)
      if (replies === configuration.enum.suspendStatusType.none)
      callback(null, configuration.message.account.safe)
      else
      callback(new Error(configuration.message.account.suspend), null)
    }
  }
}
