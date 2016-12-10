var redis = require("../public/redisClient")

module.exports =
{
	start: function(api, next)
	{
		api.redisClient = {};

		api.log('[DATABASE][REDIS][START]', 'info')
		api.redisClient = redis.startRedisClient()
		next()
	},

	stop: function(api, next)
	{
		api.log('[DATABASE][REDIS][STOP]', 'info')
		api.redisClient.stopRedisClient()
		next()
	}
}
