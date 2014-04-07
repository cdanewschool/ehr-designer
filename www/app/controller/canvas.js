app.controller
(
	'CanvasCtrl',
	[
		'$scope','$rootScope','$location','$modal','$routeParams','canvas','library','template','history','Project','ProjectService','DataService','DragService','HistoryService','FactoryService','ENV',
		function($scope,$rootScope,$location,$modal,$routeParams,canvas,library,template,history,Project,ProjectService,dataService,dragService,historyService,FactoryService,ENV)
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
			
			$scope.$watch
	 		(
	 			'canvas.currentPage',
	 			function(newVal,oldVal)
	 			{
	 				if( newVal != oldVal )
	 				{
	 					var getMax = function(item,val)
	 					{
	 						val = Math.max( item.id, val );
	 						
	 						if( item.children )
	 							for(var c in item.children)
	 								val = getMax(item.children[c],val);
	 						
	 						return val;
	 					};
	 					
	 					var val = getMax( canvas.currentPage, 0 );
	 					
	 					FactoryService._id = val;
	 				}
	 			},true
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
								
								$scope.selectSectionByIndex(0);
							}
						);
					}
					else if( !canvas.currentProject )
					{
						$scope.newProject();
					}
				};
				
				if( !library.components )
					$scope.getComponents().then( initProject );
				else
					initProject();
			};
			
			$scope.getComponents = function()
			{
				var sync = function(target,source)
				{
					var inheritableProperties = ['autoLayoutChildren','container','resizable'];
					
					//	copy inheritable attributes from parent
					for(var p in inheritableProperties)
						if( _.has(source,inheritableProperties[p]) && !_.has(target,inheritableProperties[p]) )
							target[inheritableProperties[p]] = source[inheritableProperties[p]];
					
					//	copy properties from parent
					for(p in source.properties)
					{
						var exists = false;
						var property = source.properties[p];
						
						for(var p2 in target.properties)
						{
							if( target.properties[p2].id == property.id )
								exists = true;
						}
						
						if( !exists )
							target.properties.push( source.properties[p] );											
					};
				};
				
				return dataService.getComponents().then
				(
					function(data)
					{
						function parse(c,components)
						{
							if( c.cid )
							{
								angular.forEach
								(
									components,
									function(component)
									{
										if( component.cid == c.cid )
										{
											sync(c,component);
										}
									}
								);
							}
							else
							{
								c.cid = c.id;
								delete c.id;
							}
							
							components = components || [];
							components.push( c );
							
							if( !c.properties ) c.properties = [];
							
							if( c.subcomponents )
							{
								for(var d in c.subcomponents)
								{
									var child = c.subcomponents[d];
									
									if( !child.properties ) child.properties = [];
									
									sync(child,c);
									
									parse(child,components);
								};
							}
							
							return components;
						}
						
						var components = parse(data.data[0]);
						var componentsIndexed = {};
						
						for(var c in components)
							componentsIndexed[ components[c].cid ] = components[c];
						
						library.components = components;
						library.componentsIndexed = componentsIndexed;
						
						console.log( "components loaded", library.components, library.componentsIndexed );
					}
				);
			};
			
			$scope.save = function()
			{
				canvas.messages = [];
				canvas.errors = [];
				
				if( canvas.currentProject._id) 
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
							
							console.log('updated',response);
						},
						function(response)
						{
							if( response.data.errors )
								for(var f in response.data.errors )
									canvas.errors.push( response.data.errors[f].message );
							
							console.log(response,canvas.errors);
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
			
			$scope.newProject = function()
			{
				canvas.currentProject = new Project();
				canvas.currentProject.name = "My Project";
				canvas.currentProject.content = angular.copy( template.document );
				
				$scope.addSection();
			};
			
			$scope.addSection = function()
			{
				var section = angular.copy( template.section );
				section.name = "Section " + (canvas.currentProject.content.children.length + 1);
				
				canvas.currentProject.content.children.push( section );
				
				$scope.selectSectionByIndex( canvas.currentProject.content.children.length - 1 );
				
				$scope.addPage();
			};
			
			$scope.deleteSection = function(section)
			{
				canvas.currentProject.children.splice( canvas.currentProject.children.indexOf(section),1 );
			};
			
			$scope.addPage = function()
			{
				var page = FactoryService.componentInstance( library.componentsIndexed['ui_component'] );
				page.name = "Page " + (canvas.currentSection.children.length+1);
				
				canvas.currentSection.children.push( page );
				
				$scope.selectPageByIndex( canvas.currentSection.children.length - 1 );
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
