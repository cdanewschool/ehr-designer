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
						
						var options = 
						{
							ghost:true,
							autoHide:true,
							aspectRatio:constrain,
							stop:function(event,ui)
							{
								var cellData = null;
								
								//	look for cell data
								//	this allows us to resize cells in the same row/column when resizing horizontally/vertically for a cell-based element
								if( attrs.resizableCell )
									cellData = scope.$eval(attrs.resizableCell);
								
								scope.$apply
								(
									function()
									{
										var model = $parse(attrs.resizable);
										var vals = model(scope);
										
										if( !vals ) vals = {};
										
										if( cellData )
										{
											//	vertical resize
											//	resize width for all cells in the corresponding column
											if ( ui.originalSize.width !== ui.size.width ) 
											{
												for(var i=0,col = cellData.index%cellData.cols;i<cellData.cols*cellData.rows;i++)
												{
													if(col == i%cellData.cols)
													{
														if( !vals[i] ) vals[i] = {};
										        		
										        		vals[i].width = ui.size.width;
													}
												}
									        }
											
											//	horizontal resize
											//	resize height for all cells in the corresponding row
									        if ( ui.originalSize.height !== ui.size.heigh ) 
									        {
									        	var start = Math.floor( cellData.index/cellData.cols ) * cellData.cols;
									        	var end = start + (cellData.cols - 1);
									        	
									        	for(var i=start;i<=end;i++)
									        	{
									        		if( !vals[i] ) vals[i] = {};
									        		
									        		vals[i].height = ui.size.height;
									        	}
									        }
										}
										else
										{
											vals.width = ui.size.width;
											vals.height = ui.size.height;
										}
										
										model.assign(scope,vals);
									}
								);									
								
								HistoryService.save( "Resized to " + scope.definition.values.width + " x " + scope.definition.values.height );
							}
						};
						
						if( attrs.resizableConfig )
							options = _.defaults(scope.$eval(attrs.resizableConfig),options);
						
						angular.element(element).resizable(options);
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