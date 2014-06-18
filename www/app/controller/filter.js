app.controller
(
	'FilterCtrl',
	[
	 	'$scope',
	 	function($scope)
	 	{
	 		$scope.filters = [
	 		                  {value:'content.name',label:'Alphabetical'},
	 		                  {value:'created',label:'Recently Created'},
	 		                  {value:'updated',label:'Recently Modified'}
	 		                 ];
	 		$scope.filter = $scope.filters[0].value;
	 		
	 		$scope.search = null;
	 		
	 		$scope.filterByTitle = function(item)
	 		{
	 			return !$scope.search || item.content.name.toLowerCase().indexOf($scope.search.toLowerCase())==0;
	 		};
	 	}
	 
	 ]
);