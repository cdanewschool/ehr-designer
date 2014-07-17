'use strict';

/**
 * mongoose-error
 * 
 * Directive for clearing mongoose-related errors when a field receives focus
 * Adapted from https://github.com/DaftMonk/angular-passport/blob/master/app/scripts/directives/mongooseError.js
 */

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