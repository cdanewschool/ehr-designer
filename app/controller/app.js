app.service
(
	'model',
	function()
	{
		return {
			title: "Sample App",
			navigation: 
				[
				 	{title:"Home",url:"/"},
				 	{title:"About",url:"/about"}
				 ]
		};
	}
);

app.controller
(
	'AppCtrl',
	[
	 	'$scope','$location','model',
		function($scope,$location,model)
		{
			$scope.model = model;
			
			$scope.setLocation = function(path)
			{
				$location.path(path);
			}
		}
	 ]
);