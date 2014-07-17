/**
 * Controller for a grid cell
 * 
 * Used by cells in grid and table components to manage the retrieval
 * of child components that should be placed at this particular cell position
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
	 		
	 		//	update the unique index for a cell's location when
	 		//	the parent grid's row- or cell-count changes
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
	 		
	 		/**
	 		 * Initializes the cell
	 		 * 
	 		 * @param {int} row The cell's row
	 		 * @param {int} row The cell's column
	 		 * @param {Object} definition The instance definition for the grid component containing this cell
	 		 */
	 		$scope.init = function(row,col,definition)
	 		{
	 			$scope.row = row;
	 			$scope.col = col;
	 			
	 			$scope.instanceDefinition = definition;
	 			
	 			update();
	 		};
	 		
	 		/**
	 		 * Filter function that determines if a given component definition
	 		 * belongs to a given cell
	 		 * 
	 		 * @param {Object} item The object to check for mapping to this cell
	 		 */
	 		$scope.getCellChildren = function(item)
	 		{
	 			return item.parentIndex == $scope.cellIndex;
	 		};
	 	}
	 ]
);