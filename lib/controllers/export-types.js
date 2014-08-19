'use strict';

var mongoose = require('mongoose'),
	ExportType = mongoose.model('ExportType');

exports.all = function(req,res)
{
	var query = {};
	
	ExportType.find( query ).exec
	(
		function(err,data)
		{
			var items = [];
			
			for(var d in data)
				items.push( data[d].toObject() );
			
			if( err )
				res.status(500).json(err);
			else
				res.json(items);
		}
	);
};