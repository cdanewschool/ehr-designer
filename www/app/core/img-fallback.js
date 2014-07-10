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