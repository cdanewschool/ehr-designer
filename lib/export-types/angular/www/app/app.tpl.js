var app = angular.module('app',['ngResource','ngRoute','ngSanitize','ui.bootstrap']);

app.config
(
	[
		'$locationProvider','$routeProvider',
		 function($locationProvider,$routeProvider)
		 {
			$locationProvider.hashPrefix = "!";
			$locationProvider.html5Mode(false);
			 
			$routeProvider.when("/",{templateUrl:"partials/main.html",controller:"AppCtrl"});
			<% _.each(model.pages, function(child) { 
				 var pageName = child.name; %>
			<%= 
			'$routeProvider.when("/page/' + pageName + '",{templateUrl:"partials/' + pageName + '.html",controller:"AppCtrl"});' 
			%>
			<% }); %>
			$routeProvider.otherwise({redirectUrl:"/"});
		 }
	 ]
);