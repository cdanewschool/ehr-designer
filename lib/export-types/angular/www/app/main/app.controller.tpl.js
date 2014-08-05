app.controller
(
	'AppCtrl',
	[
	 	'$scope',
	 	function($scope)
	 	{
			$scope.title = "<%= model.name %>";
	 		
	 		$scope.navigation = [];
	 		
	 		<% _.each(model.pages,function(page){ %>
	 		<%= '$scope.navigation.push({label:"' + page.name + '"})' %>
	 		<%})%>
	 	}
	 ]
);