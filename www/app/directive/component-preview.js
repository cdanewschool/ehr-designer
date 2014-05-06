/**
 * Component Preview
 * 
 * This directive recursively builds a DOM structure by rendering
 * itself and it's children, which can be component-previews themselves
 * (see component-preview.html). 
 */

app.directive
(
	'componentPreview',
	function($parse,$compile,library,canvas,FactoryService)
	{
		return {
			restrict : 'EA',
			scope:{
				isStatic: "=componentStatic",
				canvas: "=canvas",
				definition: "=componentDefinition",
				dragService:"=dragService"
			},
			templateUrl:"partials/templates/component-preview.html",
			replace:true,
			compile:function(element,attrs)
			{
				return {
					pre: function preLink(scope, element, attrs) {},
					post: function postLink(scope,element,attrs)
					{
						//	mouseenter handler
						scope.mouseenter = function()
						{
							if( !scope.canvas.previewing && scope.dragService )
								scope.dragService.dragModel.hover = scope.definition;
						};
						
						var init = function()
						{
							if( !scope.definition ) return;
							
							//	set up scope
							if( !scope.id ) scope.id = FactoryService.uniqueId();
							
							//	set component's definition, handling an unrecognized/invalid component id
							if( !(scope.componentDefinition = library.componentsIndexed[scope.definition.componentId]) )
							{
								scope.componentDefinition = { container: false };
								scope.definition = { componentId: null };
							}
							
							//	whether in preview mode or not
							var previewing = scope.canvas && scope.canvas.previewing;
							
							scope.showBorder = (!previewing && scope.componentDefinition.container===true);
							scope.cellsAreDroppable = (!previewing && scope.componentDefinition.container==="cell");
							scope.isDroppable = (!previewing && !scope.isStatic && scope.definition.componentId!='label' && scope.definition.componentId!='image');
							scope.isDraggable = (!previewing && !scope.isStatic);
							
							//	store the component's id on the associated dom el so we can easily get the corresponding definition (see drag service)
							element.attr("data-component-id",scope.definition.componentId);
							
							//	show properties menu on click
							if( scope.canvas 
								&& (attrs.componentStatic == undefined || attrs.componentStatic != "true") )
							{
								if( !previewing )
								{
									element.on
									(
										'click.select',
										function(e)
										{
											if( !scope.definition.pid )	//	temp hack to disallow editing root canvas
												scope.canvas.selection = null;
											else
											{
												e.stopImmediatePropagation();
												
												scope.canvas.selection = {definition:scope.componentDefinition, instance: scope.definition, target: element.find('.target').get(0) };
											}
											
											scope.$apply();
										}
									);
								}
								else
								{
									element.off('click.select');
								}
							}
							
				 			if( scope.definition.componentId == "image" )
							{
								//	store original dimensions on init and <src> change
				 				var storeDimensions = function(revert)
				 				{
				 					//	TODO: we shouldnt' have to do this if properly cleaned up on destroy
				 					if( !scope.definition ) return;
				 					
				 					revert = revert || false;
				 					
				 					$('<img/>')
				 						.attr('src',scope.definition.values.src)
				 						.load
					 					(
					 						function(e)
					 						{
					 							scope.definition.values.origWidth = this.width;
					 							scope.definition.values.origHeight = this.height;
					 							
					 							if( revert )
					 							{
					 								scope.definition.values.width = scope.definition.values.origWidth;
						 							scope.definition.values.height = scope.definition.values.origHeight;
					 							}
					 							
					 							scope.$apply();
					 						}
					 					);
				 				};
				 				
				 				scope.$watch
				 		 		(
				 		 			'definition.values.src',
				 		 			function(newVal,oldVal)
				 		 			{
				 		 				if( newVal != oldVal )
				 		 				{
				 		 					storeDimensions(true);
				 		 				}
				 		 			}
				 		 		);
				 				
				 				storeDimensions();
							}
				 			
				 			if( scope.componentDefinition.properties
				 				&& scope.componentDefinition.properties["auto-layout-children"] )
				 			{
				 				scope.$watch
								(
									'definition.values["auto-layout-children"]',
									function(newVal,oldVal)
									{
										if( newVal != oldVal )
											update();
									}
								);
				 			}
						};
						
						var update = function()
						{
							if( !scope.definition ) return;
							
							//	calculate size
							var values = scope.definition && scope.definition.values ? scope.definition.values : {width:-1,height:-1};
							
							var hasChildren = scope.definition.children
												&& scope.definition.children.length;
							
							if( scope.cellsAreDroppable
								&& scope.definition.values 
								&& scope.definition.values['auto-layout-children'] == true 
								&& hasChildren )
							{
								//	lay-out children
								for(var i = 0;i < scope.definition.children.length;i++)
								{
									var child = scope.definition.children[i];
									
									child.values.left = 0;
									child.values.top = 0;
									child.values.position = "relative";
								}
							}
							
							var el = angular.element(element);
							
							if( values.position ) 
								el.css("position",values.position);
							
							if( values.left !== undefined ) 
								el.css("left",values.left + "px");
							
							if( values.top !== undefined ) 
								el.css("top",values.top + "px");				
						};

						if( !scope.definition ) 
						{
							scope.$watch
							(
								'definition',
								function(newVal,oldVal)
								{
									if( newVal != oldVal )
									{
										//unwatch
										init();
									}
								}
							);
						}
						else
						{
							init();
						}
						
						if( !scope.isStatic )
						{
							scope.$watch
							(
								'definition',
								function(newVal,oldVal)
								{
									if( newVal != oldVal )
										update();
								},true
							);
							
							
							
							update();
						}
						
						scope.$watch
						(
							'canvas.previewing',
							function(newVal,oldVal)
							{
								if( newVal != oldVal )
								{
									init();
								}
							}
						);
						
						$compile(element)(scope);
					}
			    };
			}
		};
	}
);