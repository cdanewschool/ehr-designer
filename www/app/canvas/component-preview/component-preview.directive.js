/**
 * component-preview
 * 
 * This directive renders a component definition and it's children, which as component-previews 
 * themselves, results in a recursively-build, nested DOM structure
 * 
 * (see www/app/canvas/component-preview.directive.html for the corresponding template file)
 */
app.directive
(
	'componentPreview',
	function($rootScope,$compile,$timeout,library,canvas)
	{
		/**
		 * Returns the default definition for a style property definition
		 * 
		 * @param {Object} property The style property object containing 'type' and 'values' props
		 * 
		 * @return The default value (mixed, depending on property type)
		 */
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
 					
 					//return "#000000";
 					
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
 		
 		/**
 		 * Initializes the property values on a created component instance by copying over
 		 * any valid values from the component that was dragged, and deferring to defaults
 		 * for values that aren't present
 		 * 
 		 * @param {Object} definition The object containing the definition for the instance
 		 * @param {Object} instance The object representing a component instance
 		 * @param {Object} element The source element that was dragged to create 'instance' by the drag service
 		 */
 		var setDefaultProperties = function(definition,instance,element)
 		{
 			var classes = [];
 			
 			if( angular.element(element).hasClass('target') )
 			{
 				classes.push( 'target' );
 				
 				angular.element(element).removeClass('target');
 			}
 			
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
 			
 			if( classes.length )
 				angular.element(element).addClass( classes.join(' ') );
 		};
 		
		return {
			restrict : 'EA',
			scope:{
				canvas: "=canvas",
				dragService:"=dragService",
				instance: "=componentInstance",
				isStatic: "=componentStatic",
				preview: "=preview",
				simpleRender: "=simpleRender"
			},
			templateUrl: "app/canvas/component-preview/component-preview.directive.html",
			replace: true,
			controller: function($scope)
			{
				this.onDrag = function(e,ui)
				{
					$scope.dragService.onDrag(e,ui,$scope.instance);
				};
				
				this.onDragStart = function(e,ui)
				{
					$scope.dragService.onDragStart(e,ui,$scope.instance);
				};
				
				this.onDragOver = function(e,ui)
				{
					$scope.dragService.onDragOver(e,ui,$scope.instance);
				};
				
				this.onDragStop = function(e,ui)
				{
					$scope.dragService.onDragStop(e,ui);
				};
				
				this.onDrop = function(e,ui)
				{
					$scope.dragService.onDrop(e,ui,$scope.instance);
				};
				
				this.acceptDrop = function()
				{
					return $scope.dragService.acceptDrop($scope.instance);
				};
				
				this.getDragPreview = function(e)
				{
					return $scope.dragService.getDragPreview(e);
				};
			},
			compile:function(element,attrs)
			{
				var contents = element.contents().remove();
	            var compiledContents;
	            
				return {
					pre: function preLink(scope, element, attrs) {},
					post: function postLink(scope,element,attrs)
					{
						var init = function()
						{
							if( !scope.instance ) return;
							
							//	set component's definition, handling an unrecognized/invalid component id
							if( !(scope.definition = library.elementsIndexed[scope.instance.componentId]) )
							{
								if( !(scope.definition = library.componentsIndexed[scope.instance.componentId]) )
								{
									scope.definition = { container: false };
									scope.instance = { componentId: null };
								}
							}
							
							//	whether in preview mode or not
							var previewing = scope.preview || (scope.canvas && scope.canvas.previewing);
							
							scope.cellsAreDroppable = (!previewing && scope.definition.container==="cell");
							scope.isDroppable = (!previewing && !scope.isStatic && scope.instance.componentId!='label' && scope.instance.componentId!='image');
							
							element
							
								/**
								 * Unique id for the component instance
								 * 
								 * For items in the library, this is a string identifier (i.e. "textinput", "grid", etc); for 
								 * instances of an item appearing on the stage, this is an int
								 */
								.attr("data-id",scope.instance.id)
								
								/**
								 * Id of the element this element/component/template is based on
								 * 
								 * For elements, this will be the same as their string identifier, while for components and templates, 
								 * this will be the id of an element (i.e. "grid")
								 */
								.attr("data-component-id",scope.instance.componentId)
								
								//	 string identifying type of component (element, component or template)
								.attr("data-component-type",scope.instance.type)
								.toggleClass('border',scope.preview ? true : false)
								.toggleClass('static',scope.isStatic ? true : false)
								.toggleClass('root',!scope.instance.pid ? true : false)
								.toggleClass('full-width',scope.instance.isTemplate && (scope.instance.values.width && scope.instance.values.width=="100%" || scope.instance.values.height && scope.instance.values.height=="100%") ? true : false);
							
							if( !scope.isStatic )
								updateDynamicStyles();
							
							if( !scope.simpleRender )
							{
								//	detect and clear `isNew` prop set on newly-added component's `values` obj by drag manager
								if( scope.instance.values
									&& scope.instance.values.isNew )
								{
									delete scope.instance.values.isNew;
									
									$timeout
									(
										function()
										{
											setDefaultProperties( scope.definition, scope.instance, angular.element(element).find('.target')[0] );
										},100
									);
								}
							}
							
							//	do some things if this is a (non-static) image
				 			if( scope.instance.componentId == "image"
				 				&& !scope.isStatic )
							{
								var setImageSource = function(revert)
				 				{
				 					//	TODO: we shouldnt' have to do this if properly cleaned up on destroy
				 					if( !scope.instance ) return;
				 					
				 					revert = revert || false;
				 					
				 					$('<img/>')
				 						.attr('src',scope.instance.datamap && scope.instance.datamap.value ? scope.instance.datamap.value : scope.instance.values.src)
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
				 				
				 				//	store original image dimensions when source changes
				 				scope.$watch
				 		 		(
				 		 			'instance.values.src',
				 		 			function(newVal,oldVal)
				 		 			{
				 		 				if( newVal != oldVal && newVal )
				 		 					setImageSource(true);
				 		 			}
				 		 		);
				 		 		
				 		 		scope.$watch
				 		 		(
				 		 			'instance.datamap.value',
				 		 			function(newVal,oldVal)
				 		 			{
				 		 				if( newVal != oldVal && newVal )
				 		 					setImageSource(true);
				 		 			}
				 		 		);
				 				
				 				setImageSource();
							}
				 			
				 			//	if automatic laying-out of children is supported, listen
				 			//	for changes to this property
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
							if( scope.isStatic ) return;
							
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
						
						var updateDynamicStyles = function()
						{
							element.toggleClass('previewing',scope.preview || (scope.canvas && scope.canvas.previewing));
							
							angular.element('[data-id="'+scope.instance.id+'"] > .outline')
								.toggleClass('droppable',scope.isDroppable ? true : false);
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
						 						setDefaultProperties( scope.definition, scope.instance, angular.element(element).find('.target')[0] );
						 						
						 						scope.$apply();
						 					},
						 					100
						 				);
									}
								}
							);
							
							update();
						}
						
						if( scope.simpleRender )
						{
							element.append(scope.instance.name);
						}
						else
						{
							if( !compiledContents ) 
							{
								compiledContents = $compile(contents);
			                }
							
			                compiledContents
			                (
			                	scope, 
			                	function(clone)
			                	{
			                		element.append(clone);
			                	}
			                );
						}
					}
			    };
			}
		};
	}
);
