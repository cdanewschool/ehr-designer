'use strict';

/**
 * confirm-dialog
 * 
 * Directive for showing a confirmation dialog
 * 
 * @attr {String} confirm-dialog-message Message to show in the confirmation window
 * @attr {String} confirm-dialog-title Title to show in the confirmation window; defaults to "Edit"
 * @attr {String} confirm-dialog-no-button Text to show in the confirmation button; defaults to "Yes"
 * @attr {String} confirm-dialog-yes-button Text to show in the cancel button; defaults to "No"
 * @attr {Function} confirm-dialog-callback Function to call on confirm
 */
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
							var title = attrs.confirmDialogTitle || "Edit";
							var noButtonText = attrs.confirmDialogNoButton || "No";
							var yesButtonText = attrs.confirmDialogYesButton || "Yes";
							var callback = attrs.confirmDialogCallback;
							
							var header = '<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true">&times;</button><h4 class="modal-title">{{title}}</h4></div>';
							var body = '<div class="modal-body" style="text-align:center">{{message}}</div>';
							var footer = '<div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">{{noButtonText}}</button><button type="button" class="btn btn-primary" ng-click="confirm()">{{yesButtonText}}</button></div>';
							
							var ModalCtrl = function($scope,$modalInstance,callback,args)
						    {
								$scope.message = message;
								$scope.title = title;
								$scope.noButtonText = noButtonText;
								$scope.yesButtonText = yesButtonText;
								
								$scope.confirm = function()
								{
									if( callback ) $parse(callback)(scope).apply(args);
									
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
					    				callback: function(){ return callback; },
					    				args: function(){ return attrs.confirmDialogCallbackArgs; },
					    				message: function(){ return message; },
					    				noButtonText: function(){ return noButtonText; },
					    				title: function(){ return title; },
					    				yesButtonText: function(){ return yesButtonText; }
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