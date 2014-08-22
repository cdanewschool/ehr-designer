app.controller
(
	'PropertyInspectorCtrl',
	[
	 	'$scope','$rootScope','$modal','propertyInspector','library','canvas','HistoryService','dragModel',
	 	function($scope,$rootScope,$modal,propertyInspector,library,canvas,history,dragModel)
	 	{
	 		$scope.propertyInspector = propertyInspector;
	 		
	 		$scope.instance = null;
	 		$scope.definition = null;
	 		$scope.locked = {};
	 		
	 		$scope.selectedDataTypeOptions = null;
	 		$scope.selectedDataTypeDataOptions = null;
	 		$scope.sampleDataTypeOptions = null;
	 		$scope.sampleDataBundleOptions = null;
	 		
	 		//	sets a component's value(s) to a dummy datum, vs. a manually entered value
	 		var bindMapping = function()
	 		{
	 			if( !$scope.instance || !$scope.instance.datamap ) return;
	 			if( !$scope.definition || !$scope.definition.binding ) return;
	 			
	 			//	component supports mapping to a single object property
	 			if( $scope.definition.binding.dataType == "object" )
	 			{
	 				//	nullify and return if not all selections have been made
	 				if( !propertyInspector.selectedDataType || !propertyInspector.selectedData || !propertyInspector.selectedDataTypeField )
		 			{
		 				if( $scope.instance.datamap )
		 					$scope.instance.datamap.value = null;
		 				
		 				return;
		 			}
		 			
	 				//	find sample datum that matches the selection
					angular.forEach
					(
						library.sampleData[$scope.instance.datamap.type_id],
						function(item)
						{
							//	check if its a match
							if( item.id == $scope.instance.datamap.data_id )
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
								
								$scope.instance.datamap.value = resolvePath(item.content,$scope.instance.datamap.field_id);
								
								history.save( "Bound " + $scope.instance.componentId + " to " + propertyInspector.selectedData.title + propertyInspector.selectedDataTypeField.label );
							}
						}
					);
	 			}
	 			//	component supports binding to a list of items
	 			else if( $scope.definition.binding.dataType === "list" )
	 			{
	 				//	 nullify and return if not all selections have been made
	 				if( !propertyInspector.selectedData )
		 			{
		 				if( $scope.instance.datamap )
		 					$scope.instance.datamap.value = null;
		 				
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
	 				
	 				$scope.instance.datamap.value = value;
	 				
	 				history.save( "Bound " + $scope.instance.name + " to " + propertyInspector.selectedData.title );
	 			}
	 		};
	 		
	 		//	update binding when relevant selections change in inspector
	 		$scope.$watch
	 		(
	 			'instance.datamap.type_id',
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
	 									&& sampleDataType.id == $scope.instance.datamap.type_id )
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
	 			'instance.datamap.field_id',
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
	 									&& sampleDataTypeField.id == $scope.instance.datamap.field_id )
	 								{
	 									propertyInspector.selectedDataTypeField = sampleDataTypeField;
	 									propertyInspector.selectedDataTypeData = library.sampleData[ $scope.instance.datamap.type_id ];
	 									
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
	 			'instance.datamap.data_id',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					propertyInspector.selectedData = null;
	 					
	 					bindMapping();
	 					
	 					if( newVal && $scope.definition.binding.dataType == "object" )
	 					{
	 						if( newVal )
		 						angular.forEach
		 						(
		 							propertyInspector.selectedDataTypeData,
		 							function(sampleDatum)
		 							{
		 								if( sampleDatum.id == $scope.instance.datamap.data_id )
		 								{
		 									propertyInspector.selectedData = sampleDatum;
		 									
		 									bindMapping();
		 								}
		 							}
		 						);
	 					}
	 					else if( newVal && $scope.definition.binding.dataType === "list" )
	 					{
	 						angular.forEach
	 						(
	 							library.sampleData.bundle,
	 							function(sampleDatum)
	 							{
	 								if( sampleDatum.id == $scope.instance.datamap.data_id )
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
	 					$scope.instance = null;
	 					$scope.definition = null;
	 					$scope.target = null;
	 					
	 					if( canvas.fieldWithFocus )
	 					{
	 						angular.element(canvas.fieldWithFocus).focusout();
	 						
	 						canvas.fieldWithFocus = null; 
	 					}
	 					
	 					if( newVal )
	 					{
	 						$scope.instance = newVal.instance;
		 					$scope.definition = newVal.definition;
		 					$scope.target = newVal.target;
		 					
		 					if( $scope.timeout )
		 						clearTimeout($scope.timeout);
		 					
		 					$scope.timeout = setTimeout(init,500);
	 					}
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'library.sampleData',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 			 		$scope.sampleDataTypeOptions = newVal ? [{id:undefined,label:'------'}].concat(library.sampleDataTypes) : null;
	 			 		$scope.sampleDataBundleOptions = newVal ? [{id:undefined,title:'------'}].concat(library.sampleData.bundle) : null;
	 				}
	 			}
	 		);
	 		$scope.$watch
	 		(
	 			'propertyInspector.selectedDataType',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					$scope.selectedDataTypeOptions = newVal ? [{id:undefined,label:'.______'}].concat(newVal.fields) : null;
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'propertyInspector.selectedDataTypeField',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					$scope.selectedDataTypeDataOptions = newVal ? [{id:undefined,title:'.______'}].concat(propertyInspector.selectedDataTypeData) : null;
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
	 			$scope.instance.values.width = $scope.instance.values.origWidth;
	 			$scope.instance.values.height = $scope.instance.values.origHeight;
	 			
	 			history.save( "Resized to " + $scope.instance.values.width + " x " + $scope.instance.values.height );
	 		};
	 		
	 		$scope.addArrayItem = function(property)
	 		{
	 			if( !propertyInspector.itemLabels[property.id] ) return;
	 			
	 			if( !$scope.instance.values[property.id] ) 
	 				$scope.instance.values[property.id] = new Array();
	 			
	 			$scope.instance.values[property.id].push( {label:propertyInspector.itemLabels[property.id]} );
	 			
	 			for(var i=0;i<$scope.instance.values[property.id].length;i++)
	 				$scope.instance.values[property.id][i].index = i;
	 			
	 			history.save( "Added <strong>" + propertyInspector.itemLabels[property.id] + "</strong> to " + $scope.instance.componentId + "'s " + property.id );
	 			
	 			propertyInspector.itemLabels[property.id] = null;
	 		};
	 		
	 		$scope.deleteArrayItem = function(event,property,index)
	 		{
	 			event.stopPropagation();
	 			
	 			var value = $scope.instance.values[property.id][index];
	 			
	 			$scope.instance.values[property.id].splice( index, 1 );
	 			
	 			history.save( "Removed <strong>" + value.label + "</strong> from " + $scope.instance.componentId + " " + property.id );
	 		};
	 		
	 		$scope.restoreDefaults = function()
	 		{
	 			$rootScope.$emit('restoreDefaults',[$scope.instance]);
	 		};
	 		
	 		$scope.setColorToTransparent = function(property)
	 		{
	 			var oldVal = $scope.instance.values[property.id];
	 			
	 			$scope.instance.values[property.id] = 'transparent';
	 			
	 			history.save( "Changed " + $scope.instance.componentId + "'s " + property.id + " from " + oldVal + " to <strong>transparent</strong>" );
	 		};
	 		
	 		$scope.browseMedia = function()
	 		{
	 			var modalInstance = $modal.open
	 			(
	 				{
	 					templateUrl: "partials/templates/media-browser.html",
	 					controller: 'MediaCtrl'
	 				}	
	 			);
	 			
	 			return modalInstance.result;
	 		};
	 		
	 		$scope.selectMedia = function(values,property)
	 		{
	 			$scope.browseMedia().then
	 			(
	 				function(image)
	 				{
	 					values[property.id] = "/image/?id=" + image.id;
	 					
	 					if( image.contentType == "image/png" 
	 						&& values['background-color'] )
	 						values['background-color'] = "transparent";
	 						
	 				}
	 			);
	 		};
	 		
	 		$scope.includeBindableDataType = function(dataType)
	 		{
	 			if( !$scope.definition || !$scope.definition.binding ) return false;
	 			if( dataType && !dataType.id ) return true;
	 			
	 			if( $scope.definition.binding.dataType === "object" 
	 				&& $scope.definition.binding.fields )
	 			{
	 				for( var f in $scope.definition.binding.fields )
	 					if( $scope.definition.binding.fields[f].id === dataType.id )
	 						return true;
	 				
	 				return false;
	 			} 				
	 			
	 			return $scope.definition.binding.dataType === "object";
	 		};
	 		
	 		$scope.includeBindableField = function(field)
	 		{
	 			if( !$scope.definition || !$scope.definition.binding ) return false;
	 			if( field && !field.id ) return true;
	 			
	 			if( $scope.definition.binding.dataType === "object" 
	 				&& $scope.definition.binding.fields
	 				&& field )
	 			{
	 				for( var f in $scope.definition.binding.fields )
	 				{
	 					if( $scope.definition.binding.fields[f].path === field.id )
	 						return true;
	 				}
	 				
	 				return false;
	 			}
	 			
	 			return $scope.definition.binding.dataType === "object";
	 		};
	 		
	 		$scope.onSortableStart = function()
	 		{
	 			dragModel.dragItem = null;
	 		};
	 		
	 		var init = function()
	 		{
	 			if( !$scope.definition ) return;
	 			
	 			propertyInspector.itemLabels = {};
	 		};
	 	}
	]
);
