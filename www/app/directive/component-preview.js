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
	function($parse,$compile,model,FactoryService)
	{
		return {
			restrict : 'EA',
			scope:{
				isStatic: "=componentStatic",
				definition: "=componentDefinition",
				dragService:"=dragService"
			},
			templateUrl:"partials/templates/component-preview.html",
			replace:true,
			compile:function(element,attrs)
			{
				if( attrs.componentStatic == undefined || attrs.componentStatic != "true" )
				{
					element.attr("droppable","true");
				};
				
				return {
					pre: function preLink(scope, element, attrs) {},
					post: function postLink(scope,element,attrs)
					{
						var el;
						var width;
						var height;
						var updating;
						
						scope.componentDefinition = model.componentsIndexed[ scope.definition.cid ];
						
						scope.id = FactoryService.uniqueId();
						scope.showBorder = scope.componentDefinition.container;
						scope.isDroppable = (!scope.isStatic && scope.definition.cid!='label' && scope.definition.cid!='image');
						scope.isDraggable = !scope.isStatic;
						
						console.log( scope.definition.pid )
						//	show properties menu on click
						if( attrs.componentStatic == undefined || attrs.componentStatic != "true" )
						{
							element.on
							(
								'mousedown',
								function(e)
								{
									e.stopImmediatePropagation();
									
									if( !scope.definition.pid )	//	temp hack to disallow editing root canvas
										scope.dragService.dragModel.selection = null;
									else
										scope.dragService.dragModel.selection = {definition:scope.componentDefinition, instance: scope.definition, target: element.find('.target').get(0) };
									
									scope.$apply();
								}
							);
						}
						
						var update = function()
						{
							if( !scope.definition ) return;
							
							//	calculate size
							var values = scope.definition && scope.definition.values ? scope.definition.values : {width:-1,height:-1};
							
							var w = values.width,h = values.height;
							
							var padding = _.defaults(values.padding||{},{top:0,right:0,bottom:0,left:0});
							
							w = values.width || 0;
							h = values.height || 0;
							
							var hasChildren = scope.definition.children
												&& scope.definition.children.length;
							
							if( scope.definition.cid == "grid" )
							{
								w = 0;
								h = 0;
								
								//	lay-out children
								for(var i = 0;i < scope.definition.children.length;i++)
								{
									var child = scope.definition.children[i];
									
									child.values.left = 0;
									child.values.top = 0;
									child.values.position = "relative";
								}
							}
							
							var borderThickness = 2;	//TODO: get dynamically?
							
							if( scope.componentDefinition 
									&& hasChildren )
							{
								if( w > -1 )
									w += (padding.left + padding.right) + (borderThickness*2);
								
								if( h > -1 )
									h += (padding.top + padding.bottom) + (borderThickness*2);
							}
							
							var el = angular.element(element);
							
							if( values.position ) 
								el.css("position",values.position);
							
							if( values.left ) 
								el.css("left",values.left + "px");
							
							if( values.top ) 
								el.css("top",values.top + "px");				
						};
						
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
						
						$compile(element)(scope);
					}
			    };
			}
		};
	}
);