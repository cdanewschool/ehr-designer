module.exports = function(grunt)
{
	grunt.registerTask
	(
		'get-revision', 
		'Get the current build revision', 
		function () 
		{
			grunt.event.once
			(
				'git-describe', 
				function (rev) 
				{
					grunt.log.writeln(rev);
					grunt.option('gitLastCommit', rev.object);
				}
			);
			
			grunt.task.run('git-describe');
		}
	);
	
	grunt.registerTask
	(
		'tag-revision', 
		'Tag the current build revision', 
		function () 
		{
			grunt.task.requires('git-describe');

			grunt.file.write
			(
				'www/version.json', 
				JSON.stringify
				(
					{
						revision: grunt.option('gitLastCommit')
					}
				)
			);
		}
	);
	
	grunt.initConfig
	(
		{
			pkg: grunt.file.readJSON('package.json'),
			'git-describe':
			{
				options:
			    {
			    },
			    me:{}
			},
			
			/*
			 * build 
			 */
			shell:
			{
				build: {
					command:  [
					           'npm install',
					           'grunt html2js',
					           'grunt build:accordion:collapse:dropdownToggle:modal:tabs:tooltip'
					           ].join('&&'),
					options: {
						execOptions: {
							cwd: 'www/bower_components/angular-ui-bootstrap/'
						},
						failOnError:true,
						stdout:true,
						stderror:true
					}
					
				}
			},
			
			includeSource:
			{
				options:
				{
				    templates: 
				    {
				    	html: 
				    	{
				    		js: '<script type="text/javascript" src="{filePath}"></script>',
				    		css: '<link rel="stylesheet" href="{filePath}">',
				    	}
				    }
				},
				default: 
				{
					files: 
					{
						'www/index.html': 'template/index.tpl.html'
					}
				}
			},
			
			ngconstant:
			{
				options: 
				{
					name: 'config',
					dest: 'www/app/config.js',
					wrap: '"use strict";\n\n {%= __ngModule %}'
				},
				
				development: 
				{
					constants: 
					{
						ENV: {
							 DEBUG: 'true'
						}
					 }
				 },
				 
				 production: 
				 {
					 constants: 
					 {
						 ENV: {
							 DEBUG: 'false'
						 }
					 }
				 }
			}
		}
	);
	
	grunt.loadNpmTasks('grunt-git-describe');
	grunt.loadNpmTasks('grunt-include-source');
	grunt.loadNpmTasks('grunt-ng-constant');
	grunt.loadNpmTasks('grunt-shell');	
	
	grunt.registerTask('version',['get-revision','tag-revision']);
	
	grunt.registerTask
	(
		'default', 
		[
		 	'version',
		 	'includeSource',
	   		'ngconstant:' + (grunt.option('environment')||'development'),
	   		'shell:build'
	    ]
	);
};