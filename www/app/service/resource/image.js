app.factory
(
	'Image',
	function($resource)
	{
		return $resource
		(
			'api/images/:imageId',
			{},
			{
				'get':{isArray:true},
				'post': {transformRequest: angular.identity}
			}
		);
	}
);