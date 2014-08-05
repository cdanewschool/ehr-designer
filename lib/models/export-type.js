'use strict';

var mongoose = require('mongoose'),
	path = require('path');

module.exports = function(mongoose)
{
	var URLValueSchema = mongoose.Schema
	(
		{
			label: {
				type: String,
				required: true
			},
			value: {
				type: String,
				required: true
			}
		},
		{
			_id: false,
			id: false
		}
	);
	
	var ExportTypeSchema = mongoose.Schema
	(
		{
			id: {
				type: String, 
				required: true
			},
			title: {
				type: String, 
				required: true
			},
			description: {
				type: String,
				required: true
			},
			urls: {
				type: [URLValueSchema],
				required: false
			}
		}
	);
	
	return {name:'ExportType',schema:ExportTypeSchema};
};

mongoose.model('ExportType',module.exports(mongoose).schema);