app.controller
(
	'FilterCtrl',
	[
	 	'$scope','webStorage',
	 	function($scope,webStorage)
	 	{
	 		$scope.filters = [
	 		                  {value:'content.name',label:'Alphabetical'},
	 		                  {value:'created',label:'Recently Created'},
	 		                  {value:'updated',label:'Recently Modified'}
	 		                 ];
	 		$scope.filter = webStorage.get('filter') || $scope.filters[0].value;
	 		
	 		$scope.search = null;
	 		
	 		$scope.setFilter = function(filter)
	 		{
	 			$scope.filter = filter;
	 			
	 			webStorage.add('filter',filter);
	 		};
	 		
	 		$scope.filterByTitle = function(item)
	 		{
	 			return !$scope.search || item.content.name.toLowerCase().indexOf($scope.search.toLowerCase())==0;
	 		};
	 	}
	 
	 ]
);