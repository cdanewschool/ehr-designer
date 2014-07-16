'use strict';

var mongoose = require('mongoose'),
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
				res.json(500,err);
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
				return res.json(500,err);
			else
				return res.json(images);
		}
	);
};

exports.create = function(req,res)
{
	var data = fs.readFileSync(req.files.file.path);
	
	Image.findOne({data:data,creator:req.user._id}).exec
	(
		function(err,image)
		{
			if( image )
				return res.json(409,{error:"Image already exists"});
			
			var image = new Image();
			image.creator = req.user;
			image.data = data;
			image.contentType = req.files.file.type;
			image.save
			(
				function(err)
				{
					if( err )
						res.json(500,err);
					else
					{
						res.json(image);
					}
				}
			);
		}
	);
	
	
};

exports.show = function(req,res)
{
	Image.findById(req.query.id).exec
	(
		function(err,image)
		{
			if( err )
				res.send(500);
			else if( !image )
				res.send(404);
			else
			{
				res.contentType(image.contentType);
		        res.send(image.data);
			}
		}
	);
};