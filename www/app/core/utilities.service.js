/**
 * Utilities
 */
app.service
(
	'utilities',
	function(canvas)
	{
		var getParentById = function(id)
		{
			var search = function(item)
			{
				if(item.id == id)
					return item;
				
				if( item.children )
				{
					for(var c in item.children)
					{
						var val = search(item.children[c]);
						
						if( val ) return val;
					}
				}
				
				return false;
			};
			
			return search(canvas.currentPage);
		};
		
		return {
			
			/**
			 * Removes a component definition from the tree
			 * 
			 * @instance {Object} instance The component definition to remove (must contain a `pid` property referencing the id of it's parent)
			 */
			remove: function(instance)
			{
				var parentId = instance.pid;
				
				var parent = getParentById(parentId);
				
				if( !parent )
					throw new Error("no parent for " + instance.pid);
				
				var index = parent.children.indexOf(instance);
				
				parent.children.splice( index, 1 );
			}
		};
	}
);