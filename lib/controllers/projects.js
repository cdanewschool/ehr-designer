'use strict';

var archiver = require('archiver'),
	_file = require('file'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	path = require('path'),
	Project = mongoose.model('Project'),
	StringStream = require('string-stream'),
	underscore = require('underscore');

var Image = mongoose.model('Image'), ExportType = mongoose.model('ExportType');

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
	//	init Project from request
	var project = req.project;
	project.content = req.body.content;
	project.history = req.body.history;
	project.sharing = req.body.sharing;
	project.updated = Date.now();
	
	//	load existing project before saving and delete any stale page images
	Project.findById(req.project._id).exec
	(
		function(err,data)
		{
			if( err )
				res.json(500,err);
			else
			{
				//	create an array of creation dates (key) of current pages to be saved
				var pageCreationDates = [];
				
				for(var p in req.body.content.children)
					pageCreationDates.push( req.body.content.children[p].created );
				
				//	iterate over old pages (pre save), and delete images for pages whose creation date
				//	does not appear in the list
				for(var p in data.content.children)
				{
					if( pageCreationDates.indexOf( data.content.children[p].created ) == -1 || !project.isPublic() )
					{
						var imagePath = project.imagePath(p);
						
						fs.unlink
						(
							imagePath, 
							function (err) 
							{
								if (err) 
									throw err;
							}
						);
					}
				}
				
				//	finally, save project
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

exports.exportProject = function(req,res)
{
	var exportType = req.params.exportType;
	
	//	load requested export type
	ExportType.find({id:exportType}).exec
	(
		function(err,data)
		{
			//	handle invalid export type
			if( err )
				res.status(404).end();
			
			//	initialize output zip
			var zipFileName = ['export',req.project.id,exportType].join('-') + '.zip';
			res.set('Content-Disposition', 'filename="' + zipFileName + '"');
			
			var dl = archiver('zip');
			dl.pipe(res);
			
			//	path to template files
			var exportRoot = path.join('./lib/export-types/',exportType);
			
			//	handle no template files for export type
			if( !fs.existsSync(exportRoot) )
				res.status(500).end();
			
			var project = req.project;
			var content = JSON.stringify(project.content);
			
			//	since core steps involve async operations, set up sequential processing of files to export 
			//	so streaming to output doesn't happen too soon
			var steps = new Array();
			
			var doNext = function()
			{
				var next = steps.shift();
				
				if( next ) next();
			};
			
			//	array to hold files to be processed
			var fileQueue = [];
			
			//	convert any custom-uploaded image files from mongo to the output file structure
			var getUploadedImages = function()
			{
				//	search output for all dynamic image srcs and extract image ids
				var regex = /"src":"\/image\/\?id=(\w*)/g;
				var match = regex.exec(content);
				
				var imageIds = [];
				var queue = 0;
				
				while (match != null) 
				{
				    var id = match[1];
				    
				    imageIds.push( id );
					
					match = regex.exec(content);
				}
				
				if( !imageIds.length )
					return doNext();
				
				//	init queue so we know when we're done
				queue = imageIds.length;
				
				//	for getting file extension from mime type
				var extensions = {'image/jpeg':'jpg','image/png':'png','image/gif':'gif'};
				
				for(var i in imageIds)
				{
					var id = imageIds[i];
					
					Image.findById(id).exec
					(
						function(err,image)
						{
							var srcPath = "images/" + id + "." + extensions[image.contentType];
							var targetPath = "/www/" + srcPath;
							
							content = content.replace( new RegExp("\\/image\\/\\?id=" + id, "gi"), srcPath );
							
							if( !err )
								fileQueue.push( {path:targetPath,isTemplate:false,contents:image.data} );
							
							queue--;
							
							if( queue == 0 )
								doNext();
						}
					);
				}
			};
			
			//	copies static images from /www/images/default to output file structure
			var copyAssets = function()
			{
				var assetRoot = path.join('./www/images/default');
				
				_file.walkSync
				(
					assetRoot,
					function(dirPath, dirs, files)
					{
						if( files )
						{
							files.forEach
							(
								function(file)
								{
									//	file's path in the template source directory
									var sourcePath = path.join(dirPath,file);
									
									//	file's path in the project export folder
									var targetPath = sourcePath;
									
									var stats = fs.statSync(sourcePath);
									
									if( stats.isFile() )
									{
										fileQueue.push( {path:targetPath,isTemplate:false,contents:fs.createReadStream(sourcePath)} );
									}
								}
							);
						}
					}
				);
				
				doNext();
			};
			
			//	copes template files from template directory for target export type to output file structure
			var copyFiles = function()
			{
				var projectPages = JSON.parse(content).children;
				var projectName = project.content.name;
				
				//	walk all files in project template and push them to an array for processing
				_file.walkSync
				(
					exportRoot,
					function(dirPath, dirs, files)
					{
						if( files )
						{
							files.forEach
							(
								function(file)
								{
									//	file's path in the template source directory
									var sourcePath = path.join(dirPath,file);
									
									//	file's path in the project export folder
									var targetPath = sourcePath;
									targetPath = targetPath.substr( targetPath.indexOf(exportRoot)+exportRoot.length+1 );
									
									var stats = fs.statSync(sourcePath);
									
									if( stats.isFile() )
									{
										//	 those containing ".tpl." in file name
										if( /.tpl./.test(targetPath) )
										{
											var data = fs.readFileSync(sourcePath, {'encoding':'utf8'});
											
											if( /page.tpl./.test(targetPath) )
											{
												for(var p in projectPages)
												{
													var page = projectPages[p];
													
													//	remove the '.tpl.' from exported file name
													var targetPathPage = targetPath.replace( /page.tpl./, page.name + '.' );
													
													fileQueue.push( {path:targetPathPage,isTemplate:true,contents:data,model:page} );
												}
											}
											else
											{
												//	remove the '.tpl.' from exported file name
												targetPath = targetPath.replace( /.tpl./, '.' );
												
												fileQueue.push( {path:targetPath,isTemplate:true,contents:data,model:{id:project._id,date:new Date(),name:projectName,pages:projectPages,exportType:exportType}} );
											}
										}
										else
										{
											fileQueue.push( {path:targetPath,isTemplate:false,contents:fs.createReadStream(sourcePath)} );
										}
									}
								}
							);
						}
					}
				);
				
				doNext();
			};
			
			var process = function()
			{
				//	compile each entry in fileQueue
				var queue = fileQueue.length;
				
				for(var f in fileQueue)
				{
					var file = fileQueue[f];
					
					if( file.isTemplate )
					{
						var compile = underscore.template(file.contents);
						var compiled = compile( {model:file.model,templateFn:compile} );
						
						dl.append( new StringStream(compiled), {name: file.path } );
					}
					else
					{
						dl.append( file.contents, {name: file.path } );
					}
					
					queue--;
					
					if( queue == 0 )
					{
						dl.finalize
						(
							function (err) 
							{
								if (err) 
									res.status(500).end();
								
								doNext();
							}
						);
					}
				}
			};
			
			steps = [getUploadedImages,copyAssets,copyFiles,process];
			
			doNext();
		}
	);
};