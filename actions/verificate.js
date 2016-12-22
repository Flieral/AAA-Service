var verificateAction  = require('../logic/account/verificateAction')

var Input = {
	accountHashID: {
		required: true,
		formatter: function(param, connection, actionTemplate) {
			return JSON.parse(new Buffer(param, 'base64'))
		}
	}
}

module.verificate = {
	name: 'verificate',
	description: 'Verificate an Unknown User',
	input: Input,

	run: function(api, data, next) {
		verificateAction.verificate(api.redisClient, data.params.accountHashID, payload.option, payload.ipAddress, payload.networkModel, function(err, replies) {
			if (err) {
				data.response.error = err.error
				next(err)
			}
			data.response.result = replies
			next()
		})
	}
}
