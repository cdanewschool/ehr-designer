'use strict';

var cssParse = require('css-parse'),
	mongoose = require('mongoose'),
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
	ProjectSchema.virtual('thumbnail').get
	( 
		function()
		{ 
			return this.imagePath(true);
		}
	);
	
	ProjectSchema.methods = 
		{
			imagePath: function(relative)
			{
				var basePath = path.join(process.cwd(),'www');
				var imagePath = path.join(__dirname,'..','..','www','images','projects',this._id + '.png');
				
				return relative ? imagePath.substr(imagePath.indexOf(basePath)+basePath.length) : imagePath;
			},
			
			screenshot: function()
			{
				//	if saved project is public, screenshot
				if( this.sharing == "public" )
				{
					//	load css to get size attributes of #project-preview declaration
					var css = '';
					
					var stream = fs.createReadStream(path.join(__dirname,"..","..","www","css","style.css"));
					stream.on( 'data',function(chunk){ css += chunk; } );
					
					var project = this;
					
					stream.on
					(
						'end',
						function()
						{
							var parsedCss = cssParse(css);
							
							var options = {left:0,top:0,width:1000,height:800};
							
							for(var r in parsedCss.stylesheet.rules)
							{
								if( parsedCss.stylesheet.rules[r].type != 'rule' ) continue;
								
								if( parsedCss.stylesheet.rules[r].selectors.indexOf('#project-preview')>-1 )
								{
									var declarations = parsedCss.stylesheet.rules[r].declarations;
									
									for(var d in declarations)
										if( options.hasOwnProperty(declarations[d].property) )
											options[declarations[d].property] = parseInt( declarations[d].value.replace(/[a-z]+/ig,'') );
								}
							}
							
							//	TODO: fix
							//	offset declarations a bit
							options.top += 75;
							options.left += 21;
							
							//	screenshot
							webshot
							(
								'http://localhost:3000/browse/' + project._id, 
								project.imagePath(),
								{ shotSize: {width:options.width,height:options.height}, shotOffset: {left:options.left,top:options.top} },
								function(err) 
								{
									console.log(err);
								}
							);
						}
					);
				}
			}
		};
	
	return {name:'Project',schema:ProjectSchema};
};

mongoose.model('Project',module.exports(mongoose).schema);