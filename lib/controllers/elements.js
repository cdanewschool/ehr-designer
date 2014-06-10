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
			
			if( err )
				res.json(500,err);
			else
				res.json(elements);
		}
	);
};