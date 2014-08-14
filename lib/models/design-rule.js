'use strict';

var mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var PreconditionSchema = mongoose.Schema
	(
		{
			type: {
				type: String,
				enum: ['property','proximity'],
				required: true
			},
			property: {
				name: {
					type: String,
					required: true
				},
				type: {
					type: String,
					required: false
				},
				value: {
					type: mongoose.Schema.Types.Mixed,
					required: false
				}
			},
			modifier: {
				type: String,
				enum: ['equals','lessthan','lessthanorequalto','greaterthan','greaterthanorequalto','inside','outside']
			}
		},
		{ 
			_id: false
		}
	);
	
	var ResolutionActionSchema = mongoose.Schema
	(
		{
			type: {
				type: String,
				enum: ['property']
			},
			value: {
				property: {
					type: String,
					required: true
				},
				value: {
					type: mongoose.Schema.Types.Mixed,
					required: true
				}
			}
		},
		{ 
			_id: false
		}
	);
	
	var DesignRuleSchema = mongoose.Schema
	(
		{
			preconditions: {
				type: [PreconditionSchema],
				required: true
			},
			message: {
				title: {
					type: String,
					required: true
				},
				description: {
					type: String
				}
			},
			level: {
				type: Number
			},
			resolution: {
				actions: {
					type: [ResolutionActionSchema],
					required: true
				},
				summary: {
					type: String
				}
			}
		}
	);
	
	return {name:'DesignRule',schema:DesignRuleSchema};
};

mongoose.model('DesignRule',module.exports(mongoose).schema);