'use strict';

var mongoose = require('mongoose'),
	uuid = require('node-uuid');

module.exports = function(mongoose)
{
	var VerificationTokenSchema = mongoose.Schema
	(
		{
			_userId: {
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: 'User'
			},
			token: {
				type: String,
				required: true
			},
			createdAt: {
				type: Date,
				required: true,
				default: Date.now,
				expires: '4h'
			}
		}
	);
	
	VerificationTokenSchema
		.virtual('userId')
		.set
		(
			function(id)
			{
				this._userId = id;
			}
		)
		.get
		(
			function()
			{
				return this._userId;
			}
		);

	VerificationTokenSchema.methods.createToken = function(done)
	{
		var token = uuid.v4();
		
		this.set('token',token);
		
		this.save
		(
			function(err)
			{
				if( err ) 
					return done(err);
				
				return done(null,token);
			}
		);
	}
	
	return {name:'VerificationToken',schema:VerificationTokenSchema};
}

mongoose.model('VerificationToken',module.exports(mongoose).schema);