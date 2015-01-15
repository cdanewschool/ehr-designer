/**
 * Canvas Controller
 * 
 */
app.controller
(
	'CanvasCtrl',
	[
		'$scope','$rootScope','$location','$modal','$routeParams','$base64','canvas','library','template','history','Project','ProjectService','CanvasService','DataService','DragService','HistoryService','FactoryService','navigation','utilities','ENV',
		function($scope,$rootScope,$location,$modal,$routeParams,$base64,canvas,library,template,history,Project,projectService,canvasService,dataService,dragService,historyService,FactoryService,navigation,utilities,ENV)
		{
			$scope.canvas = canvas;
			$scope.history = history;
			$scope.library = library;
			$scope.location = $location;
			$scope.DEBUG = ENV.DEBUG;
			
			$scope.dragService = dragService;
			$scope.historyService = historyService;
			
			$scope.messages = [];
			$scope.errors = [];
			
			/**
			 * Listen for component deletion
			 */
			$rootScope.$on
			(
				'deleteComponent',
				function()
				{
					if( !canvas.selection ) return;
		 			
					//	remove the component
		 			utilities.remove(canvas.selection.instance);
		 			
		 			//	append the deletion event to action history
		 			historyService.save( "Removed " + canvas.selection.instance.componentId );
		 			
		 			//	nullify current selection (hides property inspector)
		 			canvas.selection = null;
				}
			);
			
			/**
			 * Clear the 'previewing' flag whenever location changes
			 * 
			 * @todo Check for redundancy with watcher below
			 */
			$rootScope.$on
			(
				'$locationChangeStart',
				function()
				{
					canvas.previewing = false;
				}
			);
			
			/**
			 * Init project-specific state when project changes
			 */
			$scope.$watch
			(
				'canvas.currentProject',
				function(newVal,oldVal)
				{
					if( newVal != oldVal )
					{
						canvas.messages = [];
						canvas.errors = [];
						
						canvas.currentPage = null;
						canvas.previewing = false;
						
						//	init page specified in url (if set) when a project is selected
						if( newVal 
							&& $routeParams.pageId )
						{
							$scope.selectPageByIndex( $routeParams.pageId - 1 );
						}
						//	otherwise nullify the page
						else
						{
							canvas.currentPage = null;
						}
					}
				}
			);
			
			/**
			 * Refresh page on history load
			 * 
			 * @todo Check for redundancy with watcher above
			 */
			$scope.$watch
			(
				'canvas.currentProject.content',
				function(newVal,oldVal)
				{
					if( newVal != oldVal )
					{
						if( newVal 
							&& $routeParams.pageId )
							$scope.selectPageByIndex( $routeParams.pageId - 1 );
						else
						{
							canvas.currentPage = null;
						}
					}
				}
			);
			
			/**
			 * Reset uniuqe id counter and assign all elements of a document tree a unique id 
			 * when a new page is set, to prevent potential id collision when switching between projects
			 */
			$scope.$watch
	 		(
	 			'canvas.currentPage',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					if( newVal && (!oldVal || newVal._id != oldVal._id) )
	 					{
	 						FactoryService.clear();
	 						FactoryService.id(canvas.currentPage);
	 					}
	 				}
	 			}
	 		);
			
			/**
			 * Set dirty flag when current page's contents change, clear it
			 * when current page changes altogether
			 */
			$scope.$watch
	 		(
	 			'canvas.currentPage',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					if( newVal )
	 					{
	 						if( oldVal && oldVal._id == newVal._id )
	 							canvas.dirty = true;
	 						else 
	 						{
	 							canvas.dirty = false;
	 						}
	 					}
	 					else
	 					{
	 						canvas.dirty = false;
	 						canvas.selection = null;
	 					}
	 				}
	 			},true
	 		);
			
			/**
			 * Initialize controller by loading sample data, components and (optionally) a project
			 * 
			 * @param {boolean} showEdit Whether to show the edit project properties dialog if a new project is created
			 */
			$scope.init = function(showEdit)
			{
				showEdit = showEdit || true;
				
				var initProject = function()
				{
					if( $routeParams.projectId )
					{
						Project.get
						(
							{
								projectId:$routeParams.projectId
							},
							function(response)
							{
								//	disallow editing projects logged-in user does not own
								if( response.creator._id != $rootScope.currentUser._id )
								{
									$location.path('/myprojects');
									
									return;
								}
								
								canvas.currentProject = response;
								
								//	init local history with saved actions
								if( canvas.currentProject.history )
								{
									var id = 0;
									var actions = JSON.parse( $base64.decode( canvas.currentProject.history ) );
									
									angular.forEach
									(
										actions,
										function(action)
										{
											action.id = id++;
										}
									);
									
									history.id = id + 1;
									history.actions = actions;
									history.currentAction = history.actions[ history.actions.length-1 ];
								}
							},
							function(response,err)
							{
								if( response.status == 403 )
								{
									$location.path( '/browse' );
								}
								
								if( response.status == 500 )
									$location.path( '/myprojects' );
							}
						);
					}
					else if( !canvas.currentProject )
					{
						$scope.newProject(showEdit);
					}
				};
				
				if( !library.sampleData )
					getSampleData();
				
				if( !library.components )
					canvasService.getElements().then( canvasService.getComponents ).then( canvasService.getTemplates ).then( initProject );
				else 
					initProject();
			};
			
			var getSampleData = function()
			{
				return dataService.getSampleData().then
				(
					function(data)
					{
						var sampleData = {};
						
						angular.forEach
						(
							data.data,
							function(item)
							{
								var resourceTypeId = item.content.resourceType.toLowerCase();
								
								if( resourceTypeId == "patient" )
								{
									if( !sampleData[resourceTypeId] )
										sampleData[resourceTypeId] = [];
									
									sampleData[resourceTypeId].push( item );
								}
								else if( resourceTypeId == "bundle" )
								{
									if( !sampleData[resourceTypeId] )
										sampleData[resourceTypeId] = [];
									
									sampleData[resourceTypeId].push( item );
								}
							}
						);
						
						library.sampleData = sampleData;
					}
				);
			};
			
			/**
			 * Saves a project
			 * 
			 * @param {function} callback Function to call on success
			 * 
			 * @todo Refactor to use promises vs. passing callback to service
			 */
			$scope.saveProject = function(callback)
			{
				canvasService.saveProject(callback);
			};
			
			/**
			 * Deletes a project
			 * 
			 * @param {Project} project Project to delete
			 */
			$scope.deleteProject = function(project)
			{
				navigation.showConfirm("Are you sure you want to Delete this Project?").then
				(
					function()
					{ 
						project.$remove
						(
							{
								projectId:project._id
							},
							function()
							{
								var index = $scope.projects.indexOf(project);
								$scope.projects.splice(index,1);
							}
						);
					},
					//	user cancelled out of delete
					function()
					{
					}
				);
				
				return;
			};
			
			/**
			 * Creates a new project
			 * 
			 * @param {Boolean} showEdit Whether to show edit properties dialog for newly-created project
			 */
			$scope.newProject = function(showEdit)
			{
				//	init the project body from document template
				var project = angular.copy( template.document );
				project.name = "My Project";
				
				//	set initial metadata
				canvas.currentProject = new Project();
				canvas.currentProject.content = project;
				canvas.currentProject.sharing = "private";
				canvas.currentProject.content.style = "none1";
				
				//	show edit properties dialog
				if(showEdit)
				{
					return projectService.editItemProperties(canvas.currentProject.content, showEdit).then
					(
						//	user has provided a name and/or clicked "save"
						function ()
						{
							projectService.addPage(canvas.currentProject,true).then
							(
								function()
								{
									$scope.saveProject();
								},
								//	user cancelled out of add page
								function()
								{
									canvas.currentProject = null;
									
									$location.path('/myprojects');
								}
							);
						},
						//	user cancelled out of rename
						function()
						{
							canvas.currentProject = null;
							
							//	redirect to /myprojects
							$location.path('/myprojects');
						}
					);
				}
				else
				{
					return projectService.addPage(canvas.currentProject,showEdit);
				}
			};
			
			/**
			 * Preview a project
			 */
			$scope.previewProject = function()
			{
				canvas.previewing = true;
				
				canvas.selection = null;
			};
			
			/**
			 * Adds a page to a project
			 * 
			 * @param {Boolean} showEdit Whether to show edit properties dialog for newly-created project
			 * @param {Boolean} showOnCreate Whether to select the newly added page after creation
			 */
			$scope.addPage = function(showEdit,showOnCreate)
			{
				if( canvas.dirty )
				{
					navigation.showConfirm("You have unsaved changes. Do you want to Save?").then
					(
						function()
						{
							$scope.saveProject();
							
							projectService.addPage(canvas.currentProject,showEdit).then
							(
								function()
								{
									$scope.saveProject();
									
									if( showOnCreate )
										$scope.selectPageByIndex( canvas.currentProject.content.children.length - 1 );
								}
							);
						},
						function()
						{
							projectService.addPage(canvas.currentProject,showEdit).then
							(
								function()
								{
									$scope.saveProject();
									
									if( showOnCreate )
										$scope.selectPageByIndex( canvas.currentProject.content.children.length - 1 );
								}
							);
						}
					);
					
					return;
				}
				
				projectService.addPage(canvas.currentProject,showEdit).then
				(
					function()
					{
						$scope.saveProject();
						
						if( showOnCreate )
							$scope.selectPageByIndex( canvas.currentProject.content.children.length - 1 );
					}
				);
			};
			
			/**
			 * Delete a page from the currently-selected project
			 * 
			 * @param {Object} page Page to delete
			 * @param {Boolean} showConfirm Whether to show a confirmation before deleting (exposed for testing)
			 */
			$scope.deletePage = function(page,showConfirm)
			{
				projectService.deletePage(page,canvas.currentProject,showConfirm);
			};
			
			/**
			 * Shows edit properties dialog for a page, updating page's last updated timestamp and saving 
			 * current project on success
			 * 
			 * @param {Object} page Page to edit
			 */
			$scope.editPage = function(page)
			{
				projectService.editItemProperties(page,false,true,canvas.currentProject).then
				(
					function()
					{
						page.updated = Date.now();
						
						$scope.saveProject();
					}
				);
			};
			
			/**
			 * Shows the pages for a project
			 * current project on success
			 * 
			 * @param {Object} page Page to edit
			 */
			$scope.showPages = function()
			{
				if( canvas.dirty )
				{
					navigation.showConfirm("You have unsaved changes. Do you want to Save?").then
					(
						function()
						{
							$scope.saveProject();
							$scope.setLocation('/editor/'+canvas.currentProject._id);
						},
						function()
						{
							$scope.setLocation('/editor/'+canvas.currentProject._id);
						}
					);
				}
				else
				{
					$scope.setLocation('/editor/'+canvas.currentProject._id);
				}
			};
			
			/**
			 * Selects the currently-selected project's page by index (0-based)
			 * 
			 * @param {int} index Index of the page to be selected
			 */
			$scope.selectPageByIndex = function(index)
			{
				//	clamp the index to valid page range
				index = Math.max( 0, Math.min(index, canvas.currentProject.content.children.length-1) );
				
				canvas.currentPage = canvas.currentProject.content.children[index];
			};
			
			/**
			 * Applies a template to the currently-selected page
			 * 
			 * @param {object} template The template definition to set as the page's root element
			 */
			$scope.setTemplate = function(template)
			{
				if( !canvas.currentPage ) return;
				
				if( canvas.currentPage.children.length 
					&& canvas.currentPage.children[0].id == template.id )
				{
					canvas.errors = ['Template "' + template.name + '" already set for this page'];
					
					return;
				}
				
				var templateInstance = FactoryService.componentInstance(template,{},canvas.currentPage);
				templateInstance.values.isNew = true;
				templateInstance.properties = angular.copy( library.elementsIndexed[template.componentId].properties );
				
				if( canvas.currentPage.children.length )
				{
					navigation.showConfirm("Setting a template will overwrite the page's current contents. Proceed?").then
					(
						function()
						{
							canvas.currentPage.children = [ templateInstance ];
						},
						function()
						{
						}
					);
				}
				else
				{
					canvas.currentPage.children = [ templateInstance ];
				}
			};
			
			/**
			 * Clears the canvas and appends the action to the history
			 */
			$scope.clearCanvas = function()
			{
				canvas.currentPage.children = [];
				
				//	append to history
	 			historyService.save( "Cleared canvas" );
			};
			
			/**
			 * Filter function to filter out elements that are abstract and not meant to show up in library
			 * 
			 * @param {Object} item The element item to be filtered
			 */
			$scope.componentFilter = function(item)
			{
				return !item.abstract;
			};
			
			if( ENV.DEBUG )
			{
				/**
				 * In debug mode, exposes a function that shows a json representation of selection for transfer to definition file
				 * 
				 * @todo Strip root component's location property values (x,y)
				 */
				$scope.exportSelectionDefinition = function()
		 		{
		 			var props = {id:"mycomponent",name:"My Component"};
		 			var output = _.defaults(props,canvas.selection.instance);
		 			
		 			delete output['category'];
		 			delete output['pid'];
		 			
		 			var ModalCtrl = function($scope,$modalInstance,content)
		 			{
		 				$scope.content = content;
		 				
		 				$scope.close = function()
		 				{
		 					$modalInstance.dismiss('cancel');
		 				};
		 			};
		 			
		 			$modal.open
		 			(
		 				{
		 					template: '<div class="modal-body"><p>The following JSON represents your selection:</p><pre class="pre-scrollable">{{content | json}}</pre></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">OK</button></div>',
		 					controller: ModalCtrl,
		 					resolve: {
		 						content: function(){ return output; }
		 					}
		 				}
		 			);
		 		};
			}
		}
	 ]
);
