var fs = require('fs');

module.exports = function(mongoose, conn, callback)
{
    var path = __dirname + '/../import/templates.json';
    
    fs.readFile
    (
    	path, 
    	'utf8', 
    	function (err, data) 
    	{
    		if (err) 
    			return callback(err, []);
    		
    		return callback(null,JSON.parse(data));
    	}
    );
};
