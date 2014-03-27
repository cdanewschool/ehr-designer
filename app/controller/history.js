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
	 	'$scope','model','history','HistoryService',
	 	function($scope,model,history,historyService)
	 	{
	 		$scope.history = history;
	 		
	 		$scope.revert = function(action)
	 		{
	 			historyService.revert(action);
	 		};
	 	}
	 ]
);