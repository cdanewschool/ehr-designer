/**
 * canvas-manager
 * 
 * Directive that--for performance reasons--manages mouse interactions, mouse-based style updates, and other 
 * events for the canvas' DOM tree from the top down (vs. bottom up, a few listeners vs. many)
 */
app.service
(
	'instanceCache',
	function()
	{
		var _cache = {};
		
		return {
			set: function(obj)
			{
				_cache[obj.id] = obj;
			},
			
			get: function(id)
			{
				return _cache[id];
			},
			
			clear: function()
			{
				_cache = {};
			}
		};
	}
);

app.directive
(
	'canvasManager',
	function(canvas,DragService,instanceCache,library)
	{
		return {
			restrict: 'A',
			link: function(scope,element,attrs)
			{
				//	walks down document tree recursively and returns a component
				//	definition by id
				var find = function(items,id)
				{
					for(var i in items)
					{
						if( items[i].id == id )
							return items[i];
						
						if( items[i].children )
						{
							var item = find(items[i].children,id);
							
							if( item ) return item;
						}
					}
				};
				
				//	when the selection changes, remove the selected style from the previous selection
				scope.$watch
				(
					'canvas.selection',
					function(newVal,oldVal)
					{
						if( newVal!=oldVal && oldVal && !newVal )
						{
							angular.element( oldVal.element ).parents('.outline').first().removeClass('active');
						}
					}
				);
				
				//	clear cache when switching pages/project to avoid stale references
				scope.$watch
				(
					'canvas.currentPage',
					function(newVal,oldVal)
					{
						if( newVal!=oldVal )
						{
							instanceCache.clear();
						}
					}
				);
				
				scope.$watch
				(
					'canvas.currentProject',
					function(newVal,oldVal)
					{
						if( newVal!=oldVal )
						{
							instanceCache.clear();
						}
					}
				);
				
				element.on
				(
					'click',
					function(e)
					{
						if( canvas.previewing ) return;
						
						e.stopImmediatePropagation();
						
						if( canvas.selection && canvas.selection.element != e.target ) 
							angular.element( canvas.selection.element ).parents('.outline').first().removeClass('active');
						
						//	get data definition for element/component that was clicked from cache
						var id = angular.element(e.target).closest('.component-preview').attr('data-id');
						var instance = instanceCache.get(id);
						
						//	if not cached, retrieve and cache it
						if( !instance )
						{
							instance = find([canvas.currentPage],id);
							
							if( !instance ) return;
							
							instanceCache.set(instance);
						}
						
						//	clear all selections if clicking canvas background
						if( !instance.pid )
						{
							scope.$apply
							(
								function()
								{
									scope.canvas.selection = null;
								}
							);
						}
						
						//	otherwise select the element/component that was clicked
						else
						{
							e.stopImmediatePropagation();
							
							scope.$apply
							(
								function()
								{
									var definition = library.componentsIndexed[ instance.componentId ] || library.elementsIndexed[ instance.componentId ];
									
									canvas.selection = {definition:definition, instance:instance, element: e.target };
									
									angular.element(e.target).parents('.outline').first().addClass('active');
								}
							);
						}
					}
				);
				
				element.on
				(
					'mouseover',
					function(e)
					{
						if( canvas.previewing ) return;
						
						e.stopImmediatePropagation();
						
						var id = angular.element(e.target).closest('.component-preview').first().attr('data-id');
						var instance = instanceCache.get(id);
						
						if( !instance )
						{
							instance = find([canvas.currentPage],id);
							
							if( !instance ) return;
							
							instanceCache.set(instance);
						}
						
						var cellLocation = null;
						
						if( instance.componentId == "grid" || instance.componentId == "table" )
						{
							cellLocation = {x: angular.element(e.target).scope().col, y: angular.element(e.target).scope().row};
						}
						
						//	update the element being hovered over, and if applicable, the cell index within the component 
						//	that has mouse focus
						scope.$apply
						(
							function()
							{
								DragService.onOver(e,instance,cellLocation);
								
								updateHighlightedDropTarget(instance,cellLocation);
							}
						);
					}
				);
				
				var dropTarget = null;
				
				var updateHighlightedDropTarget = function(instance,cellLocation)
				{
					//	clear the droppable style from the current drop target, if any
					if( dropTarget ) dropTarget.removeClass('dropTarget');
					
					if( !instance ) return;
					
					dropTarget = angular.element('[data-id="' + instance.id + '"] > .outline');
					
					if( cellLocation != null )
					{
						if( instance.componentId == "grid" || instance.componentId == "table" )
						{
							var target = angular.element('[data-id="' + instance.id + '"]');
							
							var cols = target.find('table > tbody').first().children().first().children().length;
							
							var col = cellLocation.x;
							var row = cellLocation.y;
							
							if( instance.componentId == "table" )
								dropTarget = target.find('table > tbody').children('tr').eq(row).children('td').eq(col).find('div');
							else
								dropTarget = target.find('table > tbody').children('tr').eq(row).children('td').eq(col);
							
							dropTarget.addClass('dropTarget');
						}
					}
				};
			}
		};
	}
);
