/**
 * Project
 * 
 * A resource that represents a user project
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'Project',
	function($resource)
	{
		return $resource
		(
			'api/projects/:projectId',{},
			{
				'update': {
					method:'PUT'
				}
			}
		);
	}
);