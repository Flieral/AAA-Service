var confirmAction = require('../logic/account/confirmAction')

var Input = {
  accountHashID: {
    required: true,
    formatter: function(param, connection, actionTemplate) {
      return JSON.parse(new Buffer(param, 'base64'))
    }
  }
}

exports.confirm = {
  name: 'confirm',
  description: 'confirm a pending User',
  input: Input,

  run: function(api, data, next) {
    confirmAction.confirm(data.params.accountHashID, function (error, replies) {
      if (error) {
        data.response.error = error.error
        next(error)
      }
      data.response.result = replies
      next()
    })
  }
}
