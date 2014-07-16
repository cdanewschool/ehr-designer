'use strict';

//	User controller
describe
(
	'UserCtrl',
	function($injector)
	{
	    var rootScope = null,scope = null,location  = null;
	    
		beforeEach(module('app'));
		
		beforeEach
		(
			inject
			(
				function($rootScope,$location,$httpBackend)
				{
					rootScope = $rootScope;
					scope = rootScope.$new();
					location = $location;
					
					//	mock user-related services
					$httpBackend.when('GET','auth/session').respond( function(){ return [200, {username: 'test'}, {}]; } );
					$httpBackend.when
					(
						'POST',
						'auth/session',
						function(data)
						{
							return true;
						}
					)
					.respond
					(
						function(method,url,data)
						{
							if( data.email && data.password )
								return null;
							
							return {errors:[]};
						}
					);
					$httpBackend.when
					(
						'DELETE',
						'auth/session',
						function(data)
						{
							return true;
						}
					)
					.respond
					(
						function(method,url,data)
						{
							return [200, null, {}];
						}
					);
				}
			)
		);
		
		it
		(
			'should allow `success` and `error` parameters to be initialized via routeparams',
			inject
			(
				function($controller,$routeParams)
				{
					$routeParams.success = "Good job!";
					$routeParams.error = "Bad job!";
					
					$controller('UserCtrl',{$scope:scope});
					
					expect(scope.success).toBe("Good job!");
					expect(scope.error).toBe("Bad job!");
				}
			)
		);
		
		it
		(
			'login() should get session and redirect to /myprojects with valid credentials',
			inject
			(
				function($controller,$httpBackend)
				{
					$controller('UserCtrl',{$rootScope:rootScope,$scope:scope,$location:location});
					
					scope.user = {email:"test@test.com",password:"test"};
					
					scope.$apply(function() {scope.login();});
					
					$httpBackend.flush();
					
					expect( scope.error ).toEqual(null);
					expect( scope.errors ).toEqual({});
					expect( scope.success ).toEqual(null);
					
					expect( rootScope.currentUser ).toBeDefined();
					expect( location.path() ).toBe('/myprojects');
					
					//TODO: verify state of cookie store
				}
			)
		);
		
		it
		(
			'logout() should remove session and redirect to /',
			inject
			(
				function($controller,$httpBackend,$cookieStore)
				{
					$controller('UserCtrl',{$rootScope:rootScope,$scope:scope,$location:location});
					
					scope.$apply
					(
						function() 
						{
							scope.logout();
						}
					);
					
					$httpBackend.flush();
					
					expect( rootScope.currentUser ).toBe(null);
					expect( location.path() ).toBe('/');
					
					//TODO: verify state of cookie store
				}
			)
		);
		
		//	TODO: signup()
	}
);

