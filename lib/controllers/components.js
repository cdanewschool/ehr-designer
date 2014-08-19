'use strict';

var mongoose = require('mongoose'),
	Component = mongoose.model('Component');

exports.all = function(req,res)
{
	var query = {};
	
	Component.find( query ).exec
	(
		function(err,data)
		{
			var components = [];
			
			for(var d in data)
				components.push( data[d].toObject() );
			
			if( err )
				res.status(500).json(err);
			else
				res.json(components);
		}
	);
};