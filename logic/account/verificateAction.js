var redisClient   = require('../redis_client/redisClient').getClient()
var configuration = require('../config/configuration.json')

module.exports = {
  verificate: function(accountHashID, option, ipAddress, networkModel, callback) {
    var verificateTable = configuration.TableMAAccountModelVerificate + accountHashID
    redisClient.get(verificateTable, function(err, replies) {
      if (err)
        callback(err, null)
      if (replies !== 'null') {
        var multi = redisClient.multi()
        var score = utility.getUnixTimeStamp()
        var accountTable = configuration.TableMAAccountModel + accountHashID
        var oldRegisterStatusTable = configuration.TableAccountModel.RegisterStatus.None
        var newRegisterStatusTable = configuration.TableAccountModel.RegisterStatus.Sample1
        multi.hset(accountHashID, configuration.ConstantAMRegistrationStatus, configuration.Enum.RegisterStatus.Sample1)
        multi.zrem(oldRegisterStatusTable, accountHashID)
        multi.zadd(newRegisterStatusTable, score, accountHashID)
        multi.exec(function (err, replies) {
          if (err)
          callback(err, null)
          callback(null, configuration.message.confirm.successful)
        })
      }
      else
        callback(null, configuration.message.confirm.notSuccessful)
    })
  }
}
