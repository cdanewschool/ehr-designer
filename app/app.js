var app = angular.module
(
	'app',
	['ngRoute']
);

app.config
(
	[
	 	'$locationProvider','$routeProvider',
		 function($locationProvider,$routeProvider)
		 {
			 $locationProvider.html5Mode(true);
			 $locationProvider.hashPrefix = "!";
			 
			 $routeProvider
			 	.when("/",{templateUrl:"partials/main.html"})
			 	.when("/about",{templateUrl:"partials/about.html"})
			 	.otherwise({redirectUrl:"/"});			 
		 }
	 ]	
);