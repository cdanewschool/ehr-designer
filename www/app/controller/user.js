app.controller
(
	'UserCtrl',
	
	function($rootScope,$scope,$location,$routeParams,Auth,navigation,canvas)
	{
		$scope.success = null;
		$scope.error = null;
		
		$scope.errors = {};
		$scope.user = {};
		
		if( $routeParams )
		{
			if( $routeParams.success )
			{
				$scope.success = $routeParams.success;
				delete $location.$$search.success;
			}
			
			if( $routeParams.error )
			{
				$scope.error = $routeParams.error;
				delete $location.$$search.error;
			}
		}
		
		$scope.login = function(form)
		{
			Auth.login
			(
				{
					email:$scope.user.email,
					password:$scope.user.password
				},
				function(err)
				{
					$scope.success = null;
					$scope.error = null;
					
					$scope.errors = {};
					
					if( !err )
					{
						$location.path('/myprojects');
					}
					else
					{
						angular.forEach
						(
							err.errors,
							function(error,field)
							{
								form[field].$setValidity('mongoose',false);
								$scope.errors[field] = error.message;
							}
						);
						
						$scope.error = err.message;
					}
				}
			);
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
				navigation.showConfirm("You have unsaved changes. Would you like to save?").then
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
		
		$scope.signup = function(form)
		{
			Auth.signup
			(
				{
					email:$scope.user.email,
					nameFirst:$scope.user.nameFirst,
					nameLast:$scope.user.nameLast,
					password:$scope.user.password,
					passwordConfirm:$scope.user.passwordConfirm
				},
				function(err)
				{
					$scope.success = null;
					$scope.error = null;
					
					$scope.errors = {};
					
					if( err )
					{
						angular.forEach
						(
							err.errors,
							function(error,field)
							{
								form[field].$setValidity('mongoose',false);
								
								$scope.errors[field] = error.message;
							}
						);
					}
				}
			);
		};
	}
);