app.directive
(
	'propertyInspector',
	function()
	{
		return {
			replace: true,
			restrict: "E",
			controller: 'PropertyInspectorCtrl',
			templateUrl: "partials/templates/property-inspector.html",
			link: function(scope, element, attrs)
			{
			}
		};
	}
);