app.service
(
	'HistoryService',
	[
	 	'$rootScope','history','canvas',
	 	function($rootScope,history,canvas)
	 	{
	 		return {
	 			
	 			save: function(name)
	 			{
	 				if( history.currentAction 
	 					&& history.actions.indexOf(history.currentAction) < history.actions.length - 1 )
	 					history.actions.splice(history.actions.indexOf(history.currentAction)+1);
	 				
	 				var action = {id: history.id, name:name, content: angular.copy(canvas.currentProject.content), date:new Date()	};
	 				history.actions.push( action );
	 				
	 				//	truncate list of actions
	 				if( history.actions.length > history.maxSize )
	 					history.actions.splice(0,history.actions.length-history.maxSize);
	 				
	 				history.currentAction = action;
	 				
	 				$rootScope.safeApply = function(fn) 
	 				{
	 					var phase = $rootScope.$$phase;
	 					
	 					if(phase == '$apply' || phase == '$digest')
	 						$rootScope.$eval(fn);
	 					else
	 						$rootScope.$apply(fn);
	 				}();
	 				
	 				history.id++;
	 			},
	 			
	 			revert: function(action)
	 			{
	 				canvas.currentProject.content = action.content;
	 				
	 				history.currentAction = action;
	 			}
	 		};
	 	}
	 ]
);