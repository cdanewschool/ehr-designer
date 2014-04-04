app.controller
(
	'PropertyInspectorCtrl',
	[
	 	'$scope','library','DragService',
	 	function($scope,library,dragService)
	 	{
	 		$scope.dragService = dragService;
	 		
	 		$scope.component = null;
	 		$scope.definition = null;
	 		$scope.locked = {};
	 		
	 		$scope.$watch
	 		(
	 			'dragService.dragModel.selection',
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
		 					
		 					init();
	 					}
	 				}
	 			}
	 		);
	 		
	 		$scope.propagateChange = function(property,values,value)
	 		{
	 			if( $scope.locked[property.id]===true )
	 				for(var p in values)
	 					values[p] = value;
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
		 							instance.values[property.id] = getDefault( property );
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
	 			//	do not re-initialize
	 			if( angular.element($scope.target).attr('data-initialized') == 'true' ) return;
	 			
	 			setDefaultProperties( $scope.definition, $scope.component );
	 			
	 			angular.forEach
	 			(
	 				$scope.component.children,
	 				function(child)
	 				{
	 					setDefaultProperties(library.componentsIndexed[ child.cid ],child); 
	 				}
	 			);
	 			
	 			angular.element($scope.target).attr('data-initialized', 'true' );
	 		};
	 	}
	]
);