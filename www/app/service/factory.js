app.service
(
	'FactoryService',
	[
	 	function()
	 	{
	 		var service = 
	 		{
	 			_id: 1,
	 			
				componentInstance: function(definition,values,parent)
				{
					var clone = angular.copy(definition);
					clone.id = this.uniqueId();
					clone.componentId = definition.id;
					clone.values = _.defaults(values,angular.copy(definition.values));
					
					var blacklist = ["$$hashKey","$delete","$get","$query","$remove","$save","__v","_id","abstract","container","created","name","properties","resizable","subcomponents"];
					
					for(var p in definition)
						if( blacklist.indexOf(p) > -1 )
							delete clone[p];
					
					if( parent ) 
						clone.pid = parent.id;
					
					if( clone.children ) 
					{
						for(var c in clone.children)
						{
							clone.children[c].pid = clone.id;
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
					return this._id++;
				}
	 		};
		 		
	 		return service;
	 	}
	 ]
);