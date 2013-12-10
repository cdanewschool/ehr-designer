app.service
(
	'dragModel',
	function()
	{
		return {
			dragProps:null,
			dragItem:null,
			dropTarget:null
		};
	}
);

app.controller
(
	'DragCtrl',
	[
		'$scope','model','dragModel',
		function($scope,model,dragModel)
		{
			$scope.onDragStart = function(event,ui,item)
			{
				dragModel.dragItem = item;
				
				var parentId = angular.element(event.target.parentNode).attr('id');
				
				if( model.document.indexOf(item)>-1 )
					dragModel.dragProps = {width:item.values.width,height:item.values.height};
				else
					dragModel.dragProps = {width:event.target.parentNode.clientWidth,height:event.target.parentNode.clientHeight};
			};
				
			$scope.onDrop = function(event,ui,item)
			{
				var values = 
				{
					left: ui.offset.left - $("#canvas").offset().left,
					top: ui.offset.top - $("#canvas").offset().top,
					width: dragModel.dragProps.width,
					height: dragModel.dragProps.height
				};
				
				var index = model.document.indexOf(dragItem);
				
				var item = angular.copy(dragItem);
				item.values = values;
				
				if( index > -1 )
				{
					model.document[index] = item;
				}
				else
				{
					model.document.splice(model.document.length-1);
					model.document.push( item );
				}
			};
			
			$scope.onDrag = function(event,ui,item)
			{
				//console.log( 'drag', event );
			};
			
			$scope.onOver = function(event,ui,item)
			{
				dragModel.dropTarget = angular.element(event.target);
			};
		}
	]
);