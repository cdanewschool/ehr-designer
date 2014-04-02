app.service
(
	'ProjectService',
	function(project,FactoryService,model)
	{
		var service = {};
		
		var ordinalize = function(n)
		{
			var ns = n.toString();
			
			if( ns.charAt(ns.length-1) == "1" && n != 11 ) return n + "st";
			if( ns.charAt(ns.length-1) == "2" ) return n + "nd";
			if( ns.charAt(ns.length-1) == "3" ) return n + "rd";
			
			return n + "th";
		};
		
		service.new = function()
		{
			var document = angular.copy( project.templates.document );
			document.created = new Date();
			
			project.document = document;
			
			service.addSection();
		};
		
		service.addSection = function()
		{
			var section = angular.copy( project.templates.section );
			section.created = new Date();
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
			var page = FactoryService.componentInstance( model.componentsIndexed['ui_component'] );
			page.created = new Date();
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