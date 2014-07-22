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
			selection:null
		};
	}
);

app.service
(
	'DragService',
	[
		'$rootScope','$compile','dragModel','canvas','library','FactoryService','HistoryService','utilities',
		function($rootScope,$compile,dragModel,canvas,library,factory,historyService,utilities)
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
					dragModel.hoverCellLocation = null;
					dragModel.dragItem = item;
					dragModel.dragProps = _.defaults(item.values||{},{width:event.toElement.scrollWidth,height:event.toElement.scrollHeight});
					dragModel.dragElement = event.target;
					
					dragModel.startPosition = { left: ui.helper.css('left'), top: ui.helper.css('top') };
				},
				
				onDragStop: function(event,ui)
				{
					dragModel.dragging = false;
				},
				
				onDrop: function(event,ui,target)
				{
					var revert = function()
					{
						ui.draggable.css('left',dragModel.startPosition.left);
						ui.draggable.css('top',dragModel.startPosition.top);
					};
					
					if( !dragModel.dragItem ) return;
					if( target == dragModel.dragItem ) return;
					
					var targetDefinition = library.elementsIndexed[ angular.element(event.target).attr('data-component-id') ];
					
					if( targetDefinition.container===false  ) return;
					
					if( targetDefinition.container === 'cell' 
						&& target.values['auto-layout-children'] == true
						&& target.id == dragModel.dragItem.pid 
						&& dragModel.dragItem.parentCellLocation
						&& dragModel.hoverCellLocation
						&& dragModel.dragItem.parentCellLocation.x == dragModel.hoverCellLocation.x
						&& dragModel.dragItem.parentCellLocation.y == dragModel.hoverCellLocation.y ) 
						return revert();
					
					var dropTarget = angular.element(event.target);
					var dragItem = dragModel.dragItem;
					
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
							left: ui.offset.left - dropTarget.offset().left,
							top: ui.offset.top - dropTarget.offset().top
						},
						dragItem.values
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
					
					//	set parentCellLocation if set
					if( dragModel.hoverCellLocation 
						&& dragModel.hover
						&& dragModel.hover.id != dragItem.id )
					{
						dragItem.parentCellLocation = dragModel.hoverCellLocation;
						dragModel.hoverCellLocation = null;
					}
					else if( dragItem.pid && target.id != dragItem.pid )
					{
						delete dragItem.parentIndex;
					}
					
					//	item has already been added to stage
					if( dragItem.pid )
					{
						//	item has been dragged to a new parent component
						if( target.id != dragItem.pid )
						{
							ui.draggable.remove();
							
							var position = snap( {left:ui.offset.left - dropTarget.offset().left,top:ui.offset.top - dropTarget.offset().top});
							values = _.defaults( position, values );
							
							utilities.remove(dragItem);
							
							dragItem.values = values;
							dragItem.pid = target.id;
							
							target.children.push(dragItem);
							
							historyService.save( "Detached " + library.elementsIndexed[dragItem.componentId].name + " from " + library.elementsIndexed[parent.componentId].name + " to " + library.elementsIndexed[target.componentId].name );
						}
						else
						{
							var oldIndex = -1;
							
							for(var i=0;i<target.children.length;i++)
							{
								if( JSON.stringify(target.children[i]) === JSON.stringify(dragItem) )
								{
									oldIndex = i;
									continue;
								}
							}
							
							//	item has been repositioned
							var position = snap( {left:ui.position.left,top:ui.position.top});
							values = _.defaults( position, values );
							
							try{
								target.children[oldIndex].values = values;
							}
							catch(e)
							{
								console.log( target.children, oldIndex );
							}
							
							historyService.save( "Repositioned " + library.elementsIndexed[dragItem.componentId].name );
						}
					}
					//	item has been freshly added to stage
					else
					{
						values = snap( {left:ui.offset.left - dropTarget.offset().left,top:ui.offset.top - dropTarget.offset().top, isNew:true});
						
						var instance = factory.componentInstance(dragItem,values,target);
						
						target.children.push( instance );
						
						historyService.save( "Added a new " + dragItem.name );
					}
				},
				
				onDrag: function(event,ui,item)
				{
					//console.log( event.target, event.currentTarget )
					//console.log( 'drag', ui.offset.left + "," + ui.offset.top, dropTarget ? dropTarget.offset().left + "," + dropTarget.offset().top : '', event.clientX + "," + event.clientY, (event.clientX - ui.offset.left) + ", " + (event.clientY - ui.offset.top) );
				},
				
				onDragOver: function(event,ui,item)
				{
					if( library.elementsIndexed[item.componentId].container===false ) 
						ui.helper.addClass("reject");
					else
						ui.helper.removeClass("reject");
					
					if( ui.helper.hasClass("reject") || dragModel.dropTarget == event.target || dragModel.dragItem == event.target )
					{
						return;
					}
					
					dragModel.hover = item;
					dragModel.dropTarget = event.target;
					
					$rootScope.$apply();
				},
				
				onOver: function(event,definition,cellLocation)
				{
					if( !canvas.previewing )
					{
						dragModel.hover = definition;
						dragModel.hoverCellLocation = cellLocation;
					}
				},
				
				acceptDrop: function(item)
				{
					var acceptable = angular.element(dragModel.dropTarget).attr("data-component-id") ? library.elementsIndexed[ angular.element(dragModel.dropTarget).attr("data-component-id") ].container!==false : true;
					
					return acceptable;
				},
				
				getDragPreview: function(event)
				{
					var target = event.currentTarget;
					
					var item = library.getDefinition( angular.element(target).attr("data-id"),angular.element(target).attr('data-component-type') );
					var simpleRender = item.type == "component";
					
					var scope = $rootScope.$new(true);
					scope.canvas = canvas;
					scope.component = item;
					scope.dragService = this;
					scope.simpleRender = simpleRender;
					
					var clone = angular.element('<component-preview component-instance="component" component-static="true" simple-render="simpleRender" component-draggable drag-service="dragService"></component-preview>');
					$compile(clone)(scope);
					
					return $("<div></div>").append(clone);
				}
			};
		}
	]
);
