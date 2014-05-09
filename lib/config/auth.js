'use strict';

exports.ensureAuthenticated = function ensureAuthenticated(req,res,next)
{
	if( req.isAuthenticated() ) return next();
	
	res.send(401);
};

exports.project = 
{
	hasAuthorization: function(req,res,next)
	{
		if( req.project.sharing !== "public"
			&& (!req.user || req.project.creator._id.toString() !== req.user._id.toString()) )
			return res.send(403);
		
		next();
	}
};

exports.image = 
{
	hasAuthorization: function(req,res,next)
	{
		if( !req.user || req.image.creator._id.toString() !== req.user._id.toString() )
			return res.send(403);
		
		next();
	}
};