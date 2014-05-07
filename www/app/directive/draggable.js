app.directive
(
	'draggable',
	function($compile,$timeout)
	{
		return {
			restrict : 'A',
			priority: 10,
			terminal: true,
			compile: function compile(element,attrs)
			{
				element.removeAttr("draggable");
				
				element.attr("data-drag",true);
				element.attr("jqyoui-draggable","{animate: false, onStart: 'dragService.onDragStart(definition)', onStop: 'dragService.onDragStop()', onDrag: 'dragService.onDrag(definition)', placeholder:'keep'}");
				element.attr("data-jqyoui-options","{appendTo: 'body', cancel: '.previewing', helper: 'clone', revert: 'invalid'}");

				return {
						pre: function preLink(scope, iElement, iAttrs, controller) {},
						post: function postLink(scope, iElement, iAttrs, controller) 
						{ 
							var update = function()
							{
								$timeout
								(
									function()
									{
										iElement.draggable( scope.canvas.previewing ? 'disable' : 'enable')
									},100
								);
							};
			        	   
			        	   	scope.$watch
			        	   	(
			        	   		'canvas.previewing',
			        	   		function(newVal,oldVal)
			        	   		{
			        	   			if( newVal != oldVal )
			        	   				update();
			        	   		}
			        	   	);
			        	   	
			        	   	$compile(iElement,scope.canvas.previewing)(scope);
			        	   
			        	   	update();
			           }
			    };
			}
		};
	}
);