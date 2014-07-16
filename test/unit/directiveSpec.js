'use strict';

describe
(
	'DirectiveSpec',
	function($injector)
	{
		var rootScope = null,scope = null;
		var components = null,elements = null,templates = null,sampleData = null;
		
		beforeEach(module('app'));
		beforeEach(module('app/canvas/component-preview/component-preview.directive.html','partials/templates/edit-item.html'));
		
		beforeEach
		(
			inject
			(
				function($rootScope,$httpBackend,library)
				{
					rootScope = $rootScope;
					scope = rootScope.$new();
					
					components = JSON.parse(readFixtures("base/test/mock/components.json"));
					elements = JSON.parse(readFixtures("base/test/mock/elements.json"));
					templates = JSON.parse(readFixtures("base/test/mock/templates.json"));
					sampleData = JSON.parse(readFixtures("base/www/json/sample-data.json"));
					
					$httpBackend.when('GET','api/components').respond( function(){ return [200, components, {}]; } );
					$httpBackend.when('GET','api/elements').respond( function(){ return [200, elements, {}]; } );
					$httpBackend.when('GET','api/templates').respond( function(){ return [200, templates, {}]; } );
					$httpBackend.when('GET','json/sample-data.json').respond( function(){ return [200, sampleData, {}]; } );
				}
			)
		);
		
		describe
		(
			'component-preview',
			function()
			{
				var element = null;
				var sampleElement = null, sampleComponent = null;
				
				beforeEach
				(
					inject
					(
						function($controller,$compile,$httpBackend)
						{
							$controller('CanvasCtrl',{$scope:scope,$rootScope:rootScope});
							scope.$apply( function(){ scope.init();} );
							$httpBackend.flush();
							
							var instance = elements[1];
							instance.type = "element";
							scope.instance = instance;
							
							element = $compile("<component-preview component-instance='instance'></component-preview>")(scope);
							
							scope.$digest();
						}
					)
				);
				
				it('should compile',function(){expect(element).toExist();});
				it('should have a `data-id` attribute matching the instance\'s `id` property',function(){expect(element).toHaveAttr('data-id',scope.instance.id);});
				it('should have a `data-component-id` attribute matching the instance\'s `componentId` property',function(){expect(element).toHaveAttr('data-component-id',scope.instance.componentId);});
				
				it
				(
					'should have a `data-component-type` attribute matching the instance\'s `type` property',
					function()
					{
						expect(element).toHaveAttr('data-component-type',scope.instance.type);
					}
				);
				
				it
				(
					'should set `scope.instance.values.isNew` to undefined when `isNew` == true',
					inject
					(
						function($compile)
						{
							scope.instance.values.isNew = true;
							
							$compile("<component-preview component-instance='instance'></component-preview>")(scope);
							
							scope.$digest();
							
							expect(scope.instance.values.isNew).toBeUndefined();
						}
					)
				);
			}
		);
	}
);