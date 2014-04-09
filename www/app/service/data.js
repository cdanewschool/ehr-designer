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
	 				return $http.get("components.json");
	 			},
	 			getSampleData:function()
	 			{
	 				return $http.get("sample-data.json");
	 			}
	 		};
	 	}
	 ]
);