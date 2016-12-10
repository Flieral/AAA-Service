var redis = require('redis')
var client

module.exports = {

  getClient: function() {
    return client
  },

  startRedisClient: function() {
    client = redis.createClient()
    client.on('error', function (err) {
      console.log('Redis Start Error ' + err)
    })
    return client
  },

  stopRedisClient: function() {
    client.quit()
    client.on('error', function (err) {
      console.log('Redis Stop Error ' + err)
    })
  }
}
