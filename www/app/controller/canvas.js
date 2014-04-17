app.controller
(
	'CanvasCtrl',
	[
		'$scope','$rootScope','$location','$modal','$routeParams','$q','canvas','library','template','history','Component','Project','ProjectService','DataService','DragService','HistoryService','FactoryService','utilities','ENV',
		function($scope,$rootScope,$location,$modal,$routeParams,$q,canvas,library,template,history,Component,Project,ProjectService,dataService,dragService,historyService,FactoryService,utilities,ENV)
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
					
			$rootScope.$on
			(
				'deleteComponent',
				function()
				{
					if( !canvas.selection ) return;
		 			
		 			utilities.remove(canvas.selection.instance);
		 			
		 			historyService.save( "Removed " + canvas.selection.instance.componentId );
		 			
		 			canvas.selection = null;
				}
			);
			
			$scope.$watch
			(
				'canvas.currentProject',
				function(newVal,oldVal)
				{
					if( newVal != oldVal && newVal )
					{
						$scope.selectSectionByIndex(0);
					}
				}
			);
			
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
	 						dragService.dragModel.selection = null;
	 					}
	 				}
	 			}
	 		);
			
			$scope.init = function()
			{
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
								canvas.currentProject = response;
							}
						);
					}
					else if( !canvas.currentProject )
					{
						$scope.newProject();
					}
				};
				
				if( !library.sampleData )
					getSampleData();
				
				if( !library.components )
					getComponents().then( initProject );
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
			
			var getComponents = function()
			{
				var async = $q.defer();
				
				Component.get
				(
					{},
					function(components)
					{
						var componentsIndexed = {};
						
						for(var c in components)
							componentsIndexed[ components[c].id ] = components[c];
						
						library.components = components;
						library.componentsIndexed = componentsIndexed;
						
						async.resolve();
						
						console.log( "components loaded", library.components, library.componentsIndexed );
					}
				);
				
				return async.promise;
			};
			
			$scope.saveProject = function()
			{
				canvas.messages = [];
				canvas.errors = [];
				
				if( canvas.currentProject._isNew === false ) 
				{
					canvas.currentProject.$update
					(
						{
							projectId:canvas.currentProject._id
						},
						function(response)
						{
							canvas.currentProject = response;
							
							canvas.messages.push( "Saved" );
						},
						function(response)
						{
							if( response.data.errors )
								for(var f in response.data.errors )
									canvas.errors.push( response.data.errors[f].message );
						}
					);
				}
				else
				{
					canvas.currentProject.$save
					(
						function(response)
						{
							canvas.currentProject = response;
							
							console.log('saved',response);
						}
					);
				}
			};
			
			$scope.deleteProject = function()
			{
				if( canvas.currentProject._isNew === false ) 
				{
					canvas.currentProject.$remove
					(
						{
							projectId:canvas.currentProject._id
						},
						function(response)
						{
							canvas.currentProject = null;
							canvas.currentSection = null;
							canvas.currentPage = null;
							
							$location.path( '/myprojects' );
						}
					);
				}
				else
				{
					canvas.currentProject = null;
					canvas.currentSection = null;
					canvas.currentPage = null;
					
					$location.path( '/myprojects' );
				}
			};
			
			$scope.newProject = function()
			{
				canvas.currentProject = new Project();
				canvas.currentProject.name = "My Project";
				canvas.currentProject.content = angular.copy( template.document );
				
				$scope.addSection();
			};
			
			$scope.addSection = function(manual)
			{
				var section = angular.copy( template.section );
				section.name = "Section " + (canvas.currentProject.content.children.length + 1);
				
				canvas.currentProject.content.children.push( section );
				
				$scope.selectSectionByIndex( canvas.currentProject.content.children.length - 1 );
				
				if(manual)
					$scope.editItemProperties(canvas.currentSection, manual).then(function (){$scope.addPage(manual);});
				else			
					$scope.addPage(manual);
			};
			
			$scope.deleteSection = function(section)
			{
				canvas.currentProject.content.children.splice( canvas.currentProject.content.children.indexOf(section),1 );
			};
			
			$scope.addPage = function(manual)
			{
				var page = FactoryService.componentInstance( library.componentsIndexed['ui_component'] );
				page.name = "Page " + (canvas.currentSection.children.length+1);
				
				canvas.currentSection.children.push( page );
				
				$scope.selectPageByIndex( canvas.currentSection.children.length - 1 );
				
				if(manual)
					$scope.editItemProperties(canvas.currentPage, manual);
				
			};
			
			$scope.deletePage = function(page)
			{
				canvas.currentSection.children.splice( canvas.currentSection.children.indexOf(page),1 );
			};
			
			$scope.selectSection = function(section)
			{
				$scope.selectSectionByIndex( canvas.currentProject.content.children.indexOf( section ) );
			};
			
			$scope.selectSectionByIndex = function(id)
			{
				//TODO: validate id in range
				canvas.currentSection = canvas.currentProject.content.children[id];
				
				$scope.selectPageByIndex(0);
			};
			
			$scope.selectPage = function(page)
			{
				$scope.selectPageByIndex( canvas.currentSection.children.indexOf( page ) );
			};
			
			$scope.selectPageByIndex = function(id)
			{
				if( canvas.currentSection.children[id] )
					canvas.currentPage = canvas.currentSection.children[id];
			};
			
			$scope.clearCanvas = function()
			{
				canvas.currentPage.children = [];	
			};
			
			$scope.editCurrentItem = function()
			{ 	
				var item = null;
				if( canvas.currentPage )
		    		item = canvas.currentPage;
		    	else if( canvas.currentSection )
		    		item = canvas.currentSection;
		    	else if( canvas.currentProject )
		    		item = canvas.currentProject;
				if(item)
					$scope.editItemProperties(item);
			};
			
			$scope.editItemProperties = function(item, isNew)
			{    
				if( !item ) return;
			    
			    var ModalCtrl = function($scope,$modalInstance,item)
			    {
			    	$scope.item = angular.copy(item);
			      
			      	$scope.save = function()
			      	{
			      		for(var p in $scope.item)
			        		item[p] = $scope.item[p];
			       
			       		$modalInstance.close();
			      	};
			      
			      	$scope.cancel = function()
			      	{
				       	if(item == canvas.currentPage && isNew)
				       	{
				       		canvas.currentSection.children.splice( canvas.currentSection.children.indexOf(item),1 );
				    	 	canvas.currentPage = null;			    	   
				       	}
				       	else if(item == canvas.currentSection && isNew)
				       	{
				    		canvas.currentProject.content.children.splice( canvas.currentProject.content.children.indexOf(item),1 );
							canvas.currentSection = null;
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
					     resolve: {
					    	 item: function(){ return item; }
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
		 			var props = {id:"test",name:"test"};
		 			var output = _.defaults(props,$scope.component);
		 			
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
