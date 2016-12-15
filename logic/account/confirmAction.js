var configuration = require('../../config/configuration.json')

module.exports = {
  confirm: function(redisClient, accountHashID, callback) {
    var accountTable = configuration.TableMAAccountModel + accountHashID
    redisClient.hset(accountHashID, configuration.ConstantAMRegistrationStatus, configuration.enum.registrationStatusType.approved, function(err, replies) {
      if (err)
        callback(err, null)
      callback(null, configuration.message.confirm.successful)
    })
  }
}
