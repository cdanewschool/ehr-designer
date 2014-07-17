/**
 * Element
 * 
 *  A resource that represents the most granular elements of a UI, such as a piece of text, button, etc.
 *  
 *  See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'Element',
	function($resource)
	{
		return $resource
		(
			'api/elements/',{},{'get':{isArray:true}}
		);
	}
);