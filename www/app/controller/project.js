app.controller
(
	'ProjectCtrl',
	[
	 	'$scope','$rootScope','model','project','dragModel','ProjectService','HistoryService',
	 	function($scope,$rootScope,model,project,dragModel,ProjectService,HistoryService)
	 	{
	 		$scope.$watch
	 		(
	 			'project.page',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal && !newVal )
	 				{
	 					dragModel.selection = null;
	 				}
	 			}
	 		);
	 		
	 		$scope.pendingPage = null;
	 		$scope.pendingSection = null;
	 		
	 		$scope.selectSection = function(section)
			{
				ProjectService.selectSection( project.document.children.indexOf( section ) );
				
				project.pendingSection = null;
			};
			
			$scope.addSection = function()
			{
				ProjectService.addSection();
				
				project.section = null;
				project.page = null;
				
				HistoryService.save( "Added new section" );
			};
			
			$scope.deleteSection = function(section)
			{
				ProjectService.deleteSection(section);
				
				project.pendingSection = null;
				
				HistoryService.save( "Removed section" );
			};
			
			$scope.selectPage = function(page)
			{
				ProjectService.selectPage( project.section.children.indexOf( page ) );
				
				project.pendingPage = null;
			};
			
			$scope.addPage = function(page)
			{
				ProjectService.addPage();
				
				project.page = null;
				
				HistoryService.save( "Added new page" );
			};
			
			$scope.deletePage = function(page)
			{
				ProjectService.deletePage(page);
				
				project.pendingPage = null;
				
				HistoryService.save( "Removed page" );
			};
			
			$scope.clearCanvas = function()
			{
				project.page.children = [];
				
				HistoryService.save( "Cleared canvas" );
			};
	 	}
	 ]
);