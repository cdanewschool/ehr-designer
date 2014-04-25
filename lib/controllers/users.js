'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passport = require('passport'),
	VerificationToken = mongoose.model('VerificationToken'),
	config = require('../config/config')

exports.create = function(req,res,next)
{
	var user = new User(req.body);
	user.provider = "local";
	
	user.save
	(
		function(err)
		{
			if( err ) return res.json(400,err);
			
			//	send confirmation email if configured properly
			if( config.confirmAccounts
				&& config.mandrill
				&& config.mandrill.apiKey )
			{
				var mandrill = require('node-mandrill')(config.mandrill.apiKey);
				
				var token = new VerificationToken();
				token.userId = user._id;
				
				token.createToken
				(
					function(err,verificationToken)
					{
						if( err ) return res.json(400,err);
						
						var confirmUrl = req.protocol + "://" + req.get('host') + "/auth/users/verify/" + verificationToken;
						
						mandrill
						(
							'/messages/send', 
							{
								message: 
								{
							        to: [
							             {
							            	 email: user.email, 
							            	 name: user.name
							             }
							             ],
							        from_email: 'no-reply@ehr-designer.com',
							        subject: "EHR Designer - Confirm your account",
							        text: "Please confirm your account by clicking the link below:\n\n" + confirmUrl
							    }
							},
							function(err, response)
							{
								if( err ) return res.json(400,err);
								
								return res.json(user.info);
							}
						);
					}
				);
			}
			else
			{
				User.update
				(
					user,
					{
						confirmed:true
					},
					function(err)
					{
						if( err ) return res.json(400,err);
						
						User.findOne( {_id:user._id} ).exec
						(
							function(err,user)
							{
								if( err ) return res.json(400,err);
								
								return res.json(user.info);
							}
						);
					}
				);
			}
		}
	);
};

exports.verify = function(req,res,next)
{
	if( req.params.token )
	{
		VerificationToken.findOne( {token:req.params.token} ).exec
		(
			function(err,token)
			{
				if( !token ) 
					return res.redirect("/login?error=Invalid or expired token");
				
				User.findOne( {_id:token._userId} ).exec
				(
					function(err,user)
					{
						if( !user ) 
							return res.redirect("/login?error=No user could be found for this confirmation");
						
						if( user.confirmed )
							return res.redirect("/login?success=It looks like you've already confirmed. Please login.");
						
						User.update
						(
							user,
							{
								confirmed:true
							},
							function(err)
							{
								if( err )
									return res.redirect("/login?error="+err);
								
								return res.redirect("/login?success=Account confirmed. Please login.");
							}
						);
					}
				);
				
			}
		);
	}
};