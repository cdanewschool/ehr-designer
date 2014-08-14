app.controller
(
	'RulesCtrl',
	[
	 	'$scope','$filter','RulesService','rules','canvas','utilities',
	 	function($scope,$filter,rulesService,rules,canvas,utilities)
	 	{
	 		$scope.rules = rules;
	 		$scope.canvas = canvas;
	 		
	 		$scope.showingDismissed = false;
	 		
	 		$scope.$watch
	 		(
	 			'rules.warnings',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					rules.warningsDismissed = $filter('filter')(rules.warnings, {'dismissed':true});
	 					rules.warningsPending = $filter('filter')(rules.warnings, {'dismissed':false});
	 				}
	 			},true
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'canvas.currentPage',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal!=oldVal)
	 				{
	 					evaluate();
	 				}
	 			},true
	 		);
	 		
	 		$scope.$watch
	 		(
	 			'canvas.currentProject',
	 			function(newVal,oldVal)
	 			{
	 				if(newVal&&oldVal&&newVal._id!=oldVal._id)
	 				{
	 					rules.violationCache = {};
	 				}
	 			}
	 		);
	 		
	 		$scope.find = function()
	 		{
	 			rulesService.get().then(evaluate);
	 		};
	 		
	 		var evaluate = function()
	 		{
	 			if( !rules.violationCache )
	 				rules.violationCache = {};
	 			
	 			var warnings = new Array();
	 			
	 			if( !canvas.currentPage ) 
	 			{
	 				rules.warnings = warnings;
	 				return;
	 			}
	 			
	 			angular.forEach
	 			(
	 				rules.rules,
	 				function(rule)
	 				{
	 					var violationsForRuleById = {};
	 					
	 					//	for each precondition, find all offending instances and append
	 					//	their id to `violationsForRule` array
	 					angular.forEach
	 					(
	 						rule.preconditions,
	 						function(precondition)
	 						{
	 							var modifier = precondition.modifier;
	 							var property = precondition.property;
		 							
								//	 `modifier` defaults
								if( typeof property.value == "object" )
									modifier = modifier || "inside";
								else 
									modifier = modifier || "equals";
									
								switch(precondition.type)
	 							{
	 								case "proximity":
	 								
	 									var walk = function(c,property,offenders)
	 									{
	 										offenders = (typeof offenders == 'undefined' ? [] : offenders);
	 										
	 										if( c.children )
	 										{
	 											var offendingSiblingIds = {};
	 											
	 											angular.forEach
	 											(
	 												c.children,
	 												function(child)
	 												{
	 													var match = false;
	 													
	 													angular.forEach
	 													(
	 														offendingSiblingIds,
	 														function(info,id)
	 														{
	 															var diff = Math.abs(child.values[property.name] - info.value);
	 															
	 															if( modifier=="inside" && diff!=0 && diff >= property.value[0] && diff <= property.value[1] )
	 															{
	 																info.matches.push( child.id );
	 																match = true;
	 															}
	 														}
	 													);
	 													
	 													if( !match )
	 														offendingSiblingIds[child.id] = {value:child.values[property.name],matches:[]};
	 												}
	 											);
	 											
	 											angular.forEach
	 											(
	 												offendingSiblingIds,
	 												function(result,id)
	 												{
	 													if( result.matches.length )
	 														offenders[id] = [parseInt(id)].concat(result.matches);
	 												}
	 											);
	 											
	 											angular.forEach
	 											(
	 												c.children,
	 												function(child)
	 												{
	 													return walk(child,property,offenders);
	 												}
	 											);
	 										}
	 										
	 										return offenders;
	 									};
	 									
	 									var offendingIds = walk(canvas.currentPage,property);
	 									
	 									//	 for each id, increment total violation count
	 									angular.forEach
	 									(
	 										offendingIds,
	 										function(ids,id)
	 										{
	 											if(!violationsForRuleById[id]) 
	 												violationsForRuleById[id] = {count:0,ids:ids};
	 											
	 											violationsForRuleById[id].count++;
	 										}
	 									);
	 									
	 									break;
	 									
	 								case "property":
	 									
	 									var walk = function(c,property,offenders)
	 									{
	 										offenders = (typeof offenders == 'undefined' ? [] : offenders);
	 										
	 										if( c.values && utilities.getPath(c.values,property.name) )
	 										{
	 											var val = utilities.resolvePath(c.values,property.name);
	 											
	 											switch(property.type)
	 											{
	 												case "int":
	 													
	 													if( typeof property.value == "object" )
	 													{
	 														if( modifier == "inside" 
	 															&& val >= property.value[0] && val <= property.value[1] )
	 															offenders.push(c.id);
	 														else if( modifier == "outside" 
	 															&& val <= property.value[0] || val >= property.value[1] )
	 															offenders.push(c.id);
	 													}
	 													else 
	 													{
	 														if( modifier == "lessthan" 
	 															&& val < property.value )
	 															offenders.push(c.id);
	 														else if( modifier == "lessthanorequalto" 
	 															&& val <= property.value )
	 															offenders.push(c.id);
	 														else if( modifier == "equals" 
	 															&& val == property.value )
	 															offenders.push(c.id);
	 														else if( modifier == "greaterthanorequalto" 
	 															&& val >= property.value )
	 															offenders.push(c.id);
	 														else if( modifier == "greaterthan" 
	 															&& val > property.value )
	 															offenders.push(c.id);
	 													}
	 													
	 													break;
 													
	 												case "string":
	 													
	 													if( property.value )
	 													{
	 														if( modifier == "equals" 
	 															&& val == property.value )
	 															offenders.push(c.id);
	 													}
	 													
	 													break;
	 													
	 												case "color":
	 													
	 													var h2d = function(h)
	 													{
	 														h = h.indexOf('#')>-1?h.substr(h.indexOf('#')+1):h;
	 														
	 														return parseInt(h,16);
	 													};
	 													
	 													if( typeof property.value == "object" )
	 													{
	 														val = h2d(c.values[property.name]);
	 			 											
	 														if( modifier == "inside" 
	 															&& val >= h2d(property.value[0]) && val <= h2d(property.value[1]) )
	 														{
	 															offenders.push(c.id);
	 														}
	 														else if( modifier == "outside" 
	 															&& val <= h2d(property.value[0]) && val >= h2d(property.value[1]) )
	 															offenders.push(c.id);
	 													}
	 													
	 													break;
	 											}
	 										}
	 										
	 										if( c.children )
	 											for(var i=0;i<c.children.length;i++)
	 												walk(c.children[i],property,offenders);
	 										
	 										return offenders;
	 									};
	 									
	 									var _ids = walk(canvas.currentPage,property);	//	id of all instances offending this precondition
	 									
	 									//	for each id, increment total violation count
	 									angular.forEach
	 									(
	 										_ids,
	 										function(id)
	 										{
	 											if(!violationsForRuleById[id]) 
	 												violationsForRuleById[id] = {count:0,ids:[id]};
	 											
	 											violationsForRuleById[id].count++;
	 										}
	 									);
	 									
	 								break;
	 							}
	 						}
	 					);
	 					
	 					angular.forEach
						(
							violationsForRuleById,
							function(info,id)
							{
								if( info.count == rule.preconditions.length )
								{
									var violation = {message:rule.message,date:new Date(),dismissed:false,instanceIds:info.ids,rule:rule};
				 						
				 					var cacheKey = [canvas.currentPage.id,rule.id].concat(info.ids).join("_");
				 						
				 					if( rules.violationCache[cacheKey] )
				 						violation = rules.violationCache[cacheKey];
				 					else
				 						rules.violationCache[cacheKey] = violation;
				 					
				 					warnings.push( violation );
								}
							}
						);
	 				}
	 			);
	 			
	 			rules.warnings = warnings;
	 		};
	 	}
	 ]
);