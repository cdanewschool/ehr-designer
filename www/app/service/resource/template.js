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