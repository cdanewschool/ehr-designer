app.controller
(
	'MediaCtrl',
	function($scope,$rootScope,$http,Image,navigation)
	{
		$scope.data = null;
		$scope.images = null;
		$scope.errors = [];
		
		$scope.find = function()
		{
			Image.query
			(
				null,
				function(response)
				{
					$scope.images = response;
				}
			);
		};
		
		$scope.delete = function(image)
		{
			navigation.showConfirm("Really delete?").then
			(
				function()
				{
					image.$remove
					(
						{
							imageId:image.id
						},
						function(response)
						{
							$scope.find();
						},
						function(response)
						{
							console.log(response);
						}
					);
				}
			);
		};
		
    	$scope.upload = function()
    	{
    		$scope.errors = [];
    		
    		var data = new FormData();
    		data.append('file',$scope.data);
    		
    		$http.post
    		(
    			'/api/images/', 
    			data, 
    			{
    				headers: {'Content-Type':undefined},
    				transformRequest:angular.identity
    			}
    		)
    		.success
    		(
    			function(response)
    			{
    				$scope.data = null;
    				
    				console.log( "Image uploaded" );
    				
    				$scope.find();
    			}
    		)
    		.error
    		(
    			function(response,errCode)
    			{
    				if( errCode == 409 
    					&& !response.errors )
    					response = {errors:{file:{message:"Image exists"}}};
    				
    				if( response.errors )
    				{
    					angular.forEach
						(
							response.errors,
							function(error,field)
							{
								$scope.errors[field] = error.message;
							}
						);
    				}
    			}
    		);
    	};
	}
);