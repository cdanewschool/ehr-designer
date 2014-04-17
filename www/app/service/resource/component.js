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