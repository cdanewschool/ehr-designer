app.service
(
	'CanvasService',
	[
	 '$rootScope','$base64','$q','canvas','history','library','Element','Component','Template',
	 function($rootScope,$base64,$q,canvas,history,library,Element,Component,Template)
	 {
		 $rootScope.$on
		 (
			'saveProject',
			function(event,args)
			{
				service.saveProject( args.length ? args[0] : null );
			}
		 );
		 
		 var service = 
		 {
			saveProject: function(callback)
			{
				 callback = callback || angular.noop;
				 
				 canvas.messages = [];
				 canvas.errors = [];
				
				 /**
				  * Saving the project causes an issue where property updates don't propagate to the underlying
				  * object, so we clone it instead
				  */
				 
				 var __currentProject = angular.copy(canvas.currentProject);
				 __currentProject.history = $base64.encode( JSON.stringify(history.actions) );
				 
				 if( __currentProject._isNew === false ) 
				 {
					__currentProject.$update
					(
						{
							projectId:__currentProject._id
						},
						function(response)
						{
							canvas.dirty = false;
							
							callback();
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
					__currentProject.$save
					(
						function(response)
						{
							canvas.currentProject._isNew = false;
							
							canvas.dirty = false;
							
							callback();
						}
					);
				 }
			 },
			 
			 updateHash: function(update,updateSaved)
			 {
				 var content = canvas.currentProject ? angular.copy(canvas.currentProject) : null;
				 
				 if( update )
					 canvas.hash.current = $base64.encode( JSON.stringify(content) );
				
				 if( updateSaved )
					 canvas.hash.last = $base64.encode( JSON.stringify(content) );
				 
				 canvas.dirty = (canvas.currentProject!=null && canvas.hash.current !== canvas.hash.last) ? true : false;
			 },
			 
			 getElements: function()
			 {
				 var async = $q.defer();
				
				 Element.get
				 (
					{},
					function(elements)
					{
						var elementsByCategory = {};
						var elementsIndexed = {};
						
						for(var e in elements)
						{
							elementsIndexed[ elements[e].id ] = elements[e];
							
							if( !elements[e].abstract 
								&& elements[e].category )
							{
								if( !elementsByCategory[ elements[e].category ] )
									elementsByCategory[ elements[e].category ] = {name:elements[e].category,elements:[]};
								
								elementsByCategory[ elements[e].category ].elements.push( elements[e] );
							}
						}
							
						library.elementsByCategory = elementsByCategory;
						library.elements = elements;
						library.elementsIndexed = elementsIndexed;
						
						async.resolve();
						
						console.log( "elements loaded", library.elements, library.elementsIndexed );
					}
				);
				
				return async.promise;
			},
			
			getComponents: function()
			{
				 var async = $q.defer();
				
				 Component.get
				 (
					{},
					function(components)
					{
						var componentsByCategory = {};
						var componentsIndexed = {};
						
						for(var c in components)
						{
							var definition = library.elementsIndexed[ components[c].componentId ];
							var component = _.defaults(components[c],definition);
							
							componentsIndexed[ components[c].id ] = component;
							
							if( !components[c].abstract 
								&& components[c].category )
							{
								if( !componentsByCategory[ component.category ] )
									componentsByCategory[ component.category ] = {name:component.category,components:[]};
								
								componentsByCategory[ component.category ].components.push( component );
							}
						}
							
						library.componentsByCategory = componentsByCategory;
						library.components = components;
						library.componentsIndexed = componentsIndexed;
						
						async.resolve();
						
						console.log( "components loaded", library.components, library.componentsIndexed );
					}
				);
				
				return async.promise;
			},
			
			getTemplates: function()
			{
				 var async = $q.defer();
				
				 Template.get
				 (
					{},
					function(templates)
					{
						library.templates = templates;
						
						async.resolve();
						
						console.log( "templates loaded", library.templates );
					}
				);
				
				return async.promise;
			}
		 };
		 
		 return service;
	 }
	]
);