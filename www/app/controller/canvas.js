app.controller
(
	'CanvasCtrl',
	[
		'$scope','$rootScope','$location','$modal','$routeParams','$base64','$tutorial','canvas','library','template','history','Project','CanvasService','DataService','DragService','HistoryService','FactoryService','navigation','utilities','ENV',
		function($scope,$rootScope,$location,$modal,$routeParams,$base64,$tutorial,canvas,library,template,history,Project,canvasService,dataService,dragService,historyService,FactoryService,navigation,utilities,ENV)
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
			
			//	handle component deletion
			$rootScope.$on
			(
				'deleteComponent',
				function()
				{
					if( !canvas.selection ) return;
		 			
					//	remove it
		 			utilities.remove(canvas.selection.instance);
		 			
		 			//	append to history
		 			historyService.save( "Removed " + canvas.selection.instance.componentId );
		 			
		 			//	nullify current selection (hides property inspector)
		 			canvas.selection = null;
				}
			);
			
			$rootScope.$on
			(
				'$locationChangeStart',
				function()
				{
					canvas.previewing  =false;
				}
			);
			
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
						
						//	select a section/page when a project is selected
						if( newVal )
						{
							$scope.selectPageByIndex(0);
						}
						//	otherwise nullify page/section
						else
						{
							canvas.currentPage = null;
						}
					}
				}
			);
			
			//	refresh section/page on history load
			$scope.$watch
			(
				'canvas.currentProject.content',
				function(newVal,oldVal)
				{
					if( newVal != oldVal )
					{
						if( newVal )
							$scope.selectPageByIndex(0);
						else
						{
							canvas.currentPage = null;
						}
					}
				}
			);
			
			//	deep watch project and update hash (and `dirty` flag) whenever it changes
			$scope.$watch
			(
				'canvas.currentProject',
				function(newVal,oldVal)
				{
					if( newVal != oldVal )
						canvasService.updateHash(true,false);
				},true
			);
			
			//	shallow watch project and init factory service's unique id when a new project is set
			//	(this handles loading existing projects and preventing id collision)
			$scope.$watch
	 		(
	 			'canvas.currentPage',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					if( newVal )
	 					{
	 						var getMax = function(item,val)
		 					{
		 						val = Math.max( parseInt(item.id), val );
		 						
		 						if( item.children )
		 							for(var c in item.children)
		 								val = getMax(item.children[c],val);
		 						
		 						return val;
		 					};
		 					
		 					var val = getMax( canvas.currentPage, 1 );
		 					
		 					FactoryService._id = val;
	 					}
	 					else
	 					{
	 						canvas.selection = null;
	 					}
	 				}
	 			}
	 		);
			
			/**
			 * Initializes controller by loading sample data, components and (optionally) a project
			 */
			$scope.init = function()
			{
				var initProject = function()
				{
					if( $routeParams.projectId )
					{
						canvas.currentProject = null;
						
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
								
								canvasService.updateHash(true,true);
							},
							function(response,err)
							{
								if( response.status == 403 )
								{
									$location.path( '/browse' );
								}
								
								if( response.status == 500 )
									$location.path( '/myprojects' )
							}
						);
					}
					else if( !canvas.currentProject )
					{
						$scope.newProject(true);
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
			
			$scope.saveProject = function(callback)
			{
				canvasService.saveProject(callback);
			};
			
			$scope.deleteProject = function(project)
			{
				navigation.showConfirm("Are you sure you want to Delete this Project?").then
				(
					function()
					{  	canvas.currentProject = project;
						canvas.currentProject.$remove
						(
							{
								projectId:canvas.currentProject._id
							},
							function()
							{
								var idx = $scope.projects.indexOf(project);
								$scope.projects.splice(idx,1);
								
								canvas.currentProject = null;
								$location.path( '/myprojects' );
							}
						);
					},
					function()
					{
						canvas.currentProject = null;
						$location.path( '/myprojects' );
					}
				);
				
				return;
			};
			
			$scope.newProject = function(showEdit)
			{
				if( canvas.dirty )
				{
					navigation.showConfirm("You have unsaved changes. Do you want to Save?").then
					(
						function()
						{
							$scope.saveProject
							( 
								function()
								{
									canvas.currentProject = null;
									
									$scope.newProject(showEdit); 
								} 
							);
						},
						function()
						{
							canvas.currentProject = null;
							canvas.dirty = false;	//	shouldn't be needed
							$scope.newProject(showEdit); 
						}
					);
					
					return;
				}
				
				var project = angular.copy( template.document );
				project.name = "My Project";
				
				canvas.currentProject = new Project();
				canvas.currentProject.content = project;
				canvas.currentProject.sharing = "private";
				
				if(showEdit)
				{
					$scope.editItemProperties(canvas.currentProject.content, showEdit).then
					(
						//	user has provided a name and/or clicked "save"
						function ()
						{
							$scope.addPage(showEdit);
						},
						//	user has clicked cancel
						function()
						{
							canvas.currentProject = null;							
							$location.path('/myprojects');
						}
					);
				}
				else
				{
					$scope.addPage(showEdit);
				}
			};
			
			$scope.previewProject = function()
			{
				canvas.previewing = true;
			};
			
			$scope.addPage = function(showEdit)
			{  
				var page =  FactoryService.componentInstance( library.elementsIndexed['ui_component'] );
				page.name = "Page " + (canvas.currentProject.content.children.length+1);
				
				canvas.currentProject.content.children.push( page );
				
				$scope.selectPageByIndex( canvas.currentProject.content.children.length - 1 );
				
				if(showEdit)
					$scope.editItemProperties(canvas.currentPage, showEdit);
			};
			
			$scope.deletePage = function(page)
			{
				canvas.currentProject.content.children.splice( canvas.currentProject.content.children.indexOf(page),1 );
			};
			
			$scope.selectPage = function(page)
			{
				$scope.selectPageByIndex( canvas.currentProject.content.children.indexOf( page ) );
			};
			
			$scope.selectPageByIndex = function(id)
			{
				if( canvas.currentProject.content.children[id] )
					canvas.currentPage = canvas.currentProject.content.children[id];
			};
			
			$scope.setTemplate = function(template)
			{
				if( !canvas.currentPage ) return;
				
				if( canvas.currentPage.children.length 
					&& canvas.currentPage.children[0].id == template.id )
				{
					canvas.errors = ['Template "' + template.name + '" already set for this page'];
					
					return;
				}
				
				var template = angular.copy(template);
				template.pid = canvas.currentPage.id;
				
				if( canvas.currentPage.children.length )
				{
					navigation.showConfirm("Setting a template will overwrite the page's current contents. Proceed?").then
					(
						function()
						{
							canvas.currentPage.children = [ template ];
						},
						function()
						{
						}
					);
				}
				else
				{
					canvas.currentPage.children = [ template ];
				}
			};
			
			$scope.clearCanvas = function()
			{
				canvas.currentPage.children = [];
				
				//	append to history
	 			historyService.save( "Cleared canvas" );
			};
			
			$scope.editCurrentItem = function()
			{ 	
				var item = null;
				
				if( canvas.currentPage )
		    		item = canvas.currentPage;
		    	else if( canvas.currentProject )
		    		item = canvas.currentProject.content;
				if(item)
					$scope.editItemProperties(item);
			};
			
			$scope.editItemProperties = function(item, isNew)
			{    
				if( !item ) return;
			    
				var title = "Edit";
				var message = null;
				
				if( item === canvas.currentPage )
					title = "Page Properties";
				else if( item === canvas.currentProject.content )
					title = "Project Properties";
				
				if( isNew )
				{
					if( item === canvas.currentPage )
						message = "We've created a new <strong>page</strong> for your section. What would you like to call it?";
					else if( item === canvas.currentProject.content )
						message = "We've created a new <strong>project</strong> for you. What would you like to call it?";
				}
				
			    var ModalCtrl = function($scope,$modalInstance,item,message,title)
			    {
			    	$scope.item = angular.copy(item);
			    	$scope.message = message;
			    	$scope.title = title;
			    	
			      	$scope.save = function()
			      	{
			      		for(var p in $scope.item)
			        		item[p] = $scope.item[p];
			      		
			      		if( !isNew )	//	should really be an additional flag, like isAuto
			      		{
			      			if( item === canvas.currentPage )
				      			historyService.save( "Changed page properties" );
							else if( item === canvas.currentProject.content )
								historyService.save( "Changed project properties" );
			      		}
			      		
			       		$modalInstance.close();
			      	};
			      
			      	$scope.cancel = function()
			      	{
				       	if(item == canvas.currentPage && isNew)
				       	{
				       		canvas.currentProject.content.children.splice( canvas.currentProject.content.children.indexOf(item),1 );
				    	 	canvas.currentPage = null;			    	   
				       	}
				       				       	
						$modalInstance.dismiss('cancel');
			      	};
			    };
			     
			    var modalInstance = $modal.open
			    (
		    		 {
		    			 templateUrl: 'popups/edit-item.html',
					     controller: ModalCtrl,
					     backdrop: $tutorial.running() ? 'static' : true,
					     resolve: {
					    	 item: function(){ return item; },
					    	 message: function(){ return message; },
					    	 title: function(){ return title; }
					     }
		    		 }
			    );
			    
				return modalInstance.result;
			};
			
			$scope.componentFilter = function(item)
			{
				return !item.abstract;
			};
			
			if( ENV.DEBUG )
			{
				$scope.exportSelectionDefinition = function()
		 		{
		 			var props = {id:"mycomponent",name:"My Component"};
		 			var output = _.defaults(props,canvas.selection.instance);
		 			
		 			//TODO: strip root component's location property values (x,y)
		 			
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
		 			
		 			var modalInstance = $modal.open
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