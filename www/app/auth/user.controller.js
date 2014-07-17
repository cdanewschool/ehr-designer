app.controller
(
	'UserCtrl',
	function($rootScope,$scope,$location,$routeParams,Auth)
	{
		$scope.success = null;
		$scope.error = null;
		
		$scope.errors = {};
		$scope.user = {};
		
		//	look for `success`/`error` params in url
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
		
		/**
		 * Submits login form, setting form field validity on error and 
		 * redirecting to /myprojects on success
		 * 
		 * @param {FormController} form The login form
		 */
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
		
		/**
		 * Logs out user, redirecting to / on success
		 */
		$scope.logout = function()
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
		
		/**
		 * Submits login form, setting form field validity on error
		 * 
		 * @param {FormController} form The login form
		 */
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