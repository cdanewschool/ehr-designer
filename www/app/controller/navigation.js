app.controller
(
	'NavigationCtrl',
	[
	 	'$scope','$location','canvas',
		function($scope,$location,canvas)
		{
	 		$scope.location = $location;
	 		$scope.canvas = canvas;
	 		
	 		$scope.navigation =
				[
				 	{title:"My Projects",url:"/myprojects"},
				 	{title:"About",url:"/about"}
				 ];
	 		
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
		}
	 ]
);