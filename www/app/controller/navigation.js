app.controller
(
	'NavigationCtrl',
	[
	 	'$scope','$location',
		function($scope,$location)
		{
	 		$scope.location = $location;
	 		
	 		$scope.navigation =
				[
				 	{title:"My Projects",url:"/myprojects"},
				 	{title:"Editor",url:"/editor"},
				 	{title:"About",url:"/about"}
				 ];
	 	
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
		}
	 ]
);