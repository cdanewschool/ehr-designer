var app = angular.module
(
	'app',
	['ngResource','ngRoute','ngSanitize','ngDragDrop','ngCookies','ngTutorial','http-auth-interceptor','ui.bootstrap','ui.sortable','colorpicker.module','base64','webStorageModule','config']
);

app.config
(
	[
	 	'$locationProvider','$routeProvider',
		 function($locationProvider,$routeProvider)
		 {
			 $locationProvider.hashPrefix = "!";
			 $locationProvider.html5Mode(true);
			 
			 $routeProvider
			 	.when("/",{templateUrl:"partials/main.html",controller:"UserCtrl"})
			 	.when("/login",{templateUrl:"partials/login.html",controller:"UserCtrl"})
			 	.when("/signup",{templateUrl:"partials/signup.html",controller:"UserCtrl"})
			 	.when("/browse",{templateUrl:"partials/browse.html",controller:"BrowseCtrl"})
			 	.when("/browse/:projectId",{templateUrl:"partials/browse.html",controller:"BrowseCtrl"})
			 	.when("/browse/:projectId/:pageId",{templateUrl:"partials/browse.html",controller:"BrowseCtrl"})
			 	.when("/myprojects",{templateUrl:"partials/myprojects.html",controller:"BrowseCtrl"})
			 	.when("/myprojects/:projectId",{templateUrl:"partials/myprojects.html",controller:"BrowseCtrl"})
			 	.when("/editor",{templateUrl:"partials/editor.html",controller:"CanvasCtrl"})
			 	.when("/editor/:projectId",{templateUrl:"partials/editor.html",controller:"CanvasCtrl"})
			 	.when("/editor/:projectId/:pageId",{templateUrl:"partials/editor.html",controller:"CanvasCtrl"})
			 	.when("/about",{templateUrl:"partials/about.html"})
			 	.otherwise({redirectUrl:"/"});
		 }
	 ]
);

app.run
(
	function($rootScope,$location,Auth)
	{
		var bounce = function()
		{
			// trim path
			var path = $location.path();
			
			if( path.indexOf("?")>-1 )
				path = path.substr(0,path.indexOf("?") );
			
			path = path.split("/")[1];
			
			if (!$rootScope.currentUser && (['','about','browse','login','signup'].indexOf(path) == -1 )) 
			{
				Auth.currentUser();
		    }
		};
		
		$rootScope.$on('$locationChangeStart',bounce);
		
		$rootScope.$watch
		(
			'currentUser',
			bounce
		);
		
		// On catching 401 errors, redirect to the login page.
	    $rootScope.$on
	    (
	    	'event:auth-loginRequired', 
	    	function() 
	    	{
	    		$location.path('/login');
	    		return false;
	    	}
	    );		
	}
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