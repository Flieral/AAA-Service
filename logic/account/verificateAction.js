var configuration = require('../../config/configuration.json')

module.exports = {
  verificate: function (redisClient, accountHashID, option, ipAddress, networkModel, callback) {
    var verificateTable = configuration.TableMAAccountModelVerificate + accountHashID
    redisClient.get(verificateTable, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies !== null || replies !== undefined) {
        var multi = redisClient.multi()
        var score = utility.getUnixTimeStamp()
        var accountTable = configuration.TableMAAccountModel + accountHashID
        var oldRegisterStatusTable = configuration.TableAccountModel.registrationStatusType.pending
        var newRegisterStatusTable = configuration.TableAccountModel.registrationStatusType.approved
        multi.hset(accountHashID, configuration.ConstantAMRegistrationStatus, configuration.enum.registrationStatusType.approved)
        multi.zrem(oldRegisterStatusTable, accountHashID)
        multi.zadd(newRegisterStatusTable, score, accountHashID)
        multi.exec(function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, configuration.message.verificate.successful)
        })
      } else
        callback(null, configuration.message.verificate.failed)
    })
  }
}