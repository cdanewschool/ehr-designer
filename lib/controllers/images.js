'use strict';

var busboy = require('connect-busboy'),
	mongoose = require('mongoose'),
	Image = mongoose.model('Image'),
	fs = require('fs');

exports.image = function(req,res,next,id)
{
	Image.load
	(
		id,
		function(err,image)
		{
			if( err ) return next(err);
			if( !image ) return next(new Error("Failed to load image" + id));
			
			req.image = image;
			
			next();
		}
	);
};

exports.destroy = function(req,res)
{
	var image = req.image;
	
	image.remove
	(
		function(err)
		{
			if( err )
				res.status(500).json(err);
			else
				res.json(image);
		}
	);
};

exports.all = function(req,res)
{
	var query = {};
	
	if( req.user )
		query['creator'] = req.user._id;
	
	Image.find(query).exec
	(
		function(err,images)
		{
			for(var i in images)
				images[i] = images[i].toObject();
			
			if( err )
				return res.status(500).json(err);
			else
				return res.json(images);
		}
	);
};

exports.create = function(req,res)
{
	var mimeType = null;
	
	req.busboy.on
	(
		'file',
		function(fieldname, file, filename, encoding, mimetype) 
		{
			mimeType = mimetype;
			
			file.fileRead = [];
			
			file.on
		    (
		    	'data', 
		    	function (chunk) 
		    	{
		    		this.fileRead.push(chunk);
		    	}
		    );
			
			file.on
		    (
		    	'end', 
		    	function (chunk) 
		    	{
		    		if( file.truncated )
		    		{
		    			res.status(413).end();
		    			return;
		    		}
		    		
		    		var data = Buffer.concat(this.fileRead);
		    		
		    		Image.findOne({data:data,creator:req.user._id}).exec
		    		(
		    			function(err,image)
		    			{
		    				if( image )
		    					return res.status(409).end();
		    				
		    				var image = new Image();
		    				image.creator = req.user;
		    				image.data = data;
		    				image.contentType = mimeType;
		    				image.save
		    				(
		    					function(err)
		    					{
		    						if( err )
		    							res.status(500).json(err);
		    						else
		    						{
		    							res.status(200).json(image);
		    						}
		    					}
		    				);
		    			}
		    		);
		    	}
		    );
		}
	);
	
	req.pipe(req.busboy);
};

exports.show = function(req,res)
{
	Image.findById(req.query.id).exec
	(
		function(err,image)
		{
			if( err )
				res.status(500).end(500);
			else if( !image )
				res.status(404).end();
			else
			{
				res.contentType(image.contentType);
			    res.status(200).send(image.data);
			}
		}
	);
};