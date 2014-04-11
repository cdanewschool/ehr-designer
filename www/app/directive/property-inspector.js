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
			}
		};
	}
);