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
				 
				 if( canvas.currentPage )
					 canvas.currentPage.updated = Date.now();
				 
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
							canvas.currentProject._id = response._id;
							canvas.currentProject._isNew = false;
							
							canvas.dirty = false;
							
							callback();
						}
					);
				 }
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
							var element = elements[e];
							element.type = "element";
							
							elementsIndexed[ element.id ] = element;
							
							if( !element.abstract 
								&& element.category )
							{
								if( !elementsByCategory[ element.category ] )
									elementsByCategory[ element.category ] = {name:element.category,elements:[]};
								
								elementsByCategory[ element.category ].elements.push( element );
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
							component.type = "component";
							
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
						var templatesIndexed = {};
						
						for(var t in templates)
						{
							var definition = library.elementsIndexed[ templates[t].componentId ];
							var template = _.defaults(templates[t],definition);
							template.type = "template";
							
							templatesIndexed[ templates[t].id ] = template;
						}
						
						library.templates = templates;
						library.templatesIndexed = templatesIndexed;
						
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