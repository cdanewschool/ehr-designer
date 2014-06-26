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
				
				element.on
				(
					'click',
					function(e)
					{
						if( canvas.previewing ) return;
						
						e.stopImmediatePropagation();
						
						if( canvas.selection )
							angular.element( canvas.selection.element ).parents('.outline').first().removeClass('active');
						
						//	get data
						var id = angular.element(e.target).closest('.component-preview').attr('data-id');
						var instance = instanceCache.get(id);
						
						if( !instance )
						{
							instance = find([canvas.currentPage],id);
							
							if( !instance ) return;
							
							instanceCache.set(instance);
						}
						
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
						var cellIndex;
						
						if( !instance )
						{
							instance = find([canvas.currentPage],id);
							
							if( !instance ) return;
							
							instanceCache.set(instance);
						}
						
						if( instance.componentId == "grid" || instance.componentId == "table" )
						{
							cellIndex = angular.element(e.target).scope().cellIndex;
						}
						
						scope.$apply
						(
							function()
							{
								DragService.onOver(e,instance,cellIndex);
							
								updateHighlightedDropTarget(instance,cellIndex);
							}
						);
					}
				);
				
				var dropTarget;
				
				var updateHighlightedDropTarget = function(instance,index)
				{
					if( dropTarget ) 
						dropTarget.removeClass('dropTarget');
					
					if( !instance ) return;
					
					dropTarget = angular.element('[data-id="' + instance.id + '"] > .outline');
					
					if( index != null )
					{
						if( instance.componentId == "grid" || instance.componentId == "table" )
						{
							var target = angular.element('[data-id="' + instance.id + '"]');
							
							var cols = target.find('table > tbody').first().children().first().children().length;
							
							var row = Math.floor(index/cols);
							var col = index%cols;
							
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
