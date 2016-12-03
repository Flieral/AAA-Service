var redisStringClient	= require('./redisStringClient')
var redisHashClient 	= require('./redisHashClient')
var redisZSetClient 	= require('./redisZSetClient')
var redisSetClient 		= require('./redisSetClient')
var redisListClient 	= require('./redisListClient')

module.exports = 
{
	stringModel	: redisStringClient,
	hashModel	: redisHashClient,
	zSetModel	: redisZSetClient,
	setModel	: redisSetClient,
	listModel	: redisListClient
}