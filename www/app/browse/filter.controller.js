/**
 * Controller for filter/sort controls
 * (corresponds to /partials/includes/project-filter.html view)
 */
app.controller
(
	'FilterCtrl',
	[
	 	'$scope','webStorage',
	 	function($scope,webStorage)
	 	{
	 		//	available sort types
	 		$scope.sortOptions = 
	 		[
	 		 	{value:'name',label:'Alphabetical'},
	 		 	{value:'created',label:'Recently Created'},
	 		 	{value:'updated',label:'Recently Modified'}
	 		];
	 		
	 		$scope.search = null;		//	search string
	 		$scope.sort = null;			//	selected sort
	 		$scope.sortField = null;	//	actual field to sort against
	 		
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
	 		
	 		/**
	 		 *  Sets the selected sort (one of sortOptions) and stores it in cookie
	 		 *  Because path to item name differs between projects and pages, we set the 
	 		 *  additional property `sortField` containing the actual field to sort against
	 		 */
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