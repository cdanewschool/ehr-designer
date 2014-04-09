app.service
(
	'DataService',
	[
	 	'$http',
	 	function($http)
	 	{
	 		return {
	 			getComponents:function()
	 			{
	 				return $http.get("json/components.json");
	 			},
	 			getSampleData:function()
	 			{
	 				return $http.get("json/sample-data.json");
	 			}
	 		};
	 	}
	 ]
);