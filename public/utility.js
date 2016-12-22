var uuid = require('node-uuid')
var countryList 	= require('../config/country.json')
var configuration = require('../config/configuration.json')

module.exports =
{
	generateQueryString: function(data) {
		var ret = [];
		for (var d in data)
		if (data[d])
		ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
		return ret.join("&");
	},

	base64Encoding: function(data) {
		return new Buffer(data).toString('base64');
	},

	generateUniqueHashID: function() {
		return uuid.v1();
	},

	getUnixTimeStamp: function() {
		return Math.floor((new Date).getTime()/1000);
	},

	mapCountryToTable: function(countryCode) {
		for (var i = 0; i < countryList.length; i++)
		if (countryList[i].code === countryCode)
		return configuration.TableAccountModel.registrationCountry + countryCode + ':'
	}
}
