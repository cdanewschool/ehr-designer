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
				element.attr("jqyoui-draggable","{animate: false, onStart: 'dragService.onDragStart(definition)', onDrag: 'dragService.onDrag(definition)', placeholder:'keep'}");
				element.attr("data-jqyoui-options","{cancel: false, helper: 'clone', revert: 'invalid', stack: '.component-preview'}");

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