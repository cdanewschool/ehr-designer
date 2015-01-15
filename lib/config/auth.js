'use strict';

/**
 * Authorization-related middleware
 */

/*
 * middleware for requiring an authenticated user
 */
exports.ensureAuthenticated = function ensureAuthenticated(req,res,next)
{
	if( req.isAuthenticated() ) return next();
	
	//res.send(401);
	res.status(401).end();
};

/*
 * middleware for requiring the request's user is authorized to view the request's project
 */
exports.project = 
{
	hasAuthorization: function(req,res,next)
	{
		//	deny auth for non-public projects if there is no auhorized user or the authorized 
		//	user is not the project creator
		if( req.project.sharing !== "public"
			&& (!req.user || req.project.creator._id.toString() !== req.user._id.toString()) )
			//return res.send(403);
			return res.status(403).end();
		
		next();
	}
};

/*
 * middleware for requiring the request's user is authorized to view the requested image
 */
exports.image = 
{
	hasAuthorization: function(req,res,next)
	{
		//	deny auth if there is no auhorized user or the authorized user is not theimage owner
		if( !req.user || req.image.creator._id.toString() !== req.user._id.toString() )
			//return res.send(403);
			return res.status(403).end();
		next();
	}
};