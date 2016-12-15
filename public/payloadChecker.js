var payloadCheck = require ("../config/payloadCheck.json")

module.exports = {
  requiredCheck: function(body, option, callback) {
    var counter = 0
    var peyKeys = Object.keys(payloadCheck)
    var payload = payloadCheck
    var depth = 0
    var lenghtTemp = []
    var peyKeysTemp = []
    var counterTemp = []
    var counterTempCounter = 0
    var peyKeysTempCounter = 0
    var payloadTemp = []
    var payloadCounter = 0
    lenghtTemp[0] = peyKeys.length
    do {
      while (counter < lenghtTemp[depth]) {

        if (payload[peyKeys[counter]].required ==null) {

          payloadTemp[payloadCounter++] = payload
          payload = payload[peyKeys[counter]]

          counter = counter + 1
          counterTemp[counterTempCounter++] = counter
          counter = 0
          depth++

          peyKeysTemp[peyKeysTempCounter++] = peyKeys
          peyKeys = Object.keys(payload)
          lenghtTemp[depth] = peyKeys.length
          continue
        }
        if (payload[peyKeys[counter]].required && !body[peyKeys[counter]]){
          callback(new Error('Required Key Missing'))
        }
        counter++
      }
      if (depth > 0){
        depth--
        payload = payloadTemp[--payloadCounter]
        peyKeys = peyKeysTemp[--peyKeysTempCounter]
        counter = counterTemp[--counterTempCounter]
        continue
      }

      if (depth == 0)
      break
    } while (true)
  },

  formatter: function(body, callback) {
    var bodyKeys = Object.keys(body)
    var counter = 0
    var peyKeys = Object.keys(payloadCheck)
    var payload = payloadCheck
    var depth = 0
    var lenghtTemp = []
    var peyKeysTemp = []
    var counterTemp = []
    var counterTempCounter = 0
    var peyKeysTempCounter = 0
    var payloadTemp = []
    var payloadCounter = 0
    lenghtTemp[0] = peyKeys.length

    do {
      while(counter < lenghtTemp[depth]) {

        if (payload[peyKeys[counter]].required ==null) {

          payloadTemp[payloadCounter++] = payload
          payload = payload[peyKeys[counter]]

          counter = counter + 1
          counterTemp[counterTempCounter++] = counter
          counter = 0
          depth++

          peyKeysTemp[peyKeysTempCounter++] = peyKeys
          peyKeys = Object.keys(payload)
          lenghtTemp[depth] = peyKeys.length

          continue
        }
        if (body[peyKeys[counter]])
        switch (payload[peyKeys[counter]].type)
        {
          case 'int':
          body[peyKeys[counter]] = parseInt(body[peyKeys[counter]])
          break
          case 'double':
          body[peyKeys[counter]] = parseFloat(body[peyKeys[counter]])
          break
        }
        counter++
      }
      if (depth > 0){
        depth--
        payload = payloadTemp[--payloadCounter]
        peyKeys = peyKeysTemp[--peyKeysTempCounter]

        counter = counterTemp[--counterTempCounter]
        continue
      }
      if (depth == 0)
      break
    } while (true)

    callback(null, body)
  },

  validator: function(body, callback) {
    var bodyKeys = Object.keys(body)
    var counter = 0
    var peyKeys = Object.keys(payloadCheck)
    var payload = payloadCheck
    var depth = 0
    var lenghtTemp = []
    var peyKeysTemp = []
    var counterTemp = []
    var counterTempCounter = 0
    var peyKeysTempCounter = 0
    var payloadTemp = []
    var payloadCounter = 0
    lenghtTemp[0] = peyKeys.length

    for (var i = 0; i < bodyKeys.length; i++) {
      var bodyKeyFound = false
      var validate = false

      do {
        while (counter < lenghtTemp[depth]) {

          if(payload[peyKeys[counter]].required ==null) {

            payloadTemp[payloadCounter++] = payload
            payload = payload[peyKeys[counter]]

            counter = counter + 1
            counterTemp[counterTempCounter++] = counter
            counter = 0
            depth++

            peyKeysTemp[peyKeysTempCounter++] = peyKeys
            peyKeys = Object.keys(payload)
            lenghtTemp[depth] = peyKeys.length

            continue
          }
          if (payload[peyKeys[counter]] == bodyKeys[i]){
            bodyKeyFound = true
            if (payload[peyKeys[counter]].enum){
              var enums = Object.keys(configuration.enums[payload[peyKeys[counter]]].enum)
              for (var j = 0; j < enums.lenght; j++)
              if(enums[j] === body[bodyKeys[i]])
              validate = true
            }
          }
          counter++
        }
        if (depth > 0){
          depth--
          payload = payloadTemp[--payloadCounter]
          peyKeys = peyKeysTemp[--peyKeysTempCounter]
          counter = counterTemp[--counterTempCounter]
          continue
        }
        if (depth == 0)
        break
      }while(true)

      if (!bodykeyFound)
      callback(new Error(bodyKeys[i] + ' ' + configuration.message.missingKey), null)
      if (!validate)
      callback(new Error(configuration.message.validator.failed), null)
    }
  },

  startChecking: function(body, option, finalCallback) {
    this.requiredCheck(body, option, function(error) {
      if (error)
      finalcallback(error, null)
      finalCallback(null, true)
    })
  }
}
