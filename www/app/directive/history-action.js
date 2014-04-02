app.directive
(
	"historyAction",
	function($parse,HistoryService)
	{
		return {
			restrict: "A",
			link: function(scope,element,attrs)
			{
				var model = $parse(attrs.ngModel);
				
				scope.$watch
				(
					model,
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
						{
							var text = attrs.historyAction;
							text = text.replace( /%oldValue%/, "<strong>" + oldVal + "</strong>" );
							text = text.replace( /%value%/, "<strong>" + newVal + "</strong>" );
							
							HistoryService.save( text );
						}
					}
				);
			}
		};
	}
);