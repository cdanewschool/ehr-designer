app.service
(
	'RulesService',
	[
	 	'DesignRule','$q','rules',
	 	function(DesignRule,$q,rules)
	 	{
	 		return {
	 			
	 			get: function()
	 			{
	 				var async = $q.defer();
	 				
	 				DesignRule.get
	 				(
	 					{},
	 					function(_rules)
	 					{
	 						var i = 0;
	 						
	 						angular.forEach
	 						(
	 							_rules,
	 							function(rule)
	 							{
	 								rule.id = i++;
	 							}
	 						);
	 						
	 						rules.rules = _rules;
	 						
	 						console.log( _rules );
	 						
	 						async.resolve();
	 					}
	 				);
	 				
	 				return async.promise;
	 			}
	 		};
	 	}
	 ]
);