'use strict';

var mongoose = require('mongoose'),
	DesignRule = mongoose.model('DesignRule');

exports.all = function(req,res)
{
	var query = {};
	
	DesignRule.find( query ).exec
	(
		function(err,data)
		{
			var items = [];
			
			for(var d in data)
				items.push( data[d].toObject() );
			
			if( err )
				res.json(500,err);
			else
				res.json(items);
		}
	);
};