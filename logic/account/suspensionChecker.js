var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')
var utility       = require('../../public/utility')

module.exports = {
  addToSuspensionList: function(accountHashID, suspendType, callback) {
    var suspendTable = TableAccountModel.SuspendStatus[suspendType]
    var modelTable = configuration.TableMAAccountModel + accountHashID
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    multi.zadd(suspendTable, 'NX', score, accountHashID)
    multi.hset(modelTable, configuration.ConstantAMSuspendStatus, suspendType)
    multi.exec(function (err, replies) {
      if (err)
        callback(err, null)
      callback(null, configuration.message.userSuspend)
    })
  },

  removeFromSuspensionList: function(accountHashID, callback) {
    var suspendTable = TableAccountModel.SuspendStatus[configuration.Enum.SuspendType.None]
    var modelTable = configuration.TableMAAccountModel + accountHashID
    var multi = redisClient.multi()
    multi.zrem(suspendTable, accountHashID)
    multi.hset(modelTable, configuration.ConstantAMSuspendStatus, configuration.Enum.SuspendType.None)
    multi.exec(function (err, replies) {
      if (err)
        callback(err, null)
      callback(null, configuration.message.userSafe)
    })
  },

  checkAccountSuspension: function(accountHashID, callback) {
    var modelTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hget(modelTable, configuration.ConstantAMSuspendStatus, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies === configuration.Enum.SuspendType.None)
        callback(null, configuration.message.userSafe)
      else
        callback(null, configuration.message.userSuspend)
    }
  }
}
