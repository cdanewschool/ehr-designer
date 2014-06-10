'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var ComponentSchema = mongoose.Schema
	(
		{
			id: {
				type: String,
				index: { unique: true },
				required: true
			},
			componentId: {
				type: String,
				required: true
			},
			name:{
				type: String
			},
			category:{
				type: String
			},
			values: {
				type: Object,
				default: {}
			},
			pid:{
				type: Number
			},
			parentIndex:{
				type: Number
			},
			created: Date
		},
		{ 
			id: false,
			minimize: false,
			toObject: {
				virtuals: true
			}
		}
	);

	ComponentSchema.add( {children: [ComponentSchema]} );
	
	ComponentSchema.pre
	(
		'save',
		function(next)
		{
			if( this.isNew )
				this.created = Date.now();
			
			next();
		}
	);
	
	return {name:'Component',schema:ComponentSchema};
};

mongoose.model('Component',module.exports(mongoose).schema);