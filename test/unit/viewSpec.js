'use strict';

//	User controller
describe
(
	'View',
	function($injector)
	{
	    var rootScope = null,scope = null;
	    var loggedInUser = {_id:1111};
		
		beforeEach(module('app'));
		
		beforeEach
		(
			inject
			(
				function($rootScope,$httpBackend)
				{
					rootScope = $rootScope;
					scope = rootScope.$new();
					
					var version = JSON.parse(readFixtures("base/www/version.json"));
					$httpBackend.when('GET','version.json').respond( function(){ return [200, version, {}]; } );
				}
			)
		);
		
		it
		(
			'should hide certain nav items if logged out',
			inject
			(
				function($compile,$controller)
				{
					loadFixtures("base/www/partials/includes/navigation.html");
					
					$controller('AppCtrl',{$scope:scope,$rootScope:rootScope});
					$compile( angular.element('#jasmine-fixtures') )(scope);
					scope.$digest();
					
					expect( '#main-menu > li:nth-child(2)' ).toBeHidden();
					expect( '#user-menu > li:nth-child(2)' ).toBeHidden();
					expect( '#user-menu > li:nth-child(4)' ).toBeHidden();
				}
			)
		);
		
		it
		(
			'should show certain nav items if logged in',
			inject
			(
				function($compile,$controller)
				{
					loadFixtures("base/www/partials/includes/navigation.html");
					
					rootScope.currentUser = loggedInUser;
					
					$controller('AppCtrl',{$scope:scope,$rootScope:rootScope});
					$compile( angular.element('#jasmine-fixtures') )(scope);
					scope.$digest();
					
					expect( '#main-menu > li:nth-child(2)' ).toBeVisible();
					expect( '#user-menu > li:nth-child(2)' ).toBeVisible();
					expect( '#user-menu > li:nth-child(4)' ).toBeVisible();
				}
			)
		);
	}
);