var configuration = require('../../config/configuration.json')
var utility = require('../../public/utility')

module.exports = {
  renewSessionForAccount: function (redisClient, accountHashID, callback) {
    var sessionTable = configuration.TableMAAccountModelUserToken + accountHashID
    var sessionHashID = utility.generateUniqueHashID()
    redisClient.set(sessionTable, sessionHashID, 'EX', configuration.maximumSessionLength, 'NX', function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, configuration.message.session.renew)
    })
  },

  terminateSessionForAccount: function (redisClient, accountHashID, callback) {
    var sessionTable = configuration.TableMAAccountModelUserToken + accountHashID
    redisClient.pexpire(sessionTable, 10, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, configuration.message.session.terminate)
    })
  }
}