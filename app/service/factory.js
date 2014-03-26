app.service
(
	'FactoryService',
	[
	 	function()
	 	{
	 		return {
				componentInstance: function(definition,values,parent)
				{
					var clone = angular.copy(definition);
					clone.id = this.uniqueId();
					clone.values = _.defaults(values,definition.values);
					
					var disclude = ["abstract","autoLayoutChildren","container","name","properties","resizable","subcomponents"];
					
					for(var p in definition)
						if( disclude.indexOf(p) > -1 )
							delete clone[p];
					
					if( parent ) clone.pid = parent.id;
					
					if( clone.children ) 
					{
						for(var c in clone.children)
						{
							clone.children[c].pid = clone.id;
							clone.children[c].id = this.uniqueId();
						}
					}
					else
					{
						clone.children = [];
					}
					
					return clone;
				},
				
				uniqueId: function()
				{
					return _.uniqueId();
				}
	 		};
	 	}
	 ]
);