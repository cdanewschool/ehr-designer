'use strict';

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
			nameFirst: {
				type: String,
				default: '',
				required: 'First name is required'
			},
			nameLast: {
				type: String,
				default: '',
				required: 'Last name is required'
			},
			hashedPassword: {
				type: String,
				default: ''
			},
			provider: String,
			salt: String,
			confirmed: {
				type: Boolean,
				default: false
			}
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
		.virtual('passwordConfirm')
		.set
		(
			function(password)
			{
				this._passwordConfirm = password;
			}
		)
		.get
		(
			function()
			{
				return this._passwordConfirm;
			}
		);
		
	UserSchema
		.virtual('info')
		.get
		(
			function()
			{
				return {'_id':this._id,'email':this.email,'nameFirst':this.nameFirst,'nameLast':this.nameLast,'confirmed':this.confirmed};
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
		}, 
		'The specified email is invalid'
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
		}, 
		'The specified email is already in use'
	);
	
	UserSchema.path('hashedPassword').validate
	(
		function(v,done)
		{
			var passwordMinLength = 4;
			
			if( !this._password )
				this.invalidate('password', 'Password is required');
			
			if( !this._passwordConfirm )
				this.invalidate('passwordConfirm', 'Password confirmation is required');
			
			if( this._password && this._password.length<passwordMinLength )
				this.invalidate('password', 'Password must be at least ' + passwordMinLength + ' characters');
			
			if( this._password && this._password.length<passwordMinLength )
				this.invalidate('password', 'Password must be at least ' + passwordMinLength + ' characters');
			
			if( this._password != this._passwordConfirm )
				this.invalidate('passwordConfirm', 'Passwords don\'t match');
			
			done( true );
			
		}, null
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