app.directive
(
	'draggable',
	function($compile)
	{
		return {
			restrict : 'A',
			priority: 10,
			terminal: true,
			compile: function compile(element,attrs)
			{
				element.removeAttr("draggable");
				
				element.attr("data-drag","true");
				element.attr("jqyoui-draggable","{animate: false, onStart: 'dragService.onDragStart(definition)', onStop: 'dragService.onDragStop()', onDrag: 'dragService.onDrag(definition)', placeholder:'keep'}");
				element.attr("data-jqyoui-options","{cancel: '.previewing', helper: 'clone', revert: 'invalid'}");

				return {
			           pre: function preLink(scope, iElement, iAttrs, controller) {},
			           post: function postLink(scope, iElement, iAttrs, controller) { 
			        	   $compile(iElement)(scope);
			           }
			    };
			}
		};
	}
);