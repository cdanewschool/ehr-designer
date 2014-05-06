'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var TemplateSchema = mongoose.Schema
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
			values: {
				type: Object,
				default: {}
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

	TemplateSchema.virtual('isTemplate').get
	(
		function()
		{
			return true;
		}
	);
	
	TemplateSchema.virtual('resizable').get
	(
		function()
		{
			return false;
		}
	);
	
	TemplateSchema.virtual('children').get
	(
		function()
		{
			return [];
		}
	);
	
	TemplateSchema.pre
	(
		'save',
		function(next)
		{
			if( this.isNew )
				this.created = Date.now();
			
			next();
		}
	);
	
	return {name:'Template',schema:TemplateSchema};
};

mongoose.model('Template',module.exports(mongoose).schema);