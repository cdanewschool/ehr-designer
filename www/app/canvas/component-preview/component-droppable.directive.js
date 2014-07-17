/**
 * component-droppable
 * 
 * Convenience directive for instantiating a canvas item onto which a component-droppable can be dropped
 */
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
				//	remove the attribute mapped to this directive to avoid infinite digest
				element.removeAttr("component-droppable");
				
				//	add configuration attributes
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