'use strict';

var mongoose = require('mongoose'),
	Schema = require('mongoose').Schema;

var ProjectSchema = new Schema
(
	{
		creator: {
			type: Schema.Types.ObjectId, 
			ref: 'User',
			required: true
		},
		content: {
			type: Object,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		created: Date,
		updated: Date
	}
);

ProjectSchema.pre
(
	'save',
	function(next,done)
	{
		if( this.isNew)
			this.created = Date.now();
		
		this.updated = Date.now();
		
		next();
	}
);

ProjectSchema.statics = 
{
	load: function(id,cb)
	{
		this.findOne
		(
			{
				_id: id
			}	
		)
		.populate('creator','username').exec(cb);
	}
};

mongoose.model('Project',ProjectSchema);