app.controller
(
	'HistoryCtrl',
	[
	 	'$scope','history','HistoryService',
	 	function($scope,history,historyService)
	 	{
	 		$scope.history = history;
	 		
	 		$scope.revert = function(action)
	 		{
	 			historyService.revert(action);
	 		};
	 	}
	 ]
);