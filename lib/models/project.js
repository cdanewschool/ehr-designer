'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var ProjectSchema = mongoose.Schema
	(
		{
			creator: {
				type: mongoose.Schema.Types.ObjectId, 
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
	
	return {name:'Project',schema:ProjectSchema};
};

mongoose.model('Project',module.exports(mongoose).schema);