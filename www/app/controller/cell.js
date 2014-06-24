/**
 * Controller for a grid cell
 * 
 * Initializes a unique index for the cell's relative location and 
 * renders children whose `parentIndex` matches the cell index
 */
app.controller
(
	'CellCtrl',
	[
	 	'$scope',
	 	function($scope)
	 	{
	 		$scope.cellIndex = null;
	 		$scope.instanceDefinition = null;
	 		
	 		$scope.row = null;
	 		$scope.col = null;
	 		
	 		var update = function()
	 		{
	 			$scope.cellIndex = ($scope.instanceDefinition.values.cols*$scope.col)+$scope.row;
	 		};
	 		
	 		$scope.$watch
	 		(
	 			'instanceDefinition.values.rows',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 					update();
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'instanceDefinition.values.cols',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 					update();
	 			}
	 		);
	 		
	 		$scope.init = function(row,col,definition)
	 		{
	 			$scope.row = row;
	 			$scope.col = col;
	 			
	 			$scope.instanceDefinition = definition;
	 			
	 			update();
	 		};
	 		
	 		$scope.getCellChildren = function(item)
	 		{
	 			return item.parentIndex == $scope.cellIndex;
	 		};
	 	}
	 ]
);