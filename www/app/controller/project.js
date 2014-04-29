app.controller
(
	'ProjectCtrl',
	[
	 	'$scope','$rootScope','Project','canvas',
	 	function($scope,$rootScope,Project,canvas)
	 	{
	 		$scope.canvas = canvas;
	 		
	 		$scope.find = function()
	 		{
	 			Project.query
	 			(
	 				{
	 					userId: $rootScope.currentUser._id
	 				},
	 				function(response)
	 				{
	 					$scope.projects = response;
	 				}
	 			);
	 		};
	 	}
	 ]
	
);