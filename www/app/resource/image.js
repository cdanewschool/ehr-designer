/**
 * Image
 * 
 * A resource that represents a user-uploaded image
 * 
 * See /lib/config/routes for supported operations for this resource
 */
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