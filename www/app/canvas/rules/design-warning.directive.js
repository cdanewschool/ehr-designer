app.directive
(
	'designWarning',
	function(rules,utilities)
	{
		return {
			restrict:'A',
			link: function(scope,element,attrs)
			{
				var hideHighlight = function()
				{
					var ids = scope.$eval(attrs.designWarning).instanceIds;
					
					angular.forEach
					(
						ids,
						function(id)
						{
							angular.element('[data-id='+id+']').removeClass('highlight');
						}
					);
				};
				
				var dismiss = function(event)
				{
					event.stopImmediatePropagation();
					
					hideHighlight();
					
					var warning = scope.$eval(attrs.designWarning);
					
					scope.$apply
					(
						function()
						{
							warning.dismissed = true;
						}
					);
				};
				
				element.on
				(
					'mouseover',
					function()
					{
						if( !attrs.designWarning ) return;
						
						var ids = scope.$eval(attrs.designWarning).instanceIds;
						
						angular.forEach
						(
							ids,
							function(id)
							{
								angular.element('[data-id='+id+']').addClass('highlight');
							}
						);
					}
				);
				
				element.on('mouseout',hideHighlight);
				
				element.find('button.close').on('click',dismiss);
				
				element.find('button.resolve').on
				(
					'click',
					function()
					{
						event.stopImmediatePropagation();
						
						hideHighlight();
						
						var warning = scope.$eval(attrs.designWarning);
						var reference = undefined;
						
						angular.forEach
						(
							warning.rule.resolution.actions,
							function(resolution)
							{
								switch(resolution.type)
								{
									case "property":
										
										angular.forEach
										(
											warning.instanceIds,
											function(id)
											{
												var instance = utilities.getById(id);
												
												if( resolution.value.value == "reference" )
												{
													if( !reference )
														reference = instance;
													else
														scope.$apply
														(
															function()
															{
																if( utilities.getPath(instance.values,resolution.value.property) 
																	&& utilities.getPath(reference.values,resolution.value.property) )
																	utilities.setPath(instance.values,resolution.value.property,utilities.resolvePath(reference.values,resolution.value.property));
															}
														);
												}
												else
												{
													scope.$apply
													(
														function()
														{
															utilities.setPath(instance.values,resolution.value.property,resolution.value.value);
														}
													);
												}
											}
										);
										
										break;
								}
							}
						);
					}
				);
			}
		};
	}
);