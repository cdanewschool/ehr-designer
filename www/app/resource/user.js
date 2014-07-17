/**
 * User
 * 
 * A resource that represents a complex component made up of multiple Elements
 * 
 * See /lib/config/routes for supported operations for this resource
 * 
 */
app.factory
(
	'User',
	function($resource)
	{
		return $resource
		(
			'auth/users/:id',{},
			{
				'update': {
					method:'PUT'
				}
			}
		);
	}
);