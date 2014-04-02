'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passport = require('passport');

exports.create = function(req,res,next)
{
	var user = new User(req.body);
	user.provider = "local";
	
	user.save
	(
		function(err)
		{
			if( err )
				return res.json(400,err);
			
			req.logIn
			(
				user,
				function(err)
				{
					if( err )
						return next(err);
					
					return res.json(user.info);
				}
			);
		}
	);
};