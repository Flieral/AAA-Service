var confirmAction = require('../logic/account/confirmAction')

var Input = {
  accountHashID: {
    required: true,
    formatter: function (param, connection, actionTemplate) {
      return JSON.parse(new Buffer(param, 'base64'))
    }
  }
}

exports.confirm = {
  name: 'confirm',
  description: 'confirm a pending User',
  input: Input,

  run: function (api, data, next) {
    confirmAction.confirm(api.redisClient, data.params.accountHashID, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      } else {
        data.response.result = replies
        next()
      }
    })
  }
}