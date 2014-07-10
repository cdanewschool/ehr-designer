app.directive
(
	'resizable',
	function($parse,$compile,canvas,HistoryService)
	{
		return {
			restrict : 'A',
			link: function(scope,element,attrs)
			{
				var update = function()
				{
					if( !canvas.previewing
						&& !scope.isStatic
						&& scope.definition.resizable )
					{
						var constrain = scope.definition.resizable && (typeof scope.definition.resizable == 'object') && scope.definition.resizable.constrain;
						
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
												var cols = cellData.index%cellData.cols;
												var cells = cellData.cols*cellData.rows;
												
												for(var i=0,col = cols;i<cells;i++)
												{
													if(col == i%cellData.cols || cellData.tiled===false)
													{
														if( !vals[i] ) vals[i] = {};
										        		
										        		vals[i].width = ui.size.width;
													}
												}
									        }
											
											//	horizontal resize
											//	resize height for all cells in the corresponding row
									        if ( ui.originalSize.height !== ui.size.height ) 
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
								
								HistoryService.save( "Resized to " + scope.instance.values.width + " x " + scope.instance.values.height );
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
					'canvas.previewing',
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
							update();
					}
				);
				
				scope.$watch
				(
					'instance.values.width',
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
						{
							angular.element(element).css("width",scope.instance.values.width);
						}
					}
				);
				
				scope.$watch
				(
					'instance.values.height',
					function(newVal,oldVal)
					{
						if( newVal != oldVal )
						{
							angular.element(element).css("height",scope.instance.values.height);
						}
					}
				);
				
				update();
			}
		};
	}
);