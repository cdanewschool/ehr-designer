'use strict';

var mongoose = require('mongoose'),
	Template = mongoose.model('Template');

exports.all = function(req,res)
{
	var query = {};
	
	Template.find( query ).exec
	(
		function(err,data)
		{
			var templates = [];
			
			for(var d in data)
				templates.push( data[d].toObject() );
			
			if( err )
				res.status(500).json(err);
			else
				res.json(templates);
		}
	);
};