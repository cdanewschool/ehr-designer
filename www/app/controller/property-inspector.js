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
	 		
	 		//	sets a component's value(s) to a dummy datum, vs. a manually entered value
	 		var bindMapping = function()
	 		{
	 			if( !$scope.component || !$scope.component.datamap ) return;
	 			
	 			//	component supports mapping to a single object property
	 			if( $scope.component.binding == "single" )
	 			{
	 				//	nullify and return if not all selections have been made
	 				if( !propertyInspector.selectedDataType || !propertyInspector.selectedData || !propertyInspector.selectedDataTypeField )
		 			{
		 				if( $scope.component.datamap )
		 					$scope.component.datamap.value = null;
		 				
		 				return;
		 			}
		 			
	 				//	find sample datum that matches the selection
					angular.forEach
					(
						library.sampleData[$scope.component.datamap.type_id],
						function(item)
						{
							//	check if its a match
							if( item.id == $scope.component.datamap.data_id )
							{
								//	resolves the value of path (dot-delimited string) on obj (object)
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
								
								history.save( "Bound " + $scope.component.componentId + " to " + propertyInspector.selectedData.title + propertyInspector.selectedDataTypeField.label );
							}
						}
					);
	 			}
	 			//	component supports binding to a list of items
	 			else if( $scope.component.binding == "multiple" )
	 			{
	 				//	 nullify and return if not all selections have been made
	 				if( !propertyInspector.selectedData )
		 			{
		 				if( $scope.component.datamap )
		 					$scope.component.datamap.value = null;
		 				
		 				return;
		 			}
	 				
	 				var value = [];
	 				
	 				//	find datum that matches the selection
	 				angular.forEach
					(
						propertyInspector.selectedData.content.entry,
						function(item)
						{
							value.push( {id:item.concept.coding.code.value,label:item.concept.coding.display.value});
						}
					);
	 				
	 				$scope.component.datamap.value = value;
	 				
	 				history.save( "Bound " + $scope.component.name + " to " + propertyInspector.selectedData.title );
	 			}
	 		};
	 		
	 		//	update binding when relevant selections change in inspector
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
	 		
	 		//	 update binding when relevant selections change in inspector
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
	 		
	 		//	update binding when relevant selections change in inspector
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
	 					
	 					if( canvas.fieldWithFocus )
	 					{
	 						angular.element(canvas.fieldWithFocus).focusout();
	 						
	 						canvas.fieldWithFocus = null; 
	 					}
	 					
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
	 		
	 		$scope.propagateChange = function(property,subProperty,values,value)
	 		{
	 			if( $scope.locked[property.id]===true )
	 				for(var i=0;i<property.properties.length;i++)
	 					if( property.properties[i].type == subProperty.type )
	 						values[ property.properties[i].id ] = value;
	 		};
	 		
	 		$scope.revertSize = function()
	 		{
	 			$scope.component.values.width = $scope.component.values.origWidth;
	 			$scope.component.values.height = $scope.component.values.origHeight;
	 			
	 			history.save( "Resized to " + $scope.component.values.width + " x " + $scope.component.values.height );
	 		};
	 		
	 		$scope.addArrayItem = function(property)
	 		{
	 			if( !propertyInspector.itemLabels[property.id] ) return;
	 			
	 			if( !$scope.component.values[property.id] ) 
	 				$scope.component.values[property.id] = new Array();
	 			
	 			$scope.component.values[property.id].push( {label:propertyInspector.itemLabels[property.id]} );
	 			
	 			for(var i=0;i<$scope.component.values[property.id].length;i++)
	 				$scope.component.values[property.id][i].index = i;
	 			
	 			history.save( "Added <strong>" + propertyInspector.itemLabels[property.id] + "</strong> to " + $scope.component.componentId + "'s " + property.id );
	 			
	 			propertyInspector.itemLabels[property.id] = null;
	 		};
	 		
	 		$scope.deleteArrayItem = function(event,property,index)
	 		{
	 			event.stopPropagation();
	 			
	 			var value = $scope.component.values[property.id][index];
	 			
	 			$scope.component.values[property.id].splice( index, 1 );
	 			
	 			history.save( "Removed <strong>" + value.label + "</strong> from " + $scope.component.componentId + " " + property.id );
	 		};
	 		
	 		$scope.restoreDefaults = function()
	 		{
	 			$scope.component.values = angular.copy($scope.definition.values);
	 			$scope.component.datamap = null;
	 			
 				setTimeout
 				(
 					function()
 					{
 						setDefaultProperties( $scope.definition, $scope.component );
 						
 						$scope.$apply();
 					},
 					1000
 				);
	 		};
	 		
	 		$scope.setColorToTransparent = function(property)
	 		{
	 			var oldVal = $scope.component.values[property.id];
	 			
	 			$scope.component.values[property.id] = 'transparent';
	 			
	 			history.save( "Changed " + $scope.component.componentId + "'s " + property.id + " from " + oldVal + " to <strong>transparent</strong>" );
	 		};
	 		
	 		var init = function()
	 		{
	 			if( !$scope.definition ) return;
	 			
	 			propertyInspector.itemLabels = {};
	 		};
	 	}
	]
);