app.service
(
	'model',
	function()
	{
		return {
			components:null,
			componentsIndexed:null,
			
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
			
			title: "EHR Designer"
		};
	}
);

app.controller
(
	'AppCtrl',
	[
	 	'$scope','$rootScope','$location','model','project','ProjectService','DataService','DragService',
		function($scope,$rootScope,$location,model,project,ProjectService,dataService,dragService)
		{
			$scope.model = model;
			$scope.project = project;
			$scope.dragService = dragService;
			
			$scope.init = function()
			{
				$scope.getComponents().then( function(){ ProjectService.new() } );
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
						
						model.components = components;
						model.componentsIndexed = componentsIndexed;
						
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