'use strict';

var mongoose = require('mongoose'),
	passport = require('passport');

exports.session = function(req,res)
{
	res.json(req.user.info);
};

exports.login = function(req,res,next)
{
	var options = 
	{
		badRequestMessage: 'Invalid email/password combination'
	};
	
	passport.authenticate
	(
		'local',
		options,
		function(err,user,info)
		{
			var error = err || info;
			
			if( error ) 
				return res.status(400).json(error);
			
			if( user.confirmed === false ) 
				return res.status(400).json({message:'Please confirm your account before logging in.'});
			
			req.logIn
			(
				user,
				function(err)
				{
					if( err ) return res.send(err);
					
					res.json(req.user.info);
				}
			);
		}
	)(req, res, next);
};

exports.logout = function(req,res,next)
{
	if( req.user )
	{
		req.logout();
		res.status(200).end();
	}
	else
	{
		res.status(400).send("Not logged in");
	}
};