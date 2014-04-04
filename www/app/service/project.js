app.service
(
	'ProjectService',
	function(Project,FactoryService,canvas,template)
	{
		var service = {};
		
		service.new = function()
		{
			var newDocument = angular.copy( template.document );
			
			var project = new Project();
			project.content = newDocument;
			
			service.addSection();
		};
		
		service.addSection = function()
		{
			var section = angular.copy( project.templates.section );
			section.name = "Section " + (project.document.children.length + 1);
			
			project.document.children.push( section );
			
			service.selectSection( project.document.children.length - 1 );
			
			service.addPage();
		};
		
		service.deleteSection = function(section)
		{
			project.document.children.splice( project.document.children.indexOf(section),1 );
		};
		
		service.addPage = function()
		{
			var page = FactoryService.componentInstance( canvas.componentsIndexed['ui_component'] );
			page.name = "Page " + (project.section.children.length+1);
			
			project.section.children.push( page );
			
			service.selectPage( project.section.children.length - 1 );
		};
		
		service.deletePage = function(page)
		{
			project.section.children.splice( project.section.children.indexOf(page),1 );
		};
		
		service.selectSection = function(id)
		{
			//TODO: validate id in range
			project.section = project.document.children[id];
			
			service.selectPage(0);
		};
		
		service.selectPage = function(id)
		{
			if( project.section.children[id] )
				project.page = project.section.children[id];
		};
		
		return service;
	}
);