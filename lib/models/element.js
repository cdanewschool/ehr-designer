'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var PropertyValueSchema = mongoose.Schema
	(
		{
			label: {
				type: mongoose.Schema.Types.Mixed,
				required: true
			},
			value: {
				type: mongoose.Schema.Types.Mixed,
				required: true
			}
		},
		{
			_id: false,
			id: false
		}
	);
	
	var PropertySchema = mongoose.Schema
	(
		{
			id: {
				type: String,
				required: true
			},
			type: {
				type: String,
				enum: ['string','int','boolean','object','array','enum','color']
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
				type: [PropertyValueSchema]
			},
			max: {
				type: Number
			},
			min: {
				type: Number
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
	
	var ElementSchema = mongoose.Schema
	(
		{
			id: {
				type: String,
				index: { unique: true },
				required: true
			},
			name:{
				type: String,
				required: true
			},
			category:{
				type: String
			},
			abstract:{
				type: Boolean
			},
			container:{
				type: mongoose.Schema.Types.Mixed
			},
			binding: {
				
				type: {
					dataType: {
						type: String
					},
					fields: {
						type: [mongoose.Schema.Types.Mixed]
					}
				}
				
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
			minimize: false,
			toObject: {
				virtuals: true
			}
		}
	);

	ElementSchema.pre
	(
		'save',
		function(next)
		{
			if( this.isNew )
				this.created = Date.now();
			
			next();
		}
	);
	
	ElementSchema.virtual('componentId').get(function(){ return this.id; } );
	
	return {name:'Element',schema:ElementSchema};
};

mongoose.model('Element',module.exports(mongoose).schema);