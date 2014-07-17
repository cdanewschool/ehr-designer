'use strict';

/**
 * draggable
 * 
 * Directive for enabling drag
 */
app.directive
(
	'draggable',
	function(dragModel)
	{
		return {
			restrict : 'A',
			link: function (scope, element, attrs) 
			{ 
				angular.element(element).draggable
				(
					{
						start: function(e)
						{
							dragModel.dragItem = null;
						}
					}
				);
			}
		};
	}
);