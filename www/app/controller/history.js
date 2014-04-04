app.service
(
	'history',
	function()
	{
		return {
			actions: [],
			currentAction: null,
			maxSize: 10
		};
	}
);

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