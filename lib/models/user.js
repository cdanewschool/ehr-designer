var crypto = require('crypto'),
	mongoose = require('mongoose');

module.exports = function(mongoose)
{
	var UserSchema = mongoose.Schema
	(
		{
			email: {
				type: String,
				unique: true,
				required: 'Email is required'
			},
			hashedPassword: String,
			provider: String,
			salt: String
		}
	);
	
	UserSchema
		.virtual('password')
		.set
		(
			function(password)
			{
				this._password = password;
				this.salt = this.makeSalt();
				this.hashedPassword = this.encryptPassword(password);
			}
		)
		.get
		(
			function()
			{
				return this._password;
			}
		);
	
	UserSchema
		.virtual('info')
		.get
		(
			function()
			{
				return {'_id':this._id,'email':this.email};
			}
		);
	
	var validatePresenceOf = function(value)
	{
		return value && value.length;
	};
	
	UserSchema.path('email').validate
	(
		function(email)
		{
			var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			return emailRegex.test(email);
		}, 'The specified email is invalid'
	);
	
	UserSchema.path('email').validate
	(
		function(email,respond)
		{
			mongoose.models['User'].findOne
			(
				{
					email:email
				},
				function(err,user)
				{
					if( err ) throw err;
					if( user ) return respond(false);
					
					respond(true);
				}
			);
		}, 'The specified email is already in use'
	);
	
	UserSchema.methods = 
	{
		authenticate: function(password)
		{
			return this.encryptPassword(password) === this.hashedPassword;
		},
		
		makeSalt: function()
		{
			return crypto.randomBytes(16).toString('base64');
		},
		
		encryptPassword: function(password)
		{
			if( !password || !this.salt ) return '';
			
			var salt = new Buffer(this.salt, 'base64');
			return crypto.pbkdf2Sync(password,salt,10000,64).toString('base64');
		}
	};
	
	return {name:'User',schema:UserSchema};
};

mongoose.model('User',module.exports(mongoose).schema);