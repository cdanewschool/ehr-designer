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
	function($rootScope,$parse,$compile,$timeout,library,canvas,FactoryService)
	{
		var getDefault = function(property)
 		{
			switch( property.type )
 			{
 				case "object":
 					
 					var vals = {};
					
					for(var p in property.properties)
						vals[ property.properties[p].id ] = getDefault(property.properties[p]);
					
					return vals;
					
					break;
				
 				case "int":
 					
 					return 0;
 					
 					break;
 					
 				case "color":
 					
 					return "#000000";
 					
 					break;
 					
 				case "string":
 					
 					return '';
 					
 					break;
 					
 				case "enum":
 					
 					if( property.values 
 						&& property.values.length )
 						return property.values[0].value;
 					
 					break;
 			}
 		};
 		
 		var setDefaultProperties = function(definition,instance,element)
 		{
 			if( !instance.values )
 				instance.values = {};
 			
 			angular.forEach
 			(
 				definition.properties,
 				function(property)
 				{
 					if( !instance.values[property.id] )
 					{
 						//	sync existing css to supported component properties
	 					if( angular.element(element).css(property.id) )
	 					{
	 						//	init properties of type object to empty object to prevent null pointer exception
		 					if( property.type == "object" )
		 						instance.values[property.id] = {};
		 					
	 						var cssValue = angular.element(element).css(property.id);
	 						
	 						if( property.parseExpression )
	 						{
	 							var valueParts = cssValue.match( new RegExp(property.parseExpression) );
	 							valueParts = _.compact(valueParts);
	 							
	 							if( valueParts ) valueParts.shift();	//	first element is just the matched string, which we don't need
	 							
	 							//	handle padding/margin seperately, due to shorthand syntax
	 							if( valueParts 
	 								&& (property.id == "padding" || property.id == "margin" ) )
		 						{
	 								//	two values specified (first applies to top/bottom, second to left/righ) so double the array
		 							if( valueParts.length == 4 )
		 							{
		 								valueParts = valueParts.concat( valueParts.slice(0) );
		 							}
		 							//	one value specified, so clone the array 3 times
		 							else if( valueParts.length == 2 )
		 							{
		 								var l = valueParts.length;
		 								
		 								for(var i = 0;i<3;i++)
		 									valueParts = valueParts.concat( valueParts.slice(0,l) );
		 							}
		 							
		 							//	grab the unit for the first value and apply universally
		 							var unit = valueParts[1];
		 							
		 							for(var i=valueParts.length;i>0;i--)
		 								if( isNaN(valueParts[i]) )
		 									valueParts.splice(i,1);
		 							
		 							valueParts.push( unit );
		 						}
	 							
	 							//	iterate over parsed property values and set on instance
	 							angular.forEach
	 				 			(
	 				 				valueParts,
	 				 				function(value,index)
	 				 				{
	 				 					if( value!= "" )
	 				 					{
	 				 						//	convert numeric values to Number
		 				 					if( !isNaN(parseFloat(value)) )
		 				 						value = parseFloat(value);
		 				 					
		 				 					if( property.type == "object" )
		 				 						instance.values[property.id][ property.properties[index].id ] = value;
		 				 					else
		 				 						instance.values[property.id] = value;
	 				 					}
	 				 				}
	 				 			);
	 						}
	 						else
	 						{
	 							var value = cssValue;
		 						
	 							//	if color and in rgb, convert to hex
		 						if( property.type=='color' && value.match(/rgba*\((\d*),\s*(\d*),\s*(\d*),*\s*(\d*)\)/) )
		 						{
		 							var rgb = value.match(/rgba*\((\d*),\s*(\d*),\s*(\d*),*\s*(\d*)\)/);
		 							value = '#' + ((1 << 24) + (parseInt(rgb[1]) << 16) + (parseInt(rgb[2]) << 8) + parseInt(rgb[3])).toString(16).substr(1);
		 						}
		 						
	 							instance.values[property.id] = value;
	 						}
	 					}
	 					else if( definition.values 
	 							&& definition.values[property.id] )
	 					{
	 						instance.values[property.id] = definition.values[property.id];
	 					}
	 					else
	 					{
	 						instance.values[property.id] = getDefault( property );
	 					}
 					}
 				}
 			);
 		};
 		
		return {
			restrict : 'EA',
			scope:{
				isStatic: "=componentStatic",
				canvas: "=canvas",
				instance: "=componentInstance",
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
						var init = function()
						{
							if( !scope.instance ) return;
							
							//	set up scope
							if( !scope.id ) scope.id = FactoryService.uniqueId();
							
							//	set component's definition, handling an unrecognized/invalid component id
							if( !(scope.definition = library.componentsIndexed[scope.instance.componentId]) )
							{
								scope.definition = { container: false };
								scope.instance = { componentId: null };
							}
							
							//	whether in preview mode or not
							var previewing = scope.canvas && scope.canvas.previewing;
							
							scope.showBorder = (!previewing && scope.definition.container===true);
							scope.cellsAreDroppable = (!previewing && scope.definition.container==="cell");
							scope.isDroppable = (!previewing && !scope.isStatic && scope.instance.componentId!='label' && scope.instance.componentId!='image');
							scope.isDraggable = (!previewing && !scope.isStatic);
							
							//	store the component's id on the associated dom el so we can easily get the corresponding definition (see drag service)
							element.attr("data-component-id",scope.instance.componentId);
							
							$timeout
							(
								function()
								{
									setDefaultProperties( scope.definition, scope.instance, angular.element(element).find('.target')[0] );
								},1
							);
							
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
											if( !scope.instance.pid )	//	temp hack to disallow editing root canvas
												scope.canvas.selection = null;
											else
											{
												e.stopImmediatePropagation();
												
												scope.canvas.selection = {definition:scope.definition, instance: scope.instance, target: element.find('.target').get(0) };
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
							
				 			if( scope.instance.componentId == "image" )
							{
								//	store original dimensions on init and <src> change
				 				var storeDimensions = function(revert)
				 				{
				 					//	TODO: we shouldnt' have to do this if properly cleaned up on destroy
				 					if( !scope.instance ) return;
				 					
				 					revert = revert || false;
				 					
				 					$('<img/>')
				 						.attr('src',scope.instance.values.src)
				 						.load
					 					(
					 						function(e)
					 						{
					 							scope.instance.values.origWidth = this.width;
					 							scope.instance.values.origHeight = this.height;
					 							
					 							if( revert )
					 							{
					 								scope.instance.values.width = scope.instance.values.origWidth;
						 							scope.instance.values.height = scope.instance.values.origHeight;
					 							}
					 							
					 							scope.$apply();
					 						}
					 					);
				 				};
				 				
				 				scope.$watch
				 		 		(
				 		 			'instance.values.src',
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
				 			
				 			if( scope.instance.values
				 				&& scope.instance.values["auto-layout-children"]!==undefined )
				 			{
				 				scope.$watch
								(
									'instance.values["auto-layout-children"]',
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
							if( !scope.instance ) return;
							
							//	calculate size
							var values = scope.instance && scope.instance.values ? scope.instance.values : {width:-1,height:-1};
							
							var hasChildren = scope.instance.children
												&& scope.instance.children.length;
							
							if( scope.cellsAreDroppable
								&& scope.instance.values 
								&& scope.instance.values['auto-layout-children'] == true 
								&& hasChildren )
							{
								//	lay-out children
								for(var i = 0;i < scope.instance.children.length;i++)
								{
									var child = scope.instance.children[i];
									
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

						if( !scope.instance ) 
						{
							scope.$watch
							(
								'instance',
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
								'instance',
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
						
						$rootScope.$on
						(
							'restoreDefaults',
							function(e,args)
							{
								if( args 
									&& args[0] === scope.instance )
								{
									scope.instance.values = angular.copy(scope.definition.values);
						 			scope.instance.datamap = null;
						 			
						 			$timeout
					 				(
					 					function()
					 					{
					 						setDefaultProperties( scope.definition, scope.instance );
					 						
					 						scope.$apply();
					 					},
					 					1000
					 				);
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
