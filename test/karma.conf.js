// Karma configuration
// Generated on Thu Jul 10 2014 18:22:26 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // list of files / patterns to load in the browser
    files: [

      'www/bower_components/jquery/dist/jquery.js',
      'www/bower_components/angular/angular.js',
      'www/bower_components/angular-mocks/angular-mocks.js',
      
      //	app module dependencies
      'www/bower_components/angular-base64/angular-base64.js',
      'www/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'www/bower_components/angular-cookies/angular-cookies.js',
      'www/bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'www/bower_components/angular-http-auth/src/http-auth-interceptor.js',
      'www/bower_components/angular-resource/angular-resource.js',
      'www/bower_components/angular-route/angular-route.js',
      'www/bower_components/angular-sanitize/angular-sanitize.js',
      'www/bower_components/angular-tutorial/angular-tutorial.js',
      'www/bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0.js',
      'www/bower_components/angular-ui-sortable/sortable.js',
      'www/bower_components/angular-webstorage/angular-webstorage.js',
      'www/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'www/bower_components/jquery/dist/jquery.js',
      'www/bower_components/underscore/underscore.js',
      
      'www/app/**/*.js',
      'test/unit/**/*.js',
      
      //	html
      'www/app/**/**/*.html',
      'www/partials/templates/*.html',
      
      // JSON fixture
      {
    	  pattern:  'test/mock/*.json',
    	  watched:  true,
    	  served:   true,
    	  included: false 
      },
	  
      // JSON fixture
      {
    	  pattern:  'www/**/*.json',
    	  watched:  true,
    	  served:   true,
    	  included: false 
      },
		
      // fixture
      {
    	  pattern:  'www/partials/includes/*.html',
    	  watched:  true,
    	  served:   true,
    	  included: true 
      }
    ],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
  
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    
    plugins: [
              'karma-chrome-launcher',
              'karma-jasmine',
              'karma-ng-html2js-preprocessor'
              ],
              
    preprocessors: {
    	'www/partials/templates/*.html': 'ng-html2js',
    	'www/app/**/**/*.html': 'ng-html2js'
    },
    
    ngHtml2JsPreprocessor: 
    {
    	// strip this from the file path
        stripPrefix: 'www/'
      }
  });
};
