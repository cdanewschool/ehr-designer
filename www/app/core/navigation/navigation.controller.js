app.controller
(
	'NavigationCtrl',
	[
	 	'$scope','$rootScope','$location','navigation','canvas','Auth',
		function($scope,$rootScope,$location,navigation,canvas,Auth)
		{
	 		$scope.location = $location;
	 		$scope.canvas = canvas;
	 		
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
			
			$scope.logout = function()
			{
				var logout = function()
				{
					Auth.logout
					(
						function(err)
						{
							if( !err )
								$location.path('/');
						}
					);
				};
				
				if( !canvas.dirty )
				{
					logout();
				}
				else
				{
					navigation.showConfirm("You have unsaved changes. Do you want to Save?").then
					(
						function()
						{
							$rootScope.$emit
							(
								"saveProject",
								[
								 function()
								 {
									 canvas.dirty = false;
									 canvas.currentProject = null;
									 
									 logout();
								 }
								]
							);	
							
						},
						function()
						{
							canvas.dirty = false;
							canvas.currentProject = null;
							
							logout();				
						}
					);
				}
			};
		}
	 ]
);