describe
(
	'Browse/Canvas',
	function()
	{
		var rootScope = null,scope = null,location  = null;
		var components = null,elements = null,templates = null,sampleData = null;
		
		var loggedInUser = null,userA = null,userB = null;
		var projects = null,project1 = null,project2 = null,page1 = null,page2 = null;
		
		beforeEach(module('app'));
		beforeEach(module('partials/templates/edit-item.html'));
		
		beforeEach
		(
			inject
			(
				function($rootScope,$httpBackend,$location)
				{
					rootScope = $rootScope;
					scope = $rootScope.$new();
					location = $location;
					
					jasmine.getFixtures().fixturesPath = '/';
					
					components = JSON.parse(readFixtures("base/test/mock/components.json"));
					elements = JSON.parse(readFixtures("base/test/mock/elements.json"));
					templates = JSON.parse(readFixtures("base/test/mock/templates.json"));
					sampleData = JSON.parse(readFixtures("base/www/json/sample-data.json"));
					
					//	mock api
					$httpBackend.when('GET','api/components').respond( function(){ return [200, components, {}]; } );
					$httpBackend.when('GET','api/elements').respond( function(){ return [200, elements, {}]; } );
					$httpBackend.when('GET','api/templates').respond( function(){ return [200, templates, {}]; } );
					$httpBackend.when('GET','json/sample-data.json').respond( function(){ return [200, sampleData, {}]; } );
					$httpBackend.when('POST','api\/projects').respond( function(){ return [200, null, {}]; } );
					$httpBackend.when('PUT',/api\/projects\/\d*/).respond( function(){ return [200, null, {}]; } );
					$httpBackend.when('GET',/api\/projects\/\d*/).respond
					( 
						function(method,url,params)
						{
							var id = url.substr( url.lastIndexOf('/') + 1 );
							
							if( projects[id] )
								return [200, projects[id], {}];
							
							return [500, null, {}];
						} 
					);
					
					//	mock objects
					userA = {_id:1111};
					userB = {_id:1112};
					loggedInUser = userA;
					
					//	this is counter-intuitive, but the logic that assigns every member in the tree
					//	an id must run through children in reverse order
					page1 = { _id:1, name: "page 1", children: [] };
					page2 = { _id:2, name: "page 2", children: [] };
					
					//	project for userA
					project1 = { _id: 1, _isNew: false, name: "my project", content: {children: [ page1, page2 ] }, creator: userA };
					//	project for userB
					project2 = { _id: 2, _isNew: false, name: "my other project", content: {children: [ page1, page2 ] }, creator: userB };
					
					projects = {1:project1,2:project2};
				}
			)
		);
		
		describe
		(
			'BrowseCtrl',
			function()
			{
				beforeEach
				(
					inject
					(
						function($controller,$rootScope,$location,$httpBackend)
						{
							location = $location;
						}
					)
				);
				
				it
				(
					'should select the page corresponding to the index specified in routeParams when a project is set',
					inject
					(
						function($controller)
						{
							//	note pageId is 1-based
							$controller('BrowseCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{pageId:2}});
							
							scope.$digest();
							
							scope.currentProject = project1;
							scope.$digest();
							
							expect( scope.currentPage ).toBe( page2 );
						}
					)
				);
				
				it
				(
					'should select the first page when a project is set and no page specified in routeParams',
					inject
					(
						function($controller)
						{
							$controller('BrowseCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{}});
							
							scope.$digest();
							
							scope.currentProject = project1;
							scope.$digest();
							
							expect( scope.currentPage ).toBe( page1 );
						}
					)
				);
				
				it
				(
					'should select the first page when an invalid page is selected',
					inject
					(
						function($controller)
						{
							$controller('BrowseCtrl',{$scope:scope,$rootScope:rootScope});
							scope.$digest();
							
							//	first page (page1) should be selected by default (if no pageId in route params)
							scope.currentProject = project1;
							scope.$digest();
							expect( scope.currentPage ).toBe( page1 );
							
							//	select page2
							scope.selectPageByIndex( 1 );
							expect( scope.currentPage ).toBe( page2 );
							
							//	select page1 again
							scope.selectPageByIndex( 0 );
							expect( scope.currentPage ).toBe( page1 );
							
							//	selecting an invalid page should default to the first page
							scope.selectPageByIndex( 2 );
							expect( scope.currentPage ).toBe( page1 );
						}
					)
				);
				
				it
				(
					'should support initializing a project via routeParams',
					inject
					(
						function($controller,$httpBackend)
						{
							$controller('BrowseCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1}});
							
							$httpBackend.flush();
							
							//	resources contain $promise/$resolved keys when fetched
							//	strip those props so we can test for equality
							var currentProject = JSON.parse(angular.toJson((scope.currentProject)));
							expect(currentProject).toEqual(project1);
							expect(scope.canvas.previewing).toBeTruthy();
						}
					)
				);
				
				it
				(
					'should redirect to /myproject if given an invalid project via routeParams',
					inject
					(
						function($controller,$httpBackend)
						{
							location.path('/browse/3');
							
							$controller('BrowseCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:3}});
							
							$httpBackend.flush();
							
							expect(location.path()).toEqual('/browse');
						}
					)
				);
			}
		);

		describe
		(
			'CanvasCtrl',
			function()
			{
				it
				(
					'should support initializing a project via routeParams',
					inject
					(
						function($controller,$httpBackend)
						{
							rootScope.currentUser = {_id:1111};
							
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1}});
							
							scope.$apply
							(
								function()
								{
									scope.init();
								}
							);
							
							$httpBackend.flush();
							
							//	resources contain $promise/$resolved keys when fetched
							//	strip those props so we can test for equality
							var currentProject = JSON.parse(angular.toJson((scope.canvas.currentProject)));
							expect(currentProject).toEqual(project1);
						}
					)
				);
				
				it
				(
					'should support create a new project if no project specified',
					inject
					(
						function($controller,$httpBackend,template)
						{
							rootScope.currentUser = {_id:1111};
							
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{}});
							
							scope.$apply
							(
								function()
								{
									scope.init();
								}
							);
							
							$httpBackend.flush();
							
							expect(scope.canvas.currentProject).toBeDefined();
							expect(scope.canvas.currentProject.content.children).toEqual(template.document.children);
							expect(scope.canvas.currentProject.content.name).toEqual("My Project");
							expect(scope.canvas.currentProject.sharing).toEqual("private");
						}
					)
				);
				
				/*
				it
				(
					'should launch a modal for specifying the project name when creating a new project',
					inject
					(
						function($controller,$httpBackend,$modal,template)
						{
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{}});
							
							scope.$apply
							(
								function()
								{
									scope.init();
								}
							);
							
							$httpBackend.flush();
							
							expect(scope.modal).toBeDefined();
						}
					)
				);
				*/
				
				it
				(
					'should select the page corresponding to the index specified in the url when a project is set',
					inject
					(
						function($controller,$httpBackend)
						{
							rootScope.currentUser = loggedInUser;
							
							//	note pageId is 1-based
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1,pageId:2}});
							
							scope.$apply
							(
								function()
								{
									scope.init();
								}
							);
							
							$httpBackend.flush();
							
							expect( scope.canvas.currentPage ).toEqual( angular.extend(page2,{id:1}) );
						}
					)
				);
				
				it
				(
					'should select the first page when an invalid page is specified in the url',
					inject
					(
						function($controller,$httpBackend)
						{
							rootScope.currentUser = loggedInUser;
							
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1,pageId:1}});
							
							scope.$apply
							(
								function()
								{
									scope.init();
								}
							);
							
							$httpBackend.flush();
							
							//	first page (page1) should be selected by default (if no pageId in route params)
							expect( scope.canvas.currentPage ).toEqual( angular.extend(page1,{id:1}) );
							
							//	select page2
							scope.selectPageByIndex( 1 );
							expect( scope.canvas.currentPage ).toEqual( page2 );
							
							//	select page1 again
							scope.selectPageByIndex( 0 );
							expect( scope.canvas.currentPage ).toEqual( page1 );
							
							//	selecting an invalid page should default to the first page
							scope.selectPageByIndex( 2 );
							expect( scope.canvas.currentPage ).toEqual( page1 );
						}
					)
				);
				
				it
				(
					'should prevent the logged-in user from editing a project they don\'t own',
					inject
					(
						function($controller,$httpBackend)
						{
							rootScope.currentUser = loggedInUser;
							
							//	mock specifying a project owned by a different user in the url
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:2}});
							
							scope.$apply( function(){ scope.init();} );
							
							$httpBackend.flush();
							
							expect(location.path()).toEqual("/myprojects");
						}
					)
				);
				
				it
				(
					'should set canvas.previewing to false when navgating away',
					inject
					(
						function($controller)
						{
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{}});
							
							//	initially, canvas.previewing should be false
							expect(scope.canvas.previewing).toBeFalsy();
							
							//	when previewing a project it should be set to true
							scope.previewProject();
							expect(scope.canvas.previewing).toBeTruthy();
							
							//	when view state changes, canvas.previewing should be set to false
							rootScope.$broadcast('$locationChangeStart');
							expect(scope.canvas.previewing).toBeFalsy();
						}
					)
				);
				
				
				it
				(
					'should set dirty flag to true when currentPage changes, and set it to false when a new page is set',
					inject
					(
						function($controller,$httpBackend)
						{
							//	mock initializing a project via url
							rootScope.currentUser = loggedInUser;
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1,pageId:1}});
							scope.$apply( function(){ scope.init();} );
							$httpBackend.flush();
							
							//	canvas should be clean when a new project loads
							expect(scope.canvas.dirty).toBeFalsy();
							
							//	canvas should be flagged as dirty when the page changes
							scope.canvas.currentPage.name = "something else";
							scope.$digest();
							expect(scope.canvas.dirty).toBeTruthy();
							
							//	canvas should be clean when a new page is displayed for editing
							scope.selectPageByIndex(1);
							scope.$digest();
							expect(scope.canvas.dirty).toBeFalsy();
						}
					)			
				);
				
				it
				(
					'should update project\'s pages when adding/deleting a page',
					inject
					(
						function($controller,$httpBackend)
						{
							//	mock initializing a project via url
							rootScope.currentUser = loggedInUser;
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1,pageId:1}});
							scope.$apply( function(){ scope.init();} );
							$httpBackend.flush();
							
							var pageCount = scope.canvas.currentProject.content.children.length;
							
							//	add page
							scope.addPage(false);
							scope.$digest();
							
							expect(scope.canvas.currentProject.content.children.length).toBe(pageCount+1);
							expect(scope.canvas.dirty).toBeTruthy();
							
							//	process save that happens on page add
							$httpBackend.flush();
							expect(scope.canvas.dirty).toBeFalsy();
							
							scope.selectPageByIndex(pageCount);
							scope.deletePage(scope.canvas.currentPage,false);
							expect(scope.canvas.currentProject.content.children.length).toBe(pageCount);
						}
					)			
				);
				
				it
				(
					'should update the current page\'s children when applying a template and remove it after clearing',
					inject
					(
						function($controller,$httpBackend)
						{
							//	mock initializing a project via url
							rootScope.currentUser = loggedInUser;
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope,$routeParams:{projectId:1,pageId:1}});
							scope.$apply( function(){ scope.init();} );
							$httpBackend.flush();
							
							var template = templates[0];
							scope.setTemplate( template );
							scope.$digest();
							
							//	templates assume the identity of the element on which they are based when applied, 
							//	so the best we can do is check that the componentIds are the same
							expect(scope.canvas.currentPage.children[0].componentId).toEqual( template.componentId );
							
							//	test clearing
							scope.clearCanvas();
							expect(scope.canvas.currentPage.children.length).toEqual(0);
						}
					)			
				);
			}
		);
	}
);