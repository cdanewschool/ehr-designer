app.controller
(
	'BrowseCtrl',
	[
	 	'$scope','$rootScope','$routeParams','$location','canvas','Project','ProjectService','CanvasService','DragService','library','navigation',
	 	function($scope,$rootScope,$routeParams,$location,canvas,Project,projectService,canvasService,dragService,library,navigation)
	 	{
	 		$scope.dragService = dragService;
	 		$scope.projectService = projectService;
	 		$scope.canvas = canvas;
	 		$scope.navigation = navigation;
	 		
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
	 					$scope.selectPageByIndex( $routeParams.pageId ? $routeParams.pageId - 1 : 0 );
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
							$location.path( '/' + $location.$$path.substr( 1, $location.$$path.lastIndexOf('/')-1 ) );
						}
					);
		 		};
		 		
	 			if( !library.components )
	 				canvasService.getElements().then( canvasService.getComponents ).then( canvasService.getTemplates ).then( initProject );
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
				
				$scope.currentPage = $scope.currentProject.content.children[ (index < $scope.currentProject.content.children.length ? index : 0) ];
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
	 					$scope.projects = response;
	 				}
	 			);
	 		};
	 		
	 		$scope.addPage = function(project)
	 		{
	 			//	add a page and save project on success
	 			projectService.addPage(project,true).then
	 			(
 					function()
					{
						project.$update
						(
							{
								projectId:project._id
							}
						);
					}
	 			);
	 		};
	 		
	 		$scope.editPage = function(page,project)
			{
	 			projectService.editItemProperties(page).then
				(
					function()
					{
						project.$update
						(
							{
								projectId:project._id
							}
						);
					}
				);
			};
			
			$scope.editProject = function(project)
			{
				projectService.editItemProperties(project.content).then
				(
					function()
					{
						project.$update
						(
							{
								projectId:project._id
							}
						);
					}
				);
			};
	 	}
	 ]
);