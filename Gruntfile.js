module.exports = function(grunt)
{
	grunt.initConfig
	(
		{
			/*
			 * build 
			 */
			shell:
			{
				build: {
					command: [
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
						'www/index.html': 'dist/index.tpl.html'
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
	
	grunt.loadNpmTasks('grunt-include-source');
	grunt.loadNpmTasks('grunt-ng-constant');
	grunt.loadNpmTasks('grunt-shell');
	
	grunt.registerTask
	(
		'default', 
		[
		 	'includeSource',
	   		'ngconstant:' + (grunt.option('environment')||'development'),
	   		'shell:build'
	    ]
	);
};