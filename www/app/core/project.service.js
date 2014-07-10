app.service
(
	'ProjectService',
	function($modal,$tutorial,canvas,library,navigation,FactoryService)
	{
		var service = {};
		
		service.addPage = function(project,showEdit)
		{
			var page =  FactoryService.componentInstance( library.elementsIndexed['ui_component'] );
			page.name = "Page " + (project.content.children.length+1);
			page.created = Date.now();
			page.updated = Date.now();
			
			project.content.children.push( page );
			
			if(showEdit)
				return service.editItemProperties(page, showEdit, true, project);
		};
		
		service.deletePage = function(page,project)
		{
			navigation.showConfirm("Are you sure you want to Delete Page " + page.name + "?" ).then
			(
				function()
				{
					project.content.children.splice( project.content.children.indexOf(page),1 );
				},
				function()
				{
				}
			);
		};
		
		service.editItemProperties = function(item, isNew, isPage, project)
		{
			if( !item ) return;
		    
			var title = "Edit";
			var message = null;
			
			if( isPage )
				title = "Page Properties";
			else 
				title = "Project Properties";
			
			if( isNew )
			{
				if( isPage )
					message = "What would you like to call this page?";
				else 
					message = "What would you like to call this project?";
			}
			
		    var ModalCtrl = function($scope,$modalInstance,item,message,title,isPage,project)
		    {
		    	$scope.item = angular.copy(item);
		    	$scope.message = message;
		    	$scope.title = title;
		    	$scope.isPage = isPage;
		    	$scope.project = project;
		    	
		      	$scope.save = function()
		      	{
		      		for(var p in $scope.item)
		        		item[p] = $scope.item[p];
		      		
		       		$modalInstance.close();
		      	};
		      
		      	$scope.cancel = function()
		      	{
			       	if(isPage && isNew && project)
			       	{
			       		project.content.children.splice( project.content.children.indexOf(item),1 );		    	   
			       	}
			       	
					$modalInstance.dismiss('cancel');
		      	};
		    };
		    
		    var modalInstance = $modal.open
		    (
	    		 {
	    			 templateUrl: 'partials/templates/edit-item.html',
				     controller: ModalCtrl,
				     backdrop: $tutorial.running() ? 'static' : true,
				     resolve: {
				    	 item: function(){ return item; },
				    	 isPage: function(){ return isPage; },
				    	 message: function(){ return message; },
				    	 project: function(){ return project; },
				    	 title: function(){ return title; }
				     }
	    		 }
		    );
		    
			return modalInstance.result;
		};
		
		return service;
	}
);