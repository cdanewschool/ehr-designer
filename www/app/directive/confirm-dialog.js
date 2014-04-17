app.directive
(
	'confirmDialog', 
	[
	 	'$modal','$parse',
		 function($modal,$parse) 
		 {
			 return {
				 restrict: 'A',
				 scope: true,
				 link: function(scope, element, attrs) 
				 {
					 element.bind
					 (
						'click', 
						function() 
						{
							var message = attrs.confirmDialogMessage;
							
							var header = '<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true">&times;</button><h4 class="modal-title">Edit</h4></div>';
							var body = '<div class="modal-body">{{message}}</div>';
							var footer = '<div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">No</button><button type="button" class="btn btn-primary" ng-click="save()">Yes</button></div>';
							
							var ModalCtrl = function($scope,$modalInstance,message,callback)
						    {
								$scope.message = message;
								
								$scope.save = function()
								{
									$parse(callback)(scope)();
									
						       		$modalInstance.close();
						      	};
						      	
						      	$scope.cancel = function()
						      	{
									$modalInstance.dismiss('cancel');
						      	};
						    };
						    
						    $modal.open
						    (
					    		{
					    			template: header + body + footer,
					    			controller: ModalCtrl,
					    			resolve: {
					    				message: function(){ return message; },
					    				callback: function(){ return attrs.confirmDialogCallback; }
									}
					    		}
						    );
						}
					);
				 }
			 };
		 }
	]
);