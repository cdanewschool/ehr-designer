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
						
						$cookieStore.remove('user');
						
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
			
			currentUser: function()
			{
				Session.get
				(
					function(user)
					{
						$rootScope.currentUser = user;
						
						console.log(user)
					}
				);
			}
		};
	}
);
