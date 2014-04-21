'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var PropertySchema = mongoose.Schema
	(
		{
			id: {
				type: String,
				required: true
			},
			type: {
				type: String,
				enum: ['string','int','object','array','enum','color']
			},
			name: {
				type: String
			},
			editable: {
				type: Boolean
			},
			lockable: {
				type: Boolean
			},
			parseExpression: {
				type: String
			},
			values: {
				type: [String]
			}
		},
		{
			_id: false,
			id: false
		}
	);

	PropertySchema.add( {properties: [PropertySchema]} );
	PropertySchema.pre
	(
		'save',
		function(next)
		{
			if( this.properties == null || !this.properties.length )
				this.properties = undefined;
			if( this.values == null || !this.values.length )
				this.values = undefined;
			
			next();
		}
	);
	
	var ComponentSchema = mongoose.Schema
	(
		{
			id: {
				type: String,
				index: { unique: true },
				required: true
			},
			name:{
				type: String
			},
			abstract:{
				type: Boolean
			},
			autoLayoutChildren:{
				type: Boolean
			},
			container:{
				type: Boolean
			},
			binding:{
				type: String,
				enum: ['single','multiple']
			},
			resizable:{
				type: mongoose.Schema.Types.Mixed
			},
			properties: [PropertySchema],
			values: {
				type: Object,
				default: {}
			},
			created: Date
		},
		{ 
			id: false,
			toObject: {
				virtuals: true
			}
		}
	);

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
	
	ComponentSchema.virtual('componentId').get(function(){ return this.id; } );
	
	return {name:'Component',schema:ComponentSchema};
};

mongoose.model('Component',module.exports(mongoose).schema);