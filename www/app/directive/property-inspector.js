app.directive
(
	'propertyInspector',
	function()
	{
		return {
			replace: true,
			restrict: "E",
			templateUrl: "partials/templates/property-inspector.html",
			link: function(scope, element, attrs)
			{
				scope.$watch
				(
					'dragService.dragModel.selection',
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
						{
							console.log( newVal );
						}
					}
				);
			}
		};
	}
);