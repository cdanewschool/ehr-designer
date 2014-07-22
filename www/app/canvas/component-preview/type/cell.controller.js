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
	 		$scope.instanceDefinition = null;
	 		
	 		$scope.row = null;
	 		$scope.col = null;
	 		
	 		/**
	 		 * Initializes the cell
	 		 * 
	 		 * @param {int} col The cell's column index
	 		 * @param {int} row The cell's row index
	 		 * @param {Object} definition The instance definition for the grid component containing this cell
	 		 */
	 		$scope.init = function(col,row,definition)
	 		{
	 			$scope.col = col;
	 			$scope.row = row;	
	 			
	 			$scope.instanceDefinition = definition;
	 		};
	 		
	 		/**
	 		 * Filter function that determines if a given component definition
	 		 * belongs to a given cell
	 		 * 
	 		 * @param {Object} item The object to check for mapping to this cell
	 		 */
	 		$scope.getCellChildren = function(item)
	 		{
	 			return item.parentCellLocation && item.parentCellLocation.x == $scope.col && item.parentCellLocation.y == $scope.row;
	 		};
	 	}
	 ]
);