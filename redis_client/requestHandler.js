var request	= require('request')

module.exports = function(url, callback)
{
	console.log('url: ' + url)
	request
	(
		{
			method: 'GET',
			uri: url
		},
		function (error, response, body)
		{
			// body is the decompressed response body
			if (!error && response.statusCode === 200)
				callback(null, JSON.parse(body))
			else
				callback(new Error(JSON.parse(body).error), null)
		}
	)
	.on
	(
		'error',
		function(err)
		{
			callback(err, null)
		}
	)
}