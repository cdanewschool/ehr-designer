'use strict';

app.directive
(
	'mongooseError', 
	function () 
	{
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) 
			{
				element.on
				(
					'focusin',
					function() 
					{
						return ngModel.$setValidity('mongoose', true);
					}
				);
			}
		};
	}
);