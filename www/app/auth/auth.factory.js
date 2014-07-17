/**
 * Factory for managing authentication
 */
app.factory
(
	'Auth',
	function($rootScope,$location,User,Session,$cookieStore)
	{
		//	try to initialize user from cookie
		//	cookie is written on server side (see lib/config/routes.js)
		$rootScope.currentUser = $cookieStore.get('user') || null;
		$cookieStore.remove('user');
		
		return {
			
			/**
			 * Logs a user in
			 * 
			 * @param {Object} user Object containing username and password to authenticate against
			 * @param {Function} Function to execute on error/success
			 * 
			 * @see /lib/models/session.js
			 * @todo Deprecate callback for promise
			 */
			login: function(user,callback)
			{
				callback = callback || angular.noop;
				
				Session.save
				(
					user,
					function(user)
					{
						$rootScope.currentUser = user;
						return callback();
					},
					function(err)
					{
						return callback(err.data);
					}
				);
			},
			
			/**
			 * Logs a user out
			 * 
			 * @param {Function} Function to execute on error/success
			 * 
			 * @see /lib/models/session.js
			 * @todo Deprecate callback for promise
			 */
			logout: function(callback)
			{
				Session.remove
				(
					function(res)
					{
						$rootScope.currentUser = null;
						
						$cookieStore.remove('user');
						
						return callback();
					},
					function(err)
					{
						return callback(err.data);
					}
				);
			},
			
			/**
			 * Signs up a user
			 * 
			 * @param {Object} user Object containing user object to register
			 * @param {Function} Function to execute on error/success
			 * 
			 * @see /lib/models/user.js
			 * @see /lib/controllers/users.js
			 * @todo Deprecate callback for promise
			 */
			signup: function(user,callback)
			{
				User.save
				(
					user,
					function(user)
					{
						var path = "/login";
						
						$location.search('success','Account created. Please login.');
						
						if( !user.confirmed )
							$location.search('success','A confirmation email was sent to "' + user.email + '". Please confirm your account before logging in.');
						
						$location.path( path );
					},
					function(err) 
					{
			        	return callback(err.data);
					}
				);
			},
			
			/**
			 * Attempts to retrieve current user from session
			 * 
			 * @todo Rename getCurrentUserFromSession or similar
			 */
			currentUser: function()
			{
				Session.get
				(
					function(user)
					{
						$rootScope.currentUser = user;
					}
				);
			}
		};
	}
);
