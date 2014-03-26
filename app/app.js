var app = angular.module
(
	'app',
	['ngRoute','ngDragDrop','ui.bootstrap','colorpicker.module']
);

app.config
(
	[
	 	'$locationProvider','$routeProvider',
		 function($locationProvider,$routeProvider)
		 {
			 $locationProvider.hashPrefix = "!";
			 
			 $routeProvider
			 	.when("/",{templateUrl:"partials/main.html"})
			 	.when("/editor",{templateUrl:"partials/editor.html"})
			 	.when("/about",{templateUrl:"partials/about.html"})
			 	.otherwise({redirectUrl:"/"});			 
		 }
	 ]	
);

//allows us to use ng-repeat with a number
//usage: ng-repeat="n in [] | range:model.mynumber
app.filter
(
	'range', 
	function() 
	{
		return function(input, total) 
		{
			total = parseInt(total);
			
			for (var i=0; i<total; i++)
				input.push(i);
				
			return input;
		};
	}
);