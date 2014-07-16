'use strict';

var mongoose = require('mongoose'),
	Project = mongoose.model('Project');

exports.project = function(req,res,next,id)
{
	Project.load
	(
		id,
		function(err,project)
		{
			if( err ) return next(err);
			if( !project ) return next(new Error("Failed to load project" + id));
			
			req.project = project;
			next();
		}
	);
};

exports.create = function(req,res)
{
	var project = new Project(req.body);
	project.creator = req.user;
	
	project.save
	(
		function(err)
		{
			if( err )
				res.json(500,err);
			else
			{
				project.screenshot(req);
				
				res.json(project);
			}
		}
	);
};

exports.update = function(req,res)
{
	var project = req.project;
	project.content = req.body.content;
	project.history = req.body.history;
	project.sharing = req.body.sharing;
	project.updated = Date.now();
	
	project.save
	(
		function(err)
		{
			if( err )
				res.json(500,err);
			else
			{
				project.screenshot(req);
				
				res.json(project);
			}
		}
	);
};

exports.destroy = function(req,res)
{
	var project = req.project;
	
	project.remove
	(
		function(err)
		{
			if( err )
				res.json(500,err);
			else
				res.json(project);
		}
	);
};

exports.all = function(req,res)
{
	var query = 
	{
		sharing:'public'
	};
	
	var fields = 'content created creator imagePath title updated';
	
	if( req.query.userId )
	{
		query = 
		{
			creator: req.query.userId
		};
		
		fields = '';
	}
	
	Project.find( query, fields ).populate('creator','_id nameFirst nameLast').exec
	(
		function(err,projects)
		{
			if( err )
				res.json(500,err);
			else
				res.json(projects);
		}
	);
};

exports.show = function(req,res)
{
	var query = {};
	
	if( req.params.projectId )
	{
		query['_id'] = req.params.projectId;
	}
	
	Project.findOne(query).populate('creator','_id nameFirst nameLast').exec
	(
		function(err,project)
		{
			if( err )
				res.json(500,err);
			else
				res.json( project.toObject() );
		}
	);
};