app.controller
(
	'FilterCtrl',
	[
	 	'$scope','webStorage',
	 	function($scope,webStorage)
	 	{
	 		$scope.sortOptions = [
	 		                  {value:'name',label:'Alphabetical'},
	 		                  {value:'created',label:'Recently Created'},
	 		                  {value:'updated',label:'Recently Modified'}
	 		                 ];
	 		
	 		$scope.search = null;
	 		$scope.sort = null;
	 		$scope.sortField = null;
	 		
	 		$scope.$watch
	 		(
	 			'currentProject',
	 			function()
	 			{
	 				updateSort();
	 			}
	 		);
	 		
	 		var updateSort = function()
	 		{
	 			$scope.isProject = $scope.currentProject != null;
	 			
	 			$scope.setSort( webStorage.get('sort') || $scope.sortOptions[0].value );
	 		};
	 		
	 		$scope.setSort = function(sort)
	 		{
	 			$scope.sort = sort;
	 			
	 			webStorage.add('sort',sort);
	 			
	 			var sortField = sort;
	 			
	 			if( sort == "name" && !$scope.isProject )
	 				sortField = "content.name";
	 			
	 			$scope.sortField = sortField;
	 		};
	 		
	 		$scope.filterByTitle = function(item)
	 		{
	 			var title = item.content ? item.content.name : item.name;
	 			
	 			return !$scope.search || title.toLowerCase().indexOf($scope.search.toLowerCase())==0;
	 		};
	 	}
	 ]
);