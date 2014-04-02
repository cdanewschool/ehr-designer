app.directive
(
	'droppable',
	function($compile)
	{
		return {
			restrict : 'A',
			priority: 10,
			terminal: true,
			compile: function compile(element,attrs)
			{
				element.removeAttr("droppable");
				
				element.attr("data-drop","true");
				element.attr("jqyoui-droppable","{multiple:'true', stack:'true', onDrop: 'dragService.onDrop(definition)', onOver:'dragService.onOver(definition)'}");
				element.attr("data-jqyoui-options","{accept:dragService.acceptDrop,greedy:'true',tolerance:'pointer'}");
				
				return {
					pre: function preLink(scope, iElement, iAttrs) {},
					post: function postLink(scope, iElement, iAttrs) 
					{
						$compile(iElement)(scope);
					} 
			    };
			}
		};
	}
);