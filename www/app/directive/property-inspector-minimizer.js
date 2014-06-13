app.directive
(
	'propertyInspectorMinimizer',
	function(canvas)
	{
		return {
			restrict:'A',
			link:function(scope,element,attrs)
			{
				angular.element(element).on
				(
					'click',
					function(event)
					{
						if( event.eventPhase > 1 ) return;
						
						//	if click was outside of property inspector, nullify current selection
						if( !angular.element(event.target).closest('#properties').length )
						{
							scope.$apply
							(
								function()
								{
									canvas.selection = null;
								}
							);
						}
					}
				);
			}
		};
	}
);