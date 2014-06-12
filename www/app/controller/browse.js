app.controller
(
	'BrowseCtrl',
	[
	 	'$scope','$rootScope','$routeParams','canvas','Project','CanvasService','DragService','library',
	 	function($scope,$rootScope,$routeParams,canvas,Project,canvasService,dragService,library)
	 	{
	 		$scope.dragService = dragService;
	 		$scope.canvas = canvas;
	 		
	 		$scope.currentProject = null;
	 		$scope.currentPage = null;
	 		$scope.currentPageId = null;
	 		
	 		$scope.$watch
	 		(
	 			'currentProject',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					$scope.selectPageByIndex(0);
	 				}
	 			}
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'currentProjectIndex',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					$scope.selectPageByIndex($scope.currentProjectIndex);
	 					$scope.$apply();
	 				}
	 			}
	 		);
	 		
	 		if( $routeParams.projectId )
			{
	 			var initProject = function()
		 		{
		 			Project.get
					(
						{
							projectId:$routeParams.projectId
						},
						function(response)
						{
							canvas.previewing = true;
							$scope.currentProject = response;
						},
						function(response)
						{
						}
					);
		 		};
		 		
	 			if( !library.components )
	 				canvasService.getComponents().then( initProject );
	 			else
	 				initProject();	 			
			};
			
			$scope.selectPageByIndex = function(index)
			{
				if( !$scope.currentProject || !$scope.currentProject.content.children || $scope.currentProject.content.children.length<index )
				{
					$scope.currentPage = null;
					return;
				}
				
				$scope.currentPage = $scope.currentProject.content.children[index];
			};
			
	 		$scope.find = function( filterByUser )
	 		{
	 			var query = {};
	 			
	 			if( filterByUser )
	 			{
	 				if( !$rootScope.currentUser )
	 					return;
	 				
	 				query = { userId: $rootScope.currentUser._id };
	 			}
	 			
	 			Project.query
	 			(
	 				query,
	 				function(response)
	 				{
	 					console.log( response );
	 					
	 					$scope.projects = response;
	 				}
	 			);
	 		};
	 	}
	 ]
);