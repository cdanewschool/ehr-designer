app.service
(
	'dragModel',
	function()
	{
		return {
			dragProps:null,
			dragItem:null,
			dropTarget:null,
			hover:null,
			snapToGrid:true
		};
	}
);

app.service
(
	'DragService',
	[
		'$rootScope','model','dragModel','FactoryService',
		function($rootScope,model,dragModel,factory)
		{
			return {
				
				dragModel:dragModel,
				
				onDragStart: function(event,ui,item)
				{
					dragModel.hover = null;
					dragModel.dragItem = item;
					dragModel.dragProps = _.defaults(item.values||{},{width:event.toElement.scrollWidth,height:event.toElement.scrollHeight});
				},
				
				onDrop: function(event,ui,target)
				{
					if( !dragModel.dropTarget ) return;
					if( target == dragModel.dragItem ) return;
					
					dragModel.hover = null;
					
					var conditionPoints = function( offset )
					{
						if( model.snapToGrid )
						{
							offset.left = Math.round(offset.left/10) * 10 - 2;
							offset.top = Math.round(offset.top/10) * 10 - 2;
						}
						
						return offset;
					};
					
					var values = _.defaults
					(
						{
							left: ui.position.left - event.target.parentNode.clientLeft,
							top: ui.position.top - event.target.parentNode.clientTop
						},
						dragModel.dragItem.values
					);
					
					values = _.defaults
					(
						values,
						{
							width: dragModel.dragProps.width,
							height: dragModel.dragProps.height,
							position: 'absolute'
						}
					);
					
					values = conditionPoints(values);
					
					var getParentById = function(id)
					{
						var search = function(item)
						{
							if(item.id == id)
								return item;
							
							if( item.children )
								for(var c in item.children)
									return search(item.children[c]);
							
							return null;
						};
						
						return search(model.page);
					};
					
					var index = target.children.indexOf(dragModel.dragItem);
					
					var componentId = dragModel.dragItem.cid + (dragModel.dragItem.id?"_" + dragModel.dragItem.id:"");
					var parentId = target.cid + (target.id?"_" + target.id:"");
					
					if( dragModel.dragItem.pid )	//	item has a parent
					{
						if( target.id != dragModel.dragItem.pid )	//	change in parent
						{
							ui.draggable.detach();
							
							var position = conditionPoints( {left:ui.offset.left - dragModel.dropTarget.offset().left,top:ui.offset.top - dragModel.dropTarget.offset().top});
							values = _.defaults( position, values );
							
							var parentId = dragModel.dragItem.pid;
							var parent = getParentById(parentId);
							
							if( !parent )
							{
								console.error("no parent for " + dragModel.dragItem.pid)
							}
							
							var index = parent.children.indexOf(dragModel.dragItem);
							
							parent.children.splice( index, 1 );
							
							dragModel.dragItem.values = values;
							dragModel.dragItem.pid = target.id;
							
							target.children.push(dragModel.dragItem);
							
							console.log("Re-parenting " + componentId + " from " + parentId + " to " + target.id, target, parent );
						}
						else
						{
							target.children[index].values = values;
							
							console.log("Updating " + componentId + " (" + parentId + ")", target );
						}
					}
					else						//	item does not have a parent
					{
						values = conditionPoints( {left:ui.offset.left - dragModel.dropTarget.offset().left,top:ui.offset.top - dragModel.dropTarget.offset().top});
						
						target.children.push( factory.componentInstance(dragModel.dragItem,values,target) );
						
						//console.log( 'drop', angular.element(dragModel.dropTarget).attr("id"), angular.element(dragModel.dropTarget).offset().left + "," + angular.element(dragModel.dropTarget).offset().top, ui.position.left + "," + ui.position.top, ui.offset.left + "," + ui.offset.top, dragModel.dropTarget ? dragModel.dropTarget.offset().left + "," + dragModel.dropTarget.offset().top : '', event.clientX + "," + event.clientY, (event.clientX - ui.offset.left) + ", " + (event.clientY - ui.offset.top) );
					}
				},
				
				onDrag: function(event,ui,item)
				{
					//console.log( 'drag', ui.offset.left + "," + ui.offset.top, dragModel.dropTarget ? dragModel.dropTarget.offset().left + "," + dragModel.dropTarget.offset().top : '', event.clientX + "," + event.clientY, (event.clientX - ui.offset.left) + ", " + (event.clientY - ui.offset.top) );
				},
				
				onOver: function(event,ui,item)
				{
					if( dragModel.dropTarget == event.target || dragModel.dragItem == event.target )
						return;
					
					dragModel.dropTarget = angular.element(event.target);
					dragModel.hover = item;
					
					console.log('drop target = ',item);
					
					$rootScope.$apply();
				},
				
				acceptDrop: function(item)
				{
					return true;
				}
			};
		}
	]
);