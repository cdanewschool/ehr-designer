'use strict';

var mongoose = require('mongoose'),
	fs = require('fs'),
	path = require('path'),
	webshot = require('webshot');

module.exports = function(mongoose)
{
	var ProjectSchema = mongoose.Schema
	(
		{
			creator: {
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User',
				required: true
			},
			content: {
				type: Object,
				required: true
			},
			sharing: {
				type: String,
				enum: ["private","public"],
				default: "private"
			},
			history: String,
			created: Date,
			updated: Date
		},
		{
			toJSON: {
				virtuals: true
			},
			toObject: {
				virtuals: true
			}
		}
	);

	ProjectSchema.pre
	(
		'save',
		function(next,done)
		{
			if( this.isNew)
				this.created = Date.now();
			
			this.updated = Date.now();
			
			next();
		}
	);

	ProjectSchema.statics = 
	{
		load: function(id,cb)
		{
			this.findOne
			(
				{
					_id: id
				}	
			)
			.populate('creator','username').exec(cb);
		}
	};
	
	ProjectSchema.virtual('_isNew').get( function(){ return this.isNew; } );
	ProjectSchema.virtual('title').get( function(){ return this.content && this.content.name ? this.content.name : "untitled"; } );
	ProjectSchema.virtual('thumbnails').get
	( 
		function()
		{
			var thumbnails = [];
			
			for(var i=0;i<this.content.children.length;i++)
			{
				thumbnails.push( this.imagePath(i,true) )
			}
			
			return thumbnails;
		}
	);
	
	ProjectSchema.methods = 
		{
			isPublic: function()
			{
				return this.sharing == "public";
			},
			
			imagePath: function(pageIndex,relative)
			{
				var basePath = path.join(process.cwd(),'www');
				var imagePath = path.join(__dirname,'..','..','www','images','projects',this._id + '-' + pageIndex + '.png');
				
				return relative ? imagePath.substr(imagePath.indexOf(basePath)+basePath.length) : imagePath;
			},
			
			screenshot: function(req)
			{
				//	if saved project is public, screenshot
				if( this.sharing == "public" )
				{
					//	load css to get size attributes of #project-preview declaration
					var css = '';
					
					var stream = fs.createReadStream(path.join(__dirname,"..","..","webshot.css"));
					stream.on( 'data',function(chunk){ css += chunk; } );
					
					var project = this;
					
					stream.on
					(
						'end',
						function()
						{
							var options = {left:105,top:70,width:1280,height:1050};
							
							for(var pageIndex=0;pageIndex<project.content.children.length;pageIndex++)
							{
								var url = 'http://' + req.get('host') + '/browse/' + project._id + '/' + (pageIndex+1);
								
								//	screenshot
								webshot
								(
									url, 
									project.imagePath(pageIndex),
									{ 
										windowSize: 
										{
											width: options.width,
											height: options.height
										}, 
										shotOffset: 
										{
											left: options.left,
											top: options.top
										},
										customCSS: css,
										userAgent: req.headers['user-agent']
									},
									function(err) 
									{
										if( err )
											console.log(err);
									}
								);
							}
						}
					);
				}
			}
		};
	
	return {name:'Project',schema:ProjectSchema};
};

mongoose.model('Project',module.exports(mongoose).schema);