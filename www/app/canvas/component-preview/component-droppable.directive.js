app.directive
(
	'componentDroppable',
	function($compile)
	{
		return {
			restrict : 'A',
			require:'^componentPreview',
			compile: function compile(element,attrs)
			{
				element.removeAttr("component-droppable");
				
				element.attr("data-drop",true);
				element.attr("jqyoui-droppable","{multiple:'true', stack:'true', onDrop: 'onDrop', onOver:'onDragOver'}");
				element.attr("data-jqyoui-options","{accept:acceptDrop,greedy:'true',tolerance:'pointer'}");
				
				return {
					pre: function preLink(scope, iElement, iAttrs) {},
					post: function postLink(scope, iElement, iAttrs, controller) 
					{
						scope.onDrop = function(event,ui)
						{
							controller.onDrop(event,ui);
						};
						
						scope.onDragOver = function(event,ui)
						{
							controller.onDragOver(event,ui);
						};
						
						scope.acceptDrop = function()
						{
							return controller.acceptDrop();
						};
						
						$compile(iElement)(scope);
					} 
			    };
			}
		};
	}
);