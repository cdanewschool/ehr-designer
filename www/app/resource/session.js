/**
 * Session
 * 
 * A resource that represents a user session
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'Session',
	function($resource)
	{
		return $resource
		(
			'auth/session/'
		);
	}
);