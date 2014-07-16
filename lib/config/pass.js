'use strict';

/**
 * PassportJS configuration
 * 
 * Consult the following url for configuration info:
 * http://passportjs.org/guide/configure/
 */

var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User');

passport.serializeUser
(
	function(user, done) 
	{
		done(null, user._id);
	}
);

passport.deserializeUser
(
	function(id, done) 
	{
		User.findOne
		(
			{_id:id}, 
			function(err, user) 
			{
				done(err, user);
			}
		);
	}
);

passport.use
(
	new LocalStrategy
	(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) 
		{
			User.findOne
			(
				{ 
					email: email 
				}, 
				function (err, user) 
				{
					if (err) { return done(err); }
					
					if (!user) 
					{
						return done
						(
							null, false, 
							{ 
								'errors': {
									'email': { message: 'We don\'t recognize this email' }
								}
							}
						);
					}
					
					if (!user.authenticate(password)) 
					{
						return done
						(
							null, false, 
							{ 
								'errors': {
									'password': { message: 'Invalid email/password combination' }
								}
							}
						);
					}
					
					return done(null, user);
				}
			);
		}
	)
);