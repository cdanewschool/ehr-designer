/**
 * Export Type
 * 
 * A resource that represents a supported export type
 * 
 * See /lib/config/routes for supported operations for this resource
 */
app.factory
(
	'ExportType',
	function($resource)
	{
		return $resource
		(
			'api/export-types/',{},{'get':{isArray:true}}
		);
	}
);