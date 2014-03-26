app.service
(
	'model',
	function()
	{
		return {
			components:null,
			document: null,
			grid:
			{
				color: '#d4eaff',
				size: 40,
				subdivisions: 2,
				visible: true,
				snapTo:true
			},
			
			navigation: 
				[
				 	{title:"Designer",url:"/editor"},
				 	{title:"About",url:"/about"}
				 ],
			page:null,
			templates:
				{
					document:
					{
						name:"New Document",
						children:[]
					},
					page:
					{
						id:"ui_component",
						name:"My Section",
						children:[]
					}
				},
			title: "EHR Designer"
		};
	}
);

app.controller
(
	'AppCtrl',
	[
	 	'$scope','$location','model','DataService','DragService','FactoryService',
		function($scope,$location,model,dataService,dragService,factory)
		{
			$scope.model = model;
			$scope.dataService = dataService;
			$scope.dragService = dragService;
			$scope.factory = factory;
			
			$scope.init = function()
			{
				$scope.getComponents().then($scope.clearCanvas);
			};
			
			$scope.clearCanvas = function()
			{
				var emptyDocument = angular.copy(model.templates.document);
				emptyDocument.created = new Date();
				emptyDocument.children = [ $scope.factory.componentInstance($scope.model.components[0]) ];
				
				model.document = emptyDocument;
				model.page = model.document.children[0];
			};
			
			$scope.getComponents = function()
			{
				var inheritableProperties = ['autoLayoutChildren','container','resizable'];
				
				return $scope.dataService.getComponents().then
				(
					function(data)
					{
						function parse(c,components)
						{
							c.cid = c.id;
							delete c.id;
							
							components = components || [];
							components.push( c );
							
							if( c.children )
							{
								for(var d in c.children)
								{
									var child = c.children[d];
									
									//	copy inheritable attributes from parent
									for(var p in inheritableProperties)
										if( _.has(c,inheritableProperties[p]) && !_.has(child,inheritableProperties[p]) )
											child[inheritableProperties[p]] = c[inheritableProperties[p]];
									
									//	copy properties from parent
									for(p in c.properties)
									{
										var exists = false;
										var property = c.properties[p];
										
										for(var p2 in child.properties)
										{
											if( child.properties[p2].id == property.id )
												exists = true;
										}
										
										if( !exists )
											child.properties.push( c.properties[p] );											
									}
									
									parse(child,components);
								}
							}
							
							return components;
						}
						
						var components = parse(data.data[0]);
						var componentsIndexed = {};
						
						for(var c in components)
							componentsIndexed[ components[c].cid ] = components[c];
						
						$scope.model.components = components;
						$scope.model.componentsIndexed = componentsIndexed;
						
						console.log( "components loaded", $scope.model.components, $scope.model.componentsIndexed );
					}
				);
			};
			
			$scope.componentFilter = function(item)
			{
				return !item.abstract;
			};
			
			$scope.setLocation = function(path)
			{
				$location.path(path);
			};
		}
	 ]
);