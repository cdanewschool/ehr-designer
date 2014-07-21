/**
 * Application Controller
 */
app.controller
(
	'AppCtrl',
	[
	 	'$scope','$rootScope','$location','$http','navigation','canvas','Auth','ENV',
		function($scope,$rootScope,$location,$http,navigation,canvas,Auth,ENV)
		{
	 		$scope.location = $location;
	 		$scope.canvas = canvas;
	 		
	 		$scope.title = "EHR Designer";
	 		$scope.revision = null;
	 		$scope.debug = ENV.DEBUG;
	 		
	 		if( $scope.debug )
	 		{
	 			$http.get("version.json").then
	 			(
	 				function(response)
	 				{
	 					$scope.revision = response.data.revision;
	 				}
	 			);
	 		}
	 		
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
			
			/**
			 * Logs the user out, prompting a save if the canvas is dirty
			 */
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