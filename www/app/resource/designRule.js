/**
 * Design Rule
 * 
 * A resource that represents a design rule
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'DesignRule',
	function($resource)
	{
		return $resource
		(
			'api/design-rules/',{},{'get':{isArray:true}}
		);
	}
);