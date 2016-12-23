'use strict'
var request = require('request')
var fs = require('fs')
var os = require('os')
var should = require('should')
let path = require('path')
var api
var url

describe('Server: Web', function () {

	before(function (done) {
		url = 'http://localhost:8090/api'
    	done()
	})

	after(function (done) {
		done()
	})

	it('Register a User For Test', function(done) {
		var mybody = JSON.stringify({
			ipAddress: '192.168.15.46',
			referralAccount: 'mrMohammad',
			time: 1234567890,
			accountModel: {
				email: 'mrWeed@yahoo.com',
				companyName: 'WeedCompany',
				username: 'WeedGuy',
				password: 'fpass',
				registrationCountry: 'US',
				registrationMacAddress: '12-34-56-78-9A-BC'
			},
			networkModel: {
				isp: 'FHiweb',
				agent: 'Firefox'
			}
		})

		request.post(url + '/account/register', {'body': mybody, 'headers': {'Content-type': 'application/json'}}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			}
			else 
				done(new Error(body.error))
		})
	})

})