'use strict';

var mongoose = require('mongoose'),
	Element = mongoose.model('Element');

exports.all = function(req,res)
{
	var query = {};
	
	Element.find( query ).exec
	(
		function(err,data)
		{
			var elements = [];
			
			for(var d in data)
				elements.push( data[d].toObject() );
			
			if( !elements.length )
				res.status(404).json('No data');
			
			if( err )
				res.status(500).json(err);
			else
				res.json(elements);
		}
	);
};