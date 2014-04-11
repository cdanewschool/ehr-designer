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
			
			remove: function(instance)
			{
				var parentId = instance.pid;
				
				var parent = getParentById(parentId);
				
				if( !parent )
					throw new Error("no parent for " + instance.pid);
				
				var oldIndex = parent.children.indexOf(instance);
				
				parent.children.splice( oldIndex, 1 );
			}
		};
	}
);