/*
 * This code for mocking jQuery Ajax calls is based on
 * 
 * http://forum.jquery.com/topic/mock-ajax-jquery-1-5
 * 
 */
/*jslint browser: true, devel: true, bitwise: true, regexp: true, undef: true, nomen: true, newcap: true, white: true, onevar: true, maxerr: 50, indent: 4 */
/*global $ */
/*members abort, ajaxPrefilter, ajaxSetup, ajaxTransport, converters, 
    dataTypes, jsonData, mock, mockup, "mockup json", "mockup text", parse, 
    pop, send, textData
*/

var MOCKUP = {
	jsonData: {},
	textData: ''
};

$.ajaxSetup({
	converters: {
		"mockup json": function (requestOptions) {
			//console.log('mockup json = ' + MOCKUP.jsonData);
			if ('string' === typeof MOCKUP.jsonData) {
				return JSON.parse(MOCKUP.jsonData);
			} else {
				return MOCKUP.jsonData;
			}			
		},
		"mockup text": function (requestOptions) {
			return MOCKUP.textData;
		}
	}
});

$.ajaxTransport("mockup", function (options) {
	return {
		send: function (headers, callback) {
			callback(200, "OK", {mockup: options});
		},
		abort: function () {
			//
		}
	};
});

$.ajaxPrefilter(function (options) {
	if (null === options.url.match(/^http:\/\/maps.google.com\/maps\/api\/js/) && options.mock) {
		var finalDataType = options.dataTypes.pop();
		options.dataTypes = [ finalDataType === '*' ? 'text' : finalDataType ];
		return 'mockup';
	}
});

$.ajaxSetup({
	mock: true
});
