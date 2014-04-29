app.controller
(
	'TabCtrl',
	[
	 	'$scope','FactoryService','library','DragService',
	 	function($scope,factory,library,dragService)
	 	{
	 		$scope.tabs = [];
	 		
	 		$scope.onMouseOver = function(e,index)
	 		{
	 			if( !dragService.dragModel.dragging ) return;
	 			
	 			angular.forEach($scope.tabs,function(item){ item.active = false; } );
	 			
	 			$scope.tabs[index].active = true;
	 		};
	 		
	 		$scope.onMouseEnter = function(e)
	 		{
	 			e.preventDefault();
	 			
	 			dragService.dragModel.hover=$scope.instanceDefinition;
	 		};
	 		
	 		$scope.placeChild = function(item)
	 		{
	 			var index = $scope.definition.values.items.indexOf(item);
	 			
	 			if( !$scope.definition.children )
	 				$scope.definition.children = [];
	 			
	 			if( !$scope.definition.children[index] )
					$scope.definition.children[index] = factory.componentInstance( library.componentsIndexed['ui_component'],{} );
	 		};
	 		
	 		var initTabs = function(l)
	 		{
	 			l = l || $scope.definition.values.items.length;
	 			
	 			var tabs = $scope.tabs.splice(0,l);
					
				for(var i=$scope.tabs.length-1;i<$scope.definition.values.items.length;i++)
				{
					tabs.push( {active:i==0} );
				}
				
				$scope.tabs = tabs;
	 		};
	 		
	 		$scope.$watchCollection
	 		(
	 			'definition.values.items',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					initTabs(oldVal.length);
	 				}
	 			}
	 		);
	 		
	 		initTabs();
	 	}
	 ]
);