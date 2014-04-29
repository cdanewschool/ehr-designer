app.service
(
	'dragModel',
	function()
	{
		return {
			dragging:false,
			dragProps:null,
			dragItem:null,
			dropTarget:null,
			hover:null,
			selection:null
		};
	}
);

app.service
(
	'DragService',
	[
		'$rootScope','dragModel','canvas','library','FactoryService','HistoryService','utilities',
		function($rootScope,dragModel,canvas,library,factory,historyService,utilities)
		{
			$rootScope.$on
	 		(
	 			'$locationChangeStart',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 					dragModel.selection = null;
	 			}
	 		);
			
			return {
				
				dragModel:dragModel,
				
				onDragStart: function(event,ui,item)
				{
					dragModel.dragging = true;
					
					dragModel.hover = null;
					dragModel.hoverIndex = null;
					dragModel.dragItem = item;
					dragModel.dragProps = _.defaults(item.values||{},{width:event.toElement.scrollWidth,height:event.toElement.scrollHeight});
					dragModel.dragElement = event.target;
				},
				
				onDragStop: function(event,ui)
				{
					dragModel.dragging = false;
				},
				
				onDrop: function(event,ui,target)
				{
					if( !dragModel.dropTarget ) return;
					if( target == dragModel.dragItem ) return;
					if( !library.componentsIndexed[angular.element(event.target).attr('data-component-id')].container  ) return;
					
					//	utility function for massaging points if snapping turned on
					var snap = function( offset )
					{
						if( canvas.grid.snapTo )
						{
							var gridSize = (canvas.grid.size/canvas.grid.subdivisions);
							
							offset.left = Math.round(offset.left/gridSize) * gridSize - 2;
							offset.top = Math.round(offset.top/gridSize) * gridSize - 2;
						}
						
						return offset;
					};
					
					//	init object containing new values for dragged item,
					//	copying over all old values other than position
					var values = _.defaults
					(
						{
							left: ui.offset.left - dragModel.dropTarget.offset().left,
							top: ui.offset.top - dragModel.dropTarget.offset().top
						},
						dragModel.dragItem.values
					);
					
					//	set width, height and position if none
					values = _.defaults
					(
						values,
						{
							width: dragModel.dragProps.width,
							height: dragModel.dragProps.height,
							position: 'absolute'
						}
					);
					
					//	snap points to grid
					values = snap(values);
					
					var oldIndex = target.children.indexOf(dragModel.dragItem);
					var parentId = target.componentId + (target.id?"_" + target.id:"");
					
					var componentId = dragModel.dragItem.componentId + (dragModel.dragItem.id?"_" + dragModel.dragItem.id:"");	//	only used for console logging
					
					//	set hoverIndex if set
					if( dragModel.hoverIndex !== null 
						&& dragModel.dragItem.parentIndex !== dragModel.hoverIndex
						&& dragModel.hover.id != dragModel.dragItem.id )
					{
						ui.draggable.remove();
						
						dragModel.dragItem.parentIndex = dragModel.hoverIndex;
						dragModel.hoverIndex = null;
					}
					else if( dragModel.dragItem.pid && target.id != dragModel.dragItem.pid )
					{
						delete dragModel.dragItem.parentIndex;
					}
					
					//	item has already been added to stage
					if( dragModel.dragItem.pid )
					{
						//	item has been dragged to a new parent component
						if( target.id != dragModel.dragItem.pid )
						{
							ui.draggable.remove();
							
							var position = snap( {left:ui.offset.left - dragModel.dropTarget.offset().left,top:ui.offset.top - dragModel.dropTarget.offset().top});
							values = _.defaults( position, values );
							
							utilities.remove(dragModel.dragItem);
							
							dragModel.dragItem.values = values;
							dragModel.dragItem.pid = target.id;
							
							target.children.push(dragModel.dragItem);
							
							historyService.save( "Detached " + library.componentsIndexed[dragModel.dragItem.componentId].name + " from " + library.componentsIndexed[parent.componentId].name + " to " + library.componentsIndexed[target.componentId].name );
							
							//console.log("Re-parenting " + componentId + " from " + parentId + " to " + target.id, target, parent );
						}
						else
						{
							//	item has been repositioned
							var position = snap( {left:ui.position.left,top:ui.position.top});
							values = _.defaults( position, values );
							
							target.children[oldIndex].values = values;
							
							historyService.save( "Repositioned " + library.componentsIndexed[dragModel.dragItem.componentId].name );
							
							//console.log("Updating " + componentId + " (" + parentId + ")", target );
						}
					}
					//	item has been freshly added to stage
					else
					{
						values = snap( {left:ui.offset.left - dragModel.dropTarget.offset().left,top:ui.offset.top - dragModel.dropTarget.offset().top});
						
						var instance = factory.componentInstance(dragModel.dragItem,values,target);
						
						target.children.push( instance );
						
						historyService.save( "Added a new " + dragModel.dragItem.name );
					}
				},
				
				onDrag: function(event,ui,item)
				{
					//console.log( event.target, event.currentTarget )
					//console.log( 'drag', ui.offset.left + "," + ui.offset.top, dragModel.dropTarget ? dragModel.dropTarget.offset().left + "," + dragModel.dropTarget.offset().top : '', event.clientX + "," + event.clientY, (event.clientX - ui.offset.left) + ", " + (event.clientY - ui.offset.top) );
				},
				
				onOver: function(event,ui,item)
				{
					if( !library.componentsIndexed[item.componentId].container ) 
						ui.helper.addClass("reject");
					else
						ui.helper.removeClass("reject");
					
					if( ui.helper.hasClass("reject") || dragModel.dropTarget == event.target || dragModel.dragItem == event.target )
					{
						return;
					}
					
					dragModel.dropTarget = angular.element(event.target);
					dragModel.hover = item;
					
					$rootScope.$apply();
				},
				
				acceptDrop: function(item)
				{
					var acceptable = angular.element(dragModel.dropTarget).attr("data-component-id") ? library.componentsIndexed[ angular.element(dragModel.dropTarget).attr("data-component-id") ].container : true;
					
					return acceptable;
				}
			};
		}
	]
);