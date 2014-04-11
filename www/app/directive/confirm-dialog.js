//	https://gist.github.com/asafge/7430497
app.directive
(
	'confirmDialog', 
	[
		 function() 
		 {
			 return {
				 restrict: 'A',
				 link: function(scope, element, attrs) 
				 {
					 element.bind
					 (
						'click', 
						function() 
						{
							var message = attrs.confirmDialogMessage;
							
							if (message && confirm(message)) 
							{
								scope.$apply(attrs.confirmDialogCallback);
							}
						}
					);
				 }
			 };
		 }
	]
);