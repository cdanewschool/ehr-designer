'use strict';

var fs = require('fs');

module.exports = function(mongoose, conn, callback)
{
    var path = __dirname + '/../import/mongoose-fixture/elements.json';
    
    fs.readFile
    (
    	path, 
    	'utf8', 
    	function (err, data) 
    	{
    		if (err) 
    			return callback(err, []);
    		
    		var sync = function(target,source)
			{
				var inheritableProperties = ['binding','container','resizable'];
				
				//	copy inheritable attributes from parent
				for(var p in inheritableProperties)
					if( source.hasOwnProperty( inheritableProperties[p] ) && !target.hasOwnProperty( inheritableProperties[p] ) )
						target[inheritableProperties[p]] = source[inheritableProperties[p]];
				
				//	copy properties from parent
				for(p in source.properties)
				{
					var exists = false;
					var property = source.properties[p];
					
					for(var p2 in target.properties)
					{
						if( target.properties[p2].id == property.id )
							exists = true;
					}
					
					if( target.ignoreProperties 
						&& target.ignoreProperties.indexOf(property.id)>-1 )
						exists = true;
					
					if( !exists )
						target.properties.push( source.properties[p] );											
				};
				
				if( !target.values )
					target.values = {};
				
				for(p in source.values)
				{
					if( !target.values[p] )
						target.values[p] = source.values[p];											
				};
			};
			
    		function parse(c,components)
			{
				if( c.componentId )
				{
					for(var sc in components)
						if( components[sc].id == c.componentId )
							sync(c,components[sc]);
				}
				
				components = components || [];
				
				if( c.id )
					components.push( c );
				
				if( !c.properties ) 
					c.properties = [];
				
				if( c.subcomponents )
				{
					for(var d in c.subcomponents)
					{
						var child = c.subcomponents[d];
						
						if( !child.properties ) 
							child.properties = [];
						
						sync(child,c);
						
						parse(child,components);
					};
					
					delete c.subcomponents;
				}
				
				return components;
			}
			
			var components = parse( JSON.parse(data)[0] );
			
    		return callback(null,components);
    	}
    );
};
