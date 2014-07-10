app.service
(
	'DataService',
	[
	 	'$http',
	 	function($http)
	 	{
	 		return {
	 			getSampleData:function()
	 			{
	 				return $http.get("json/sample-data.json");
	 			}
	 		};
	 	}
	 ]
);