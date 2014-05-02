app.controller
(
	'NavigationCtrl',
	[
	 	'$scope','$location','canvas',
		function($scope,$location,canvas)
		{
	 		$scope.location = $location;
	 		$scope.canvas = canvas;
	 		
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
		}
	 ]
);