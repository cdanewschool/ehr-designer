/**
 * Component
 * 
 * A resource that represents a complex component made up of multiple Elements
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'Component',
	function($resource)
	{
		return $resource
		(
			'api/components/',{},{'get':{isArray:true}}
		);
	}
);