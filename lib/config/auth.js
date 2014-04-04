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
			if( req.project.creator._id.toString() !== req.user._id.toString() )
			{
				return res.send(403);
			}
			next();
		}
	};