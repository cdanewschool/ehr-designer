/**
 * Utilities
 */
app.service
(
	'utilities',
	function(canvas)
	{
		var service = {};
		
		service.getById = function(id)
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
		
		service.getPath = function(obj,path)
		{
			var parts = path.split('.');
			
			while(part = parts.shift())
			{
				if( !obj[part] )
					return false;
				
				obj = obj[part];
			}
			
			return true;
		};
		
		service.resolvePath = function(obj,path)
		{
			var o = obj;
			
		    path = path.replace(/\[(\w+)\]/g, '.$1');
		    path = path.replace(/^\./, '');
		   
		    var a = path.split('.');
		    
		    while (a.length) 
		    {
		        var n = a.shift();
		        
		        if (n in o) 
		            o = o[n];
		       	else
		            return;
		    }
		    
		    return o;
		};
		
		service.setPath = function(obj,path,value)
		{
			if (typeof path === "string")
		        path = path.split('.');

		    if(path.length > 1)
		    {
		        var p=path.shift();
		        
		        if(obj[p]==null || typeof obj[p]!== 'object')
		             obj[p] = {};
		        
		        service.setPath(obj[p],path,value);
		        
		    }
		    else
		    {
		        obj[path[0]] = value;
		    }
		};
		
		/**
		 * Removes a component definition from the tree
		 * 
		 * @instance {Object} instance The component definition to remove (must contain a `pid` property referencing the id of it's parent)
		 */
		service.remove = function(instance)
		{
			var parentId = instance.pid;
			
			var parent = service.getById(parentId);
			
			if( !parent )
				throw new Error("no parent for " + instance.pid);
			
			var index = parent.children.indexOf(instance);
			
			parent.children.splice( index, 1 );
		};
		
		return service;
	}
);