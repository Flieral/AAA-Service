var verificateAction = require('../logic/account/verificateAction')
var payloadChecker = require('../public/payloadChecker')

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
    payloadChecker.startChecking(payload, function(error, result) {
      if (error) {
        data.response.error = error.error
        next(error)
      }
      verificateAction.verificate(data.params.accountHashID, payload.option , payload.ipAddress, payload.networkModel, function(error, replies) {
        if (error) {
          data.response.error = error
          next(error)
        }
        data.response.result = replies
      })
    })
  }
}

