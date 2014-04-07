app.service
(
	'HistoryService',
	[
	 	'history','canvas',
	 	function(history,canvas)
	 	{
	 		var id = 0;
	 		
	 		return {
	 			
	 			save: function(name)
	 			{
	 				if( history.currentAction 
	 					&& history.actions.indexOf(history.currentAction) < history.actions.length - 1 )
	 					history.actions.splice(history.actions.indexOf(history.currentAction)+1);
	 				
	 				var action = {id: id, name:name, content: angular.copy(canvas.currentProject), date:new Date()	};
	 				history.actions.push( action );
	 				
	 				//	truncate list of actions
	 				if( history.actions.length > history.maxSize )
	 					history.actions.splice(0,history.actions.length-history.maxSize);
	 				
	 				history.currentAction = action;
	 				
	 				id++;
	 			},
	 			
	 			revert: function(action)
	 			{
	 				canvas.currentProject = action.content;
	 				
	 				history.currentAction = action;
	 			}
	 		};
	 	}
	 ]
);