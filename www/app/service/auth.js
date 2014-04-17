app.factory
(
	'Auth',
	function($rootScope,$location,User,Session,$cookieStore)
	{
		$rootScope.currentUser = $cookieStore.get('user') || null;
		$cookieStore.remove('user');
		
		return {
			
			login: function(user,callback)
			{
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
			
			logout: function(callback)
			{
				Session.remove
				(
					function(res)
					{
						$rootScope.currentUser = null;
						
						return callback();
					},
					function(err)
					{
						return callback(err.data);
					}
				);
			},
			
			signup: function(user,callback)
			{
				User.save
				(
					user,
					function(user)
					{
						$location.path("/");
					},
					function(err) 
					{
			        	return callback(err.data);
					}
				);
			},
			
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