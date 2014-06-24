app.service
(
	'FactoryService',
	[
	 	function()
	 	{
	 		var service = 
	 		{
	 			_id: 1,
	 			
	 			id: function(c)
	 			{
	 				this._id = 1;
	 				
	 				var walk = function(c)
	 				{
	 					c.id = service.uniqueId();
	 					
	 					if( c.children )
	 					{
	 						for(var ch in c.children)
	 						{
	 							c.children[ch].pid = c.id;
	 							
	 							walk(c.children[ch]);
	 						}
	 					}
	 				};
	 				
	 				walk(c);
	 			},
	 			
				componentInstance: function(definition,values,parent)
				{
					values = values || {};
					
					var clone = angular.copy(definition);
					clone.id = this.uniqueId();
					clone.values = _.defaults(values,angular.copy(definition.values));
					
					if( !clone.componentId )
						clone.componentId = definition.id;
					
					var blacklist = ["$$hashKey","$delete","$get","$query","$remove","$save","__v","_id","abstract","category","container","created","name","properties","resizable","subcomponents"];
					
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