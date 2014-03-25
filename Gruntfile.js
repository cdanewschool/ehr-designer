module.exports = function(grunt)
{
	grunt.initConfig
	(
		{
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
						'index.html': 'dist/index.tpl.html'
					}
				}
			}
		}
	);
	
	grunt.loadNpmTasks('grunt-include-source');
	
	grunt.registerTask
	(
		'default', 
		[
	   		'includeSource'
	    ]
	);
}