app.directive
(
	"historyAction",
	function($parse,HistoryService,canvas)
	{
		return {
			restrict: "A",
			scope: {
				historyActionProperty: "=historyActionProperty",
				historyActionComponent: "=historyActionComponent"
			},
			link: function(scope,element,attrs)
			{
				var oldVal,newVal;
				
				var tag = angular.element(element).prop("tagName").toLowerCase();
				
				var getValue = function()
				{
					if( scope.historyActionProperty
						&& canvas.selection )
					{
						var property = scope.historyActionProperty;
						
						var computedValue = angular.element(canvas.selection.target).css(property.id);
						
							//	if color and in rgb, convert to hex
 						if( property.type=='color' 
 							&& computedValue.match(/rgba*\((\d*),\s*(\d*),\s*(\d*),*\s*(\d*)\)/) )
 						{
 							if( computedValue == "rgba(0, 0, 0, 0)" )
 								computedValue = "transparent";
 							else
 							{
 								var rgb = computedValue.match(/rgba*\((\d*),\s*(\d*),\s*(\d*),*\s*(\d*)\)/);
 								computedValue = '#' + ((1 << 24) + (parseInt(rgb[1]) << 16) + (parseInt(rgb[2]) << 8) + parseInt(rgb[3])).toString(16).substr(1);
 							}
 						}
 						
 						if( computedValue )
 							return computedValue;
					}
						
					return angular.element(element).val();
				};
				
				var appendToHistory = function()
				{
					var text = attrs.historyAction || "Changed %componentName%%propertyName% from %oldValue% to %value%";
					
					text = text.replace( /%componentName%/, scope.historyActionComponent ? scope.historyActionComponent.componentId +'\'s ' : " " );
					text = text.replace( /%propertyName%/, scope.historyActionProperty ? scope.historyActionProperty.name.toLowerCase() : "property" );
					text = text.replace( /%oldValue%/, "<strong>" + oldVal + "</strong>" );
					text = text.replace( /%value%/, "<strong>" + newVal + "</strong>" );
					
					HistoryService.save( text );
				};
				
				if( tag == "select" )
				{
					oldVal = getValue(element);
					
					angular.element(element).on
					(
						'change',
						function()
						{
							newVal = getValue();
							
							appendToHistory();
							
							oldVal = newVal;
						}
					);
				}
				else
				{
					angular.element(element).on
					(
						'focusin',
						function()
						{
							oldVal = getValue();
							
							canvas.fieldWithFocus = element;
						}
					);
					
					angular.element(element).on
					(
						'focusout',
						function()
						{
							newVal = getValue();
							
							if( newVal !== oldVal )
							{
								appendToHistory();
							}
							
							canvas.fieldWithFocus = null;
						}
					);
				}
			}
		};
	}
);