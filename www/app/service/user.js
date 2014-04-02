app.factory
(
	'User',
	function($resource)
	{
		return $resource
		(
			'http://localhost:3000/auth/users/:id',{},
			{
				'update': {
					method:'PUT'
				}
			}
		);
	}
);