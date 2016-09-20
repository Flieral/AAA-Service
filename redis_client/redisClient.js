var redisHashClient 	= require('./redisHashClient')
var redisZSetClient 	= require('./redisZSetClient')
var redisSetClient 		= require('./redisSetClient')
var redisListClient 	= require('./redisListClient')

module.exports = 
{
	hashModel	: redisHashClient,
	zSetModel	: redisZSetClient,
	setModel	: redisSetClient,
	listModel	: redisListClient
}