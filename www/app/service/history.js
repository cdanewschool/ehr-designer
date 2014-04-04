app.service
(
	'HistoryService',
	[
	 	'history','canvas','ProjectService',
	 	function(history,canvas,ProjectService)
	 	{
	 		var id = 0;
	 		
	 		return {
	 			
	 			save: function(name)
	 			{
	 				if( history.currentAction 
	 					&& history.actions.indexOf(history.currentAction) < history.actions.length - 1 )
	 					history.actions.splice(history.actions.indexOf(history.currentAction)+1);
	 				
	 				var action = {id: id, name:name, content: angular.copy(canvas.currentProject.content), date:new Date()	};
	 				history.actions.push( action );
	 				
	 				//	truncate list of actions
	 				if( history.actions.length > history.maxSize )
	 					history.actions.splice(0,history.actions.length-history.maxSize);
	 				
	 				history.currentAction = action;
	 				
	 				id++;
	 			},
	 			
	 			revert: function(action)
	 			{
	 				project.document = action.content;
	 				
	 				ProjectService.selectSection(0);
	 				
	 				history.currentAction = action;
	 			}
	 		};
	 	}
	 ]
);