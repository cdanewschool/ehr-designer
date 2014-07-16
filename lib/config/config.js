'use strict';

/**
 * Configuration options
 */

module.exports = 
{
	//	run on port 3000 unless a custom port has been specified
	//	to specify a custom port, i.e. 3010, start the server with `PORT=3010 node server`
	port: process.env.PORT || 3000,
	
	//	mondodb connection string
	db: "mongodb://localhost/ehr-designer",
	
	//	whether to enable email-based account confirmation
	//	email confirmation will only be enabled if set to true and a valid Mandrill API-key
	//	is specified below
	confirmAccounts: false,
	
	//	valid usage key for the Mandrill API (https://mandrillapp.com)
	mandrill:
	{
		apiKey: ""
	}
};