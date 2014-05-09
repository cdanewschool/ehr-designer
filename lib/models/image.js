'use strict';

var mongoose = require('mongoose'),
	path = require('path');

module.exports = function(mongoose)
{
	var ImageSchema = mongoose.Schema
	(
		{
			creator: {
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User',
				required: true
			},
			data: {
				type: Buffer,
				required: true
			},
			contentType: {
				type: String,
				required: true
			},
			updated: Date,
			created: Date
		},
		{
			toJSON: {
				virtuals: true
			},
			toObject: {
				virtuals: true
			}
		}
	);

	ImageSchema.pre
	(
		'validate',
		function(next,done)
		{
			if( ['image/jpeg','image/png'].indexOf(this.contentType) == -1 )
			{
				this.invalidate('file','Invalid content type');
			}
			
			next();
		}
	);
	
	ImageSchema.pre
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
	
	ImageSchema.statics = 
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
	
	ImageSchema.virtual('thumbnail').get
	( 
		function()
		{ 
			return this.imagePath(true);
		}
	);
	
	ImageSchema.methods = 
		{
			imagePath: function(relative)
			{
				var basePath = path.join(process.cwd(),'www');
				var imagePath = path.join(__dirname,'..','..','www','images','uploads',this._id + '.png');
				
				return relative ? imagePath.substr(imagePath.indexOf(basePath)+basePath.length) : imagePath;
			}
		};
	
	return {name:'Image',schema:ImageSchema};
};

mongoose.model('Image',module.exports(mongoose).schema);