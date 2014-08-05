'use strict';

var fs = require('fs');

module.exports = function(mongoose, conn, callback)
{
    var path = __dirname + '/../import/mongoose-fixture/export-types.json';
    
    fs.readFile
    (
    	path, 
    	'utf8', 
    	function (err, data) 
    	{
    		if (err) 
    			return callback(err, []);

    		return callback(err, JSON.parse(data));
    	}
    );
};
