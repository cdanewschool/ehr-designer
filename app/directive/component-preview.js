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
						
						//	show properties menu on click
						if( attrs.componentStatic == undefined || attrs.componentStatic != "true" )
						{
							element.on
							(
								'click',
								function(e)
								{
									e.stopImmediatePropagation();
									
									if( scope.id != "2")	//	temp hack to disallow editing root canvas
									{
										scope.dragService.dragModel.selection = {definition:scope.componentDefinition, instance: scope.definition, target: element.find('.target').get(0) };
										
										scope.$apply();
									}
								}
							);
						}
						
						var update = function()
						{
							//	calculate size
							var values = scope.definition && scope.definition.values ? scope.definition.values : {width:-1,height:-1};
							
							var w = values.width,h = values.height;
							
							var padding = _.defaults(values.padding||{},{top:0,right:0,bottom:0,left:0});
							
							var direction;
							
							switch( scope.definition.cid )
							{
								case "horizontal_list":
									direction = "horizontal";
									break;
									
								case "vertical_list":
									direction = "vertical";
									break;
							}
							
							w = values.width || 0;
							h = values.height || 0;
							
							var hasChildren = scope.definition.children
												&& scope.definition.children.length;
							
							if( direction )
							{
								w = 0;
								h = 0;
								
								//	lay-out children
								if( scope.componentDefinition.autoLayoutChildren 
									&& hasChildren )
								{
									for(var c in scope.definition.children)
									{
										if( scope.definition.children[c].values )
										{
											if( direction == "horizontal" )
												w += scope.definition.children[c].values.width;
											else if( direction == "vertical" )
												w = Math.max( scope.definition.children[c].values.width, w );
											
											if( direction == "horizontal" )
												h = Math.max( scope.definition.children[c].values.height, h);
											else if( direction == "vertical" )
												h += scope.definition.children[c].values.height;
										};
									}
									
									var x = padding.left;
									var y = padding.top;
									
									for(var i = 0;i < scope.definition.children.length;i++)
									{
										var child = scope.definition.children[i];
										
										child.values.position = "absolute";
										child.values.left = x;
										child.values.top = y;
										
										if( direction == "horizontal" )
											x += (child.values.width + padding.left);
										else if( direction =="vertical" )
											y += (child.values.height + padding.bottom);
									}
									
									if( direction == "horizontal" )
										w += (padding.left * (scope.definition.children.length-1));
									else if( direction == "vertical" )
										h += (padding.top * (scope.definition.children.length-1));
								}
								else
								{
									var minWidth = 50,minHeight = 50;
									
									w = Math.max(w,minWidth);
									h = Math.max(h,minHeight);
								}
							}
							
							//console.log(scope.definition.cid,hasChildren,w,h)
							
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
							
							if( w > -1 )
								el.css("width",w+"px");
							
							if( h > -1 )
								el.css("height",h+"px");
							
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