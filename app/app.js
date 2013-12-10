var app = angular.module
(
	'app',
	['ngRoute','ngDragDrop','ui.bootstrap']
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
			 	.when("/editor",{templateUrl:"partials/editor.html"})
			 	.when("/about",{templateUrl:"partials/about.html"})
			 	.otherwise({redirectUrl:"/"});			 
		 }
	 ]	
);