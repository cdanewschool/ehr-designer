app.controller
(
	'PropertyInspectorCtrl',
	[
	 	'$scope','$rootScope','propertyInspector','library','canvas','HistoryService',
	 	function($scope,$rootScope,propertyInspector,library,canvas,history)
	 	{
	 		$scope.propertyInspector = propertyInspector;
	 		
	 		$scope.component = null;
	 		$scope.definition = null;
	 		$scope.locked = {};

	 		var bindMapping = function()
	 		{
	 			if( !$scope.component ) return;
	 			
	 			if( $scope.component.binding == "single" )
	 			{
	 				if( !propertyInspector.selectedDataType || !propertyInspector.selectedData || !propertyInspector.selectedDataTypeField )
		 			{
		 				if( $scope.component.datamap )
		 					$scope.component.datamap.value = null;
		 				
		 				return;
		 			}
		 			
					angular.forEach
					(
						library.sampleData[$scope.component.datamap.type_id],
						function(item)
						{
							if( item.id == $scope.component.datamap.data_id )
							{
								var resolvePath = function(obj,path)
								{
									var obj = angular.copy(obj);
									
									for(var i=0,parts=path.split( /[\]\.\[]+/ );i<parts.length;i++)
									{
										if( obj[ parts[i] ] )
											obj = obj[ parts[i] ];
									}
									
									return obj;
								};
								
								$scope.component.datamap.value = resolvePath(item.content,$scope.component.datamap.field_id);
							}
						}
					);
	 			}
	 			else if( $scope.component.binding == "multiple" )
	 			{
	 				if( !propertyInspector.selectedData )
		 			{
		 				if( $scope.component.datamap )
		 					$scope.component.datamap.value = null;
		 				
		 				return;
		 			}
	 				
	 				var value = [];
	 				
	 				angular.forEach
					(
						propertyInspector.selectedData.content.entry,
						function(item)
						{
							value.push( {id:item.concept.coding.code.value,label:item.concept.coding.display.value});
						}
					);
	 				
	 				$scope.component.datamap.value = value;
	 			}
	 		};
	 		
	 		$scope.$watch
	 		(
	 			'component.datamap.type_id',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal != oldVal)
	 				{
	 					propertyInspector.selectedDataType = undefined;
	 					
	 					bindMapping();
	 					
	 					if( newVal )
	 						angular.forEach
	 						(
	 							library.sampleDataTypes,
	 							function(sampleDataType)
	 							{
	 								if( !propertyInspector.selectedDataType
	 									&& sampleDataType.id == $scope.component.datamap.type_id )
	 								{
	 									propertyInspector.selectedDataType = sampleDataType;
	 									
	 									bindMapping();
	 								}
	 							}
	 						);
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'component.datamap.field_id',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					propertyInspector.selectedDataTypeField = undefined;
	 					propertyInspector.selectedDataTypeDatum = undefined;
	 					
	 					bindMapping();
	 					
	 					if( newVal )
	 						angular.forEach
	 						(
	 							propertyInspector.selectedDataType.fields,
	 							function(sampleDataTypeField)
	 							{
	 								if( !propertyInspector.selectedDataTypeField 
	 									&& sampleDataTypeField.id == $scope.component.datamap.field_id )
	 								{
	 									propertyInspector.selectedDataTypeField = sampleDataTypeField;
	 									propertyInspector.selectedDataTypeData = library.sampleData[ $scope.component.datamap.type_id ];
	 									
	 									bindMapping();
	 								}
	 							}
	 						);
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'component.datamap.data_id',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					propertyInspector.selectedData = null;
	 					
	 					bindMapping();
	 					
	 					if( newVal && $scope.component.binding == "single" )
	 					{
	 						if( newVal )
		 						angular.forEach
		 						(
		 							propertyInspector.selectedDataTypeData,
		 							function(sampleDatum)
		 							{
		 								if( sampleDatum.id == $scope.component.datamap.data_id )
		 								{
		 									propertyInspector.selectedData = sampleDatum;
		 									
		 									bindMapping();
		 								}
		 							}
		 						);
	 					}
	 					else if( newVal && $scope.component.binding == "multiple" )
	 					{
	 						angular.forEach
	 						(
	 							library.sampleData.bundle,
	 							function(sampleDatum)
	 							{
	 								if( sampleDatum.id == $scope.component.datamap.data_id )
	 								{
	 									propertyInspector.selectedData = sampleDatum;
	 									
	 									bindMapping();
	 								}
	 							}
	 						);
	 					}
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'canvas.selection',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					$scope.component = null;
	 					$scope.definition = null;
	 					$scope.target = null;
	 					
	 					if( newVal )
	 					{
	 						$scope.component = newVal.instance;
		 					$scope.definition = newVal.definition;
		 					$scope.target = newVal.target;
		 					
		 					if( $scope.timeout )
		 						clearTimeout($scope.timeout);
		 					
		 					$scope.timeout = setTimeout(init,500);
	 					}
	 				}
	 			}
	 		);
	 		
	 		$scope.deleteComponent = function()
	 		{
				$rootScope.$emit('deleteComponent');
	 		};
	 		
	 		$scope.propagateChange = function(property,values,value)
	 		{
	 			if( $scope.locked[property.id]===true )
	 				for(var p in values)
	 					values[p] = value;
	 		};
	 		
	 		$scope.revertSize = function()
	 		{
	 			$scope.component.values.width = $scope.component.values.origWidth;
	 			$scope.component.values.height = $scope.component.values.origHeight;
	 			
	 			history.save( "Resized to " + $scope.component.values.width + " x " + $scope.component.values.height );
	 		};
	 		
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
								
	 			}
	 		};
	 		
	 		var rgbToHex = function(r, g, b) 
	 		{
	 			var componentToHex = function(c) 
	 			{
	 			    var hex = c.toString(16);
	 			    return hex.length == 1 ? "0" + hex : hex;
	 			};
	 				
	 			var hex = componentToHex(r) + componentToHex(g) + componentToHex(b);
	 			
	 		    return "#" + hex;
	 		};
	 		
	 		var setDefaultProperties = function(definition,instance)
	 		{
	 			angular.forEach
	 			(
	 				definition.properties,
	 				function(property)
	 				{
	 					if( !instance.values[property.id] )
	 					{
	 						//	 init properties of type object to empty object to prevent null pointer exception
		 					if( property.type == "object" )
		 						instance.values[property.id] = {};
		 					
		 					//	sync existing css to supported component properties
		 					if( angular.element($scope.target).css(property.id) )
		 					{
		 						var cssValue = angular.element($scope.target).css(property.id);
		 						
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
		 					else if( definition.values[property.id] )
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
	 		
	 		var init = function()
	 		{
	 			if( angular.element($scope.target).attr('data-initialized') == 'true' ) return;
	 			
	 			if( !$scope.definition ) return;
	 			
	 			setDefaultProperties( $scope.definition, $scope.component );
	 			
	 			angular.forEach
	 			(
	 				$scope.component.children,
	 				function(child)
	 				{
	 					setDefaultProperties(library.componentsIndexed[ child.componentId ],child); 
	 				}
	 			);
	 			
	 			angular.element($scope.target).attr('data-initialized', 'true' );
	 			
				$scope.$apply();
	 		};
	 	}
	]
);