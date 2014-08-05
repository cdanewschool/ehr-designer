/**
 * Controller for /browse and /myprojects views
 */
app.controller
(
	'BrowseCtrl',
	[
	 	'$scope','$rootScope','$routeParams','$location','$window','$modal','canvas','ExportType','Project','ProjectService','CanvasService','library','navigation',
	 	function($scope,$rootScope,$routeParams,$location,$window,$modal,canvas,ExportType,Project,projectService,canvasService,dragService,library,navigation)
	 	{
	 		$scope.canvas = canvas;
	 		$scope.navigation = navigation;
	 		
	 		$scope.currentProject = null;
	 		$scope.currentPage = null;
	 		$scope.currentPageId = null;
	 		
	 		// reset the selected page to the first page when project changes
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
	 		
	 		//	look for projectId in url and initialize associated project if set
	 		//	if not, redirect to page root
	 		if( $routeParams.projectId )
			{
	 			function loadProject(projectId)
		 		{
		 			Project.get
					(
						{
							projectId:projectId
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
		 		
		 		//	load data definitions if not loaded yet then load project
	 			if( !library.components )
	 				canvasService.getElements()
	 					.then( canvasService.getComponents )
	 					.then( canvasService.getTemplates )
	 					.then( function(){ loadProject($routeParams.projectId); } );
	 			else
	 				loadProject($routeParams.projectId);	 			
			};
			
			/**
			 * Selects the currently-selected project's page by index (0-based)
			 * 
			 * @param {int} index Index of the page to be selected
			 */
			$scope.selectPageByIndex = function(index)
			{
				//	clamp the index to valid page range
				index = Math.max( 0, Math.min(index, $scope.currentProject.content.children.length-1) );
				
				if( !$scope.currentProject || !$scope.currentProject.content.children )
				{
					$scope.currentPage = null;
					return;
				}
				
				$scope.currentPage = $scope.currentProject.content.children[ (index < $scope.currentProject.content.children.length ? index : 0) ];
			};
			
			/**
			 * Gets all projects from server and sets on scope
			 * 
			 * @param {boolean} filterByUser Whether to filter by projects owned by logged-in user
			 */
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
	 		
	 		/**
	 		 * Adds a page to the specified project and saves the project on success
	 		 * 
	 		 * @param {Project} project Project to add a page to
	 		 */
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
	 		
	 		/**
	 		 * Deletes a page and saves the project on success
	 		 * 
	 		 * @param {Object} page Page to edit
	 		 * @param {Project} project Project the page to edit belongs to
	 		 */
			$scope.deletePage = function(page,project)
			{
				projectService.deletePage(page,project).then
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
			
			/**
	 		 * Spawns a modal for editing page properties and saves the project on success 
	 		 * 
	 		 * @param {Object} page Page to edit
	 		 * @param {Project} project Project the page to edit belongs to
	 		 */
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
			
			/**
	 		 * Spawns a modal for editing project properties and saves the project on success 
	 		 * 
	 		 * @param {Project} project The project to edit
	 		 */
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
			
			$scope.exportProject = function(project)
			{
				var ModalCtrl = function($scope,$modalInstance,project)
	 			{
					$scope.defaultExportType = {id:undefined,title:"None"};
					
	 				ExportType.get
					(
						{},
						function(response)
						{
							$scope.exportTypes = [$scope.defaultExportType].concat(response);
							$scope.exportType = $scope.defaultExportType;
						},
						function(response)
						{
						}
					);
	 				
	 				$scope.exportType = undefined;
	 				
	 				$scope.close = function()
	 				{
	 					$window.open('/api/projects/' + project._id + '/export/' + $scope.exportType.id);
	 					$modalInstance.close();
	 				};
	 			};
	 			
	 			$modal.open
	 			(
	 				{
	 					template: '<div class="modal-header"><h4 class="modal-title">Export Project<button type="button" class="close" ng-click="$dismiss()" aria-hidden="true">&times;</button></h4></div><div class="modal-body"><form role="form" class="form-horizontal"><div><label class="control-label">Select an export type:</label><select class="form-control" ng-model="$parent.exportType" ng-options="o as o.title for o in exportTypes"></select></div></form><div class="well" style="margin-top:10px;" ng-show="$parent.exportType.id"><p>{{exportType.description}}</p><p ng-show-"$parent.exportType.urls.length">For more info visit: <span ng-repeat="url in $parent.exportType.urls"><span ng-show="!$first && !$last">, </span><span ng-show="$last"> and </span><a ng-href="{{url.value}}" target="_blank">{{url.label}}</a></span></p></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()" ng-disabled="$parent.exportType==$parent.defaultExportType">Export</button></div>',
	 					controller: ModalCtrl,
	 					resolve: {
	 						project: function(){ return project; }
	 					}
	 				}
	 			);
			};
	 	}
	 ]
);