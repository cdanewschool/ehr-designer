app.directive
(
	'componentDraggable',
	function($compile,$timeout)
	{
		return {
			restrict : 'A',
			require: '^componentPreview',
			compile: function compile(element,attrs)
			{
				element.removeAttr("component-draggable");
				
				element.attr("data-drag",true);
				element.attr("jqyoui-draggable","{animate: false, onStart: 'onDragStart', onStop: 'onDragStop', onDrag: 'onDrag', placeholder:'keep'}");
				element.attr("data-jqyoui-options","{appendTo: 'body', cancel: '.previewing', helper: getDragPreview, revert: 'invalid'}");
				
				return {
						pre: function preLink(scope, iElement, iAttrs, controller) {},
						post: function postLink(scope, iElement, iAttrs, controller) 
						{
							scope.onDrag = function(event,ui)
							{
								controller.onDrag(event,ui);
							};
							
							scope.onDragStart = function(event,ui)
							{
								controller.onDragStart(event,ui);
							};
							
							scope.onDragStop = function(event,ui)
							{
								controller.onDragStop(event,ui);
							};
							
							scope.getDragPreview = function(event)
							{
								return controller.getDragPreview(event);
							};
							
							var update = function()
							{
								$timeout
								(
									function()
									{
										if( !iElement.data('ui-draggable') ) return;
										
										iElement.draggable( (scope.canvas && scope.canvas.previewing) || (scope.$eval(iAttrs.componentDraggable)===false) ? 'disable' : 'enable' );
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
			        	   	
			        	  	$compile(iElement)(scope);
			        	   	
			        	   	update();
			           }
			    };
			}
		};
	}
);