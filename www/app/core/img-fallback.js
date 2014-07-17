'use strict';

/**
 * src-fallback
 * 
 * Directive for showing a fallback when an img's src is non-existent
 * 
 * @attr {String} src-fallback Image path to show if loading `src` path fails
 */
app.directive
(
	'srcFallback',
	function()
	{
		return {
			restrict: 'A',
			link:function(scope,element,attrs)
			{
				if( attrs.srcFallback )
				{
					angular.element(element).bind
					(
						'error',
						function()
						{
							angular.element(element).attr('src',attrs.srcFallback);
						}
					);
				}
			}
		};
	}
);