app.controller
(
	'UserCtrl',
	function($scope,$location,Auth)
	{
		$scope.errors = {};
		$scope.user = {};
		
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
					$scope.errors = {};
					$scope.error = {};
					
					if( !err )
					{
						$location.path('/');
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
						
						$scope.error.other = err.message;
					}
				}
			);
		};
		
		$scope.logout = function()
		{
			Auth.logout
			(
				function(err)
				{
					if( !err )
						$location.path('/');
				}
			)
		};
		
		$scope.signup = function(form)
		{
			Auth.signup
			(
				{
					email:$scope.user.email,
					password:$scope.user.password
				},
				function(err)
				{
					$scope.errors = {};
					
					if( !err )
					{
						
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
					}
				}
			);
		};
	}
);