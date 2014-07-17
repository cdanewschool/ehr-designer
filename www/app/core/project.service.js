/**
 * Service for exposing common project-related operations
 */
app.service
(
	'ProjectService',
	function($modal,$tutorial,$q,canvas,library,navigation,FactoryService)
	{
		var service = {};
		
		/**
		 * Adds a page to the specified project
		 * 
		 * @param {Project} project The project to add a page to 
		 * @param {Boolean} showEdit Whether to show the edit properties modal
		 * 
		 * @return {$promise} Async promise resolved when the page addition is complete
		 */
		service.addPage = function(project,showEdit)
		{
			var page =  FactoryService.componentInstance( library.elementsIndexed['ui_component'] );
			page.name = "Page " + (project.content.children.length+1);
			page.created = Date.now();
			page.updated = Date.now();
			
			project.content.children.push( page );
			
			if(showEdit)
				return service.editItemProperties(page, showEdit, true);
			
			var async = $q.defer();
			async.resolve();
			
			return async.promise;
		};
		
		/**
		 * Deletes a page from the specified project
		 * 
		 * @param {Object} page The page to remove
		 * @param {Project} project The project to remove the specified page from 
		 * @param {Boolean} showConfirm Whether to show the confirm modal before deleting (exposed for testing)
		 * 
		 * @return {$promise} Async promise resolved when the page deletion is complete
		 */
		service.deletePage = function(page,project,showConfirm)
		{
			showConfirm = (typeof showConfirm != 'undefined') ? showConfirm : true;
			
			if( showConfirm )
			{
				return navigation.showConfirm("Are you sure you want to delete page \"" + page.name + "\"?" ).then
				(
					function()
					{
						project.content.children.splice( project.content.children.indexOf(page),1 );
					},
					function()
					{
					}
				);
			}
			else
			{
				project.content.children.splice( project.content.children.indexOf(page),1 );
				
				var async = $q.defer();
				async.resolve();
				
				return async.promise;
			}
		};
		
		/**
		 * Shows an Edit Properties modal for the specified page or project
		 * 
		 * @param {Mixed} item The project or page to remove
		 * @param {Project} isNew Whether the item to edit was newly-added or not 
		 * @param {Boolean} isPage Whether the item is a page or not
		 * @param {Project} project The project item belongs to, if it is a page
		 * 
		 * @return A promise resolved when modal is closed, rejected when cancelled
		 */
		service.editItemProperties = function(item, isNew, isPage)
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
			
		    var ModalCtrl = function($scope,$modalInstance,item,message,title,isPage)
		    {
		    	$scope.item = angular.copy(item);
		    	$scope.message = message;
		    	$scope.title = title;
		    	$scope.isPage = isPage;
		    	
		      	$scope.save = function()
		      	{
		      		for(var p in $scope.item)
		        		item[p] = $scope.item[p];
		      		
		       		$modalInstance.close();
		      	};
		      
		      	$scope.cancel = function()
		      	{
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
				    	 title: function(){ return title; }
				     }
	    		 }
		    );
		    
			return modalInstance.result;
		};
		
		return service;
	}
);