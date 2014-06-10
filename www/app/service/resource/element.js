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