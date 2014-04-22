app.directive
(
	'resizable',
	function($parse,$compile,canvas,FactoryService,HistoryService)
	{
		return {
			restrict : 'A',
			link: function(scope,element,attrs)
			{
				var update = function()
				{
					if( !canvas.previewing
						&& !scope.isStatic
						&& scope.componentDefinition.resizable )
					{
						var constrain = scope.componentDefinition.resizable && (typeof scope.componentDefinition.resizable == 'object') && scope.componentDefinition.resizable.constrain;
						
						angular.element(element).resizable
						(
							{
								ghost:true,
								autoHide:true,
								aspectRatio:constrain,
								stop:function(event,ui)
								{
									var model = $parse(attrs.resizable);
									
									scope.$apply
									(
										function()
										{
											var model = $parse(attrs.resizable);
											var vals = model(scope);
											
											if( !vals )
												vals = {};
											
											vals.width = ui.size.width;
											vals.height = ui.size.height;
											
											model.assign(scope,vals);
										}
									);									
									
									HistoryService.save( "Resized to " + scope.definition.values.width + " x " + scope.definition.values.height );
								}
							}
						);
					}
					else
					{
						try
						{
							angular.element(element).resizable("destroy");
						}
						catch(e){}
					}
				};
				
				scope.$watch
				(
					'isStatic + scope.componentDefinition.container + canvas.previewing',
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
							update();
					}
				);
				
				update();
			}
		};
	}
);