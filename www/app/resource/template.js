/**
 * Template
 * 
 * A resource that represents a temmplate applied to the root of a project page
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'Template',
	function($resource)
	{
		return $resource
		(
			'api/templates/',{},{'get':{isArray:true}}
		);
	}
